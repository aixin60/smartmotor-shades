import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type Stripe from "stripe";
import {
  decodeOrderItems,
  deterministicOrderNumber,
  type FulfillmentStatus,
  type Order,
  type OrderLineItem,
  type ShippingAddress,
} from "@/lib/order-model";
import { getStripe } from "@/lib/stripe";

export {
  decodeOrderItems,
  encodeOrderItemsMetadata,
  formatOrderMoney,
  FULFILLMENT_STATUSES,
  type FulfillmentStatus,
  type Order,
  type OrderLineItem,
  type ShippingAddress,
} from "@/lib/order-model";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

let writeQueue: Promise<void> = Promise.resolve();

function withOrderLock<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function isFulfillmentStatus(value: unknown): value is FulfillmentStatus {
  return (
    value === "paid" || value === "in_production" || value === "shipped"
  );
}

function isLineItem(value: unknown): value is OrderLineItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.category === "string" &&
    typeof item.width === "string" &&
    typeof item.height === "string" &&
    typeof item.color === "string" &&
    typeof item.hardware === "string" &&
    typeof item.motor === "string" &&
    typeof item.quantity === "number" &&
    typeof item.unitPrice === "number" &&
    (item.structure === undefined || typeof item.structure === "string")
  );
}

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const order = value as Record<string, unknown>;
  const address = order.shippingAddress;
  if (!address || typeof address !== "object") return false;
  const shipping = address as Record<string, unknown>;
  return (
    typeof order.id === "string" &&
    typeof order.sessionId === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.customerName === "string" &&
    typeof order.email === "string" &&
    typeof order.phone === "string" &&
    typeof shipping.line1 === "string" &&
    typeof shipping.city === "string" &&
    typeof shipping.country === "string" &&
    typeof order.totalAmount === "number" &&
    typeof order.currency === "string" &&
    typeof order.paymentStatus === "string" &&
    isFulfillmentStatus(order.fulfillmentStatus) &&
    Array.isArray(order.items) &&
    order.items.every(isLineItem)
  );
}

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await readFile(ORDERS_PATH, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrder);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}

function isReadOnlyFilesystem(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException).code;
  return code === "EROFS" || code === "EACCES" || code === "EPERM";
}

async function writeOrders(orders: Order[]): Promise<void> {
  await mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  const temporaryPath = `${ORDERS_PATH}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(orders, null, 2));
  await rename(temporaryPath, ORDERS_PATH);
}

async function tryWriteOrders(orders: Order[]): Promise<void> {
  try {
    await writeOrders(orders);
  } catch (error) {
    if (!isReadOnlyFilesystem(error)) throw error;
  }
}

function text(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function addressFromSession(session: Stripe.Checkout.Session): ShippingAddress {
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address ?? session.customer_details?.address;
  return {
    name: text(shipping?.name) || text(session.customer_details?.name),
    line1: text(address?.line1),
    line2: text(address?.line2),
    city: text(address?.city),
    state: text(address?.state),
    postalCode: text(address?.postal_code),
    country: text(address?.country),
  };
}

function orderDraftFromSession(session: Stripe.Checkout.Session): Omit<
  Order,
  "id" | "fulfillmentStatus"
> {
  if (!session.id) {
    throw new Error("Checkout session is missing an id.");
  }

  const amountCents = session.amount_total ?? 0;
  return {
    sessionId: session.id,
    createdAt: new Date((session.created || Date.now() / 1000) * 1000).toISOString(),
    customerName: text(session.customer_details?.name) || text(session.collected_information?.shipping_details?.name),
    email: text(session.customer_details?.email) || text(session.customer_email),
    phone: text(session.customer_details?.phone),
    shippingAddress: addressFromSession(session),
    totalAmount: amountCents / 100,
    currency: text(session.currency) || "usd",
    paymentStatus: session.payment_status || "unpaid",
    items: itemsFromSession(session),
  };
}

function specsConfirmedAtFrom(
  session: Stripe.Checkout.Session
): string | undefined {
  const raw = session.metadata?.specsConfirmedAt;
  if (!raw || Number.isNaN(Date.parse(raw))) return undefined;
  return new Date(raw).toISOString();
}

function fulfillmentFromMetadata(
  value: string | undefined
): FulfillmentStatus | null {
  if (value === "paid" || value === "in_production" || value === "shipped") {
    return value;
  }
  return null;
}

function itemsFromSession(session: Stripe.Checkout.Session): OrderLineItem[] {
  const fromMetadata = decodeOrderItems(session.metadata);
  if (fromMetadata.length > 0) return fromMetadata;

  const lines = session.line_items?.data ?? [];
  const items: OrderLineItem[] = [];
  for (const line of lines) {
    const quantity = line.quantity ?? 1;
    const unitAmount =
      line.price?.unit_amount ??
      (quantity > 0 ? Math.round(line.amount_subtotal / quantity) : 0);
    const unitPrice = unitAmount / 100;
    const product = line.price?.product;
    if (product && typeof product === "object" && !("deleted" in product && product.deleted)) {
      const meta = product.metadata ?? {};
      if (meta.slug || meta.width_in || meta.category) {
        items.push({
          slug: meta.slug ?? "",
          name: product.name || line.description || "Custom shade",
          category: meta.category ?? "",
          width: meta.width_in ?? "",
          height: meta.height_in ?? "",
          color: meta.color ?? "",
          hardware: meta.hardware ?? "",
          motor: meta.motor ?? "",
          ...(meta.structure ? { structure: meta.structure } : {}),
          ...(meta.mount_type ? { mountType: meta.mount_type } : {}),
          ...(meta.room_name ? { roomName: meta.room_name } : {}),
          quantity,
          unitPrice,
        });
        continue;
      }
    }
    const parsed = parseShadeText(line.description, quantity, unitPrice);
    if (parsed) items.push(parsed);
  }
  return items;
}

function normalizeMount(value: string): string {
  const trimmed = value.trim();
  const key = trimmed.toLowerCase();
  if (key === "inside" || key === "inside mount") return "inside";
  if (key === "outside" || key === "outside mount") return "outside";
  return trimmed;
}

function fieldAfter(source: string, label: string): string {
  const match = source.match(new RegExp(`${label}:\\s*([^·]+)`));
  return match?.[1]?.trim() ?? "";
}

function parseShadeText(
  description: string | null,
  quantity: number,
  unitPrice: number
): OrderLineItem | null {
  if (!description) return null;
  const named = description.match(
    /^(.+?) — (\d+(?:\.\d+)?)" W × (\d+(?:\.\d+)?)" H$/
  );
  if (named) {
    return {
      slug: "",
      name: named[1],
      category: "",
      width: named[2],
      height: named[3],
      color: "",
      hardware: "",
      motor: "",
      quantity,
      unitPrice,
    };
  }

  const size = description.match(/(\d+(?:\.\d+)?)" W × (\d+(?:\.\d+)?)" H/);
  if (!size && !description.includes("Color:")) return null;
  const category = description.split(" · ")[0]?.trim() ?? "";
  return {
    slug: "",
    name: category || "Custom shade",
    category,
    width: size?.[1] ?? "",
    height: size?.[2] ?? "",
    color: fieldAfter(description, "Color"),
    hardware: fieldAfter(description, "Hardware"),
    motor: fieldAfter(description, "Motor"),
    ...(fieldAfter(description, "Structure")
      ? { structure: fieldAfter(description, "Structure") }
      : {}),
    ...(fieldAfter(description, "Mount")
      ? { mountType: normalizeMount(fieldAfter(description, "Mount")) }
      : {}),
    ...(fieldAfter(description, "Room")
      ? { roomName: fieldAfter(description, "Room") }
      : {}),
    quantity,
    unitPrice,
  };
}

function orderFromStripeSession(
  session: Stripe.Checkout.Session,
  local: Order | undefined
): Order {
  const draft = orderDraftFromSession(session);
  const storedNumber = session.metadata?.orderNumber?.trim() ?? "";
  return {
    ...draft,
    id: /^SM-[A-Z0-9]+$/.test(storedNumber)
      ? storedNumber
      : deterministicOrderNumber(session.id),
    customerName: draft.customerName || local?.customerName || "",
    email: draft.email || local?.email || "",
    phone: draft.phone || local?.phone || "",
    shippingAddress: draft.shippingAddress.line1
      ? draft.shippingAddress
      : local?.shippingAddress ?? draft.shippingAddress,
    totalAmount: draft.totalAmount || local?.totalAmount || 0,
    items: draft.items.length > 0 ? draft.items : local?.items ?? [],
    fulfillmentStatus:
      fulfillmentFromMetadata(session.metadata?.fulfillmentStatus) ??
      local?.fulfillmentStatus ??
      "paid",
    specsConfirmedAt:
      specsConfirmedAtFrom(session) ?? local?.specsConfirmedAt,
  };
}

async function listCompletedStripeSessions(): Promise<Stripe.Checkout.Session[]> {
  const stripe = getStripe();
  const sessions: Stripe.Checkout.Session[] = [];
  let startingAfter: string | undefined;
  let expandLineItems = true;

  while (sessions.length < 1000) {
    try {
      const page = await stripe.checkout.sessions.list({
        limit: 100,
        status: "complete",
        ...(startingAfter ? { starting_after: startingAfter } : {}),
        ...(expandLineItems ? { expand: ["data.line_items"] } : {}),
      });
      sessions.push(...page.data);
      if (!page.has_more || page.data.length === 0) break;
      startingAfter = page.data[page.data.length - 1]?.id;
      if (!startingAfter) break;
    } catch (error) {
      if (!expandLineItems) throw error;
      expandLineItems = false;
    }
  }

  return sessions;
}

function sortOrders(orders: Order[]): Order[] {
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function listOrders(): Promise<Order[]> {
  const local = await readOrders();
  if (!process.env.STRIPE_SECRET_KEY) return sortOrders(local);

  try {
    const sessions = await listCompletedStripeSessions();
    const localBySession = new Map(local.map((order) => [order.sessionId, order]));
    const stripeOrders = sessions.map((session) =>
      orderFromStripeSession(session, localBySession.get(session.id))
    );
    const stripeIds = new Set(sessions.map((session) => session.id));
    const localOnly = local.filter((order) => !stripeIds.has(order.sessionId));
    return sortOrders([...stripeOrders, ...localOnly]);
  } catch {
    return sortOrders(local);
  }
}

export async function upsertOrderFromSession(
  session: Stripe.Checkout.Session
): Promise<Order> {
  const draft = orderDraftFromSession(session);

  return withOrderLock(async () => {
    const orders = await readOrders();
    const existingIndex = orders.findIndex(
      (order) => order.sessionId === draft.sessionId
    );

    if (existingIndex === -1) {
      const created: Order = {
        ...draft,
        id: deterministicOrderNumber(draft.sessionId),
        fulfillmentStatus:
          fulfillmentFromMetadata(session.metadata?.fulfillmentStatus) ?? "paid",
        specsConfirmedAt: specsConfirmedAtFrom(session),
      };
      orders.unshift(created);
      await tryWriteOrders(orders);
      return created;
    }

    const existing = orders[existingIndex];
    const updated: Order = {
      ...existing,
      customerName: draft.customerName || existing.customerName,
      email: draft.email || existing.email,
      phone: draft.phone || existing.phone,
      shippingAddress: draft.shippingAddress.line1
        ? draft.shippingAddress
        : existing.shippingAddress,
      totalAmount: draft.totalAmount || existing.totalAmount,
      currency: draft.currency || existing.currency,
      paymentStatus: draft.paymentStatus || existing.paymentStatus,
      items: draft.items.length > 0 ? draft.items : existing.items,
      specsConfirmedAt:
        specsConfirmedAtFrom(session) ?? existing.specsConfirmedAt,
    };
    orders[existingIndex] = updated;
    await tryWriteOrders(orders);
    return updated;
  });
}

function stripeResourceMissing(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const details = error as { code?: string; statusCode?: number };
  return details.code === "resource_missing" || details.statusCode === 404;
}

export async function updateOrderFulfillment(
  sessionId: string,
  status: FulfillmentStatus
): Promise<Order | null> {
  if (!isFulfillmentStatus(status)) return null;

  let stripeSession: Stripe.Checkout.Session | null = null;
  if (process.env.STRIPE_SECRET_KEY && sessionId.startsWith("cs_")) {
    try {
      stripeSession = await getStripe().checkout.sessions.update(sessionId, {
        metadata: {
          fulfillmentStatus: status,
          orderNumber: deterministicOrderNumber(sessionId),
        },
      });
    } catch (error) {
      if (!stripeResourceMissing(error)) throw error;
    }
  }

  const localOrder = await withOrderLock(async () => {
    const orders = await readOrders();
    const index = orders.findIndex((order) => order.sessionId === sessionId);
    if (index === -1) return null;
    const updated: Order = { ...orders[index], fulfillmentStatus: status };
    orders[index] = updated;
    await tryWriteOrders(orders);
    return updated;
  });

  if (stripeSession) {
    return orderFromStripeSession(
      { ...stripeSession, metadata: { ...stripeSession.metadata, fulfillmentStatus: status } },
      localOrder ?? undefined
    );
  }
  return localOrder;
}
