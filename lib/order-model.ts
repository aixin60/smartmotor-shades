export const FULFILLMENT_STATUSES = ["paid", "in_production", "shipped"] as const;

export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

export interface ShippingAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderLineItem {
  slug: string;
  name: string;
  category: string;
  width: string;
  height: string;
  color: string;
  hardware: string;
  motor: string;
  structure?: string;
  mountType?: string;
  roomName?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  sessionId: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: FulfillmentStatus;
  specsConfirmedAt?: string;
  items: OrderLineItem[];
}

const METADATA_VALUE_LIMIT = 500;
const MAX_METADATA_CHUNKS = 40;

interface CompactLineItem {
  s: string;
  n: string;
  g: string;
  w: string;
  h: string;
  c: string;
  hw: string;
  m: string;
  st?: string;
  mt?: string;
  rm?: string;
  q: number;
  p: number;
}

function toCompact(item: OrderLineItem): CompactLineItem {
  const compact: CompactLineItem = {
    s: item.slug.slice(0, 80),
    n: item.name.slice(0, 80),
    g: item.category.slice(0, 40),
    w: item.width.slice(0, 12),
    h: item.height.slice(0, 12),
    c: item.color.slice(0, 40),
    hw: item.hardware.slice(0, 40),
    m: item.motor.slice(0, 40),
    q: item.quantity,
    p: item.unitPrice,
  };
  if (item.structure) compact.st = item.structure.slice(0, 40);
  if (item.mountType) compact.mt = item.mountType.slice(0, 20);
  if (item.roomName) compact.rm = item.roomName.slice(0, 40);
  return compact;
}

function fromCompact(value: unknown): OrderLineItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (
    typeof item.s !== "string" ||
    typeof item.n !== "string" ||
    typeof item.g !== "string" ||
    typeof item.w !== "string" ||
    typeof item.h !== "string" ||
    typeof item.c !== "string" ||
    typeof item.hw !== "string" ||
    typeof item.m !== "string" ||
    typeof item.q !== "number" ||
    typeof item.p !== "number" ||
    (item.st !== undefined && typeof item.st !== "string") ||
    (item.mt !== undefined && typeof item.mt !== "string") ||
    (item.rm !== undefined && typeof item.rm !== "string")
  ) {
    return null;
  }

  const line: OrderLineItem = {
    slug: item.s,
    name: item.n,
    category: item.g,
    width: item.w,
    height: item.h,
    color: item.c,
    hardware: item.hw,
    motor: item.m,
    quantity: item.q,
    unitPrice: item.p,
  };
  if (typeof item.st === "string" && item.st) line.structure = item.st;
  if (typeof item.mt === "string" && item.mt) line.mountType = item.mt;
  if (typeof item.rm === "string" && item.rm) line.roomName = item.rm;
  return line;
}

export function encodeOrderItemsMetadata(
  items: OrderLineItem[]
): Record<string, string> {
  const chunks: string[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length === 0) return;
    chunks.push(`[${current.join(",")}]`);
    current = [];
  };

  for (const item of items) {
    const encoded = JSON.stringify(toCompact(item));
    if (encoded.length + 2 > METADATA_VALUE_LIMIT) {
      throw new Error("Order details are too large to check out at once.");
    }

    const nextLength =
      2 +
      current.reduce((sum, entry) => sum + entry.length, 0) +
      Math.max(current.length - 1, 0) +
      (current.length > 0 ? 1 : 0) +
      encoded.length;

    if (current.length > 0 && nextLength > METADATA_VALUE_LIMIT) {
      flush();
    }
    current.push(encoded);
  }
  flush();

  if (chunks.length > MAX_METADATA_CHUNKS) {
    throw new Error("Order details are too large to check out at once.");
  }

  const metadata: Record<string, string> = {
    item_chunks: String(chunks.length),
  };
  chunks.forEach((chunk, index) => {
    metadata[`items_${index}`] = chunk;
  });
  return metadata;
}

export function decodeOrderItems(
  metadata: { [key: string]: string } | null | undefined
): OrderLineItem[] {
  if (!metadata) return [];
  const count = Number(metadata.item_chunks ?? "0");
  if (!Number.isInteger(count) || count < 0) return [];

  const items: OrderLineItem[] = [];
  for (let index = 0; index < count; index += 1) {
    const raw = metadata[`items_${index}`];
    if (!raw) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!Array.isArray(parsed)) continue;
    for (const entry of parsed) {
      const line = fromCompact(entry);
      if (line) items.push(line);
    }
  }
  return items;
}

export function deterministicOrderNumber(sessionId: string): string {
  const compact = sessionId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const tail = compact.slice(-6).padStart(6, "0");
  return `SM-${tail}`;
}

export function formatOrderMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase() || "USD",
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
