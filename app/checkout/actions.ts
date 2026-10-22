"use server";

import { headers } from "next/headers";
import {
  calculateConfiguredUnitPrice,
  findHardware,
  parseDimensionInches,
} from "@/lib/cart";
import { encodeOrderItemsMetadata, type OrderLineItem } from "@/lib/orders";
import { PLACEHOLDER_PRODUCTS } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

const MAX_LINE_ITEMS = 30;
const MAX_QUANTITY = 99;
const MAX_INCHES = 400;

export type CheckoutCartItem = {
  slug: string;
  name: string;
  category: string;
  color: string;
  width: string;
  height: string;
  structure?: string;
  hardware?: string;
  motor: string;
  mountType: string;
  roomName?: string;
  price: number;
  quantity: number;
};

export type CheckoutSessionResult = { url: string } | { error: string };

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) {
    throw new Error("Unable to determine the site URL for checkout.");
  }

  const forwardedProto = headerList.get("x-forwarded-proto");
  const proto =
    forwardedProto ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${proto}://${host}`;
}

function isCheckoutItem(value: unknown): value is CheckoutCartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.category === "string" &&
    typeof item.color === "string" &&
    typeof item.width === "string" &&
    typeof item.height === "string" &&
    typeof item.motor === "string" &&
    typeof item.quantity === "number" &&
    (item.hardware === undefined || typeof item.hardware === "string") &&
    (item.structure === undefined || typeof item.structure === "string") &&
    (item.mountType === "inside" || item.mountType === "outside") &&
    (item.roomName === undefined || typeof item.roomName === "string") &&
    typeof item.price === "number" &&
    Number.isFinite(item.price)
  );
}

function confirmedTimestamp(value: string): string | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  const now = Date.now();
  if (parsed > now + 5 * 60 * 1000) return null;
  if (now - parsed > 24 * 60 * 60 * 1000) return null;
  return new Date(parsed).toISOString();
}

export async function createCheckoutSession(
  items: CheckoutCartItem[],
  specsConfirmedAt: string
): Promise<CheckoutSessionResult> {
  const confirmedAt = confirmedTimestamp(specsConfirmedAt);
  if (!confirmedAt) {
    return {
      error: "Confirm your custom measurements before checkout.",
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (items.length > MAX_LINE_ITEMS) {
    return { error: "Too many items to check out at once." };
  }
  if (!items.every(isCheckoutItem)) {
    return { error: "The cart could not be read. Refresh and try again." };
  }

  try {
    const origin = await siteOrigin();
    const orderItems: OrderLineItem[] = [];
    const lineItems = items.map((item) => {
      const product = PLACEHOLDER_PRODUCTS.find(
        (entry) => entry.slug === item.slug && entry.category === item.category
      );
      if (!product) {
        throw new Error("A cart item does not match a product in the catalog.");
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_QUANTITY
      ) {
        throw new Error("Each shade needs a quantity between 1 and 99.");
      }

      const widthInches = parseDimensionInches(item.width);
      const heightInches = parseDimensionInches(item.height);
      if (
        widthInches <= 0 ||
        heightInches <= 0 ||
        widthInches > MAX_INCHES ||
        heightInches > MAX_INCHES
      ) {
        throw new Error(
          "Each shade needs a width and height greater than 0 and at most 400 inches."
        );
      }

      const color = clip(item.color, 80);
      const motor = clip(item.motor, 80);
      if (!color || !motor) {
        throw new Error("Each shade needs a color and motor.");
      }

      let hardwareLabel = "Standard";
      let hardwareId = "";
      if (item.hardware) {
        const hardware = findHardware(item.hardware);
        if (!hardware) {
          throw new Error("One of the shades has an unknown hardware finish.");
        }
        hardwareLabel = hardware.label;
        hardwareId = hardware.id;
      }

      const structure = item.structure ? clip(item.structure, 80) : "";
      const roomName = item.roomName ? clip(item.roomName, 40) : "";
      const mountLabel =
        item.mountType === "inside" ? "Inside Mount" : "Outside Mount";
      const unitPrice = calculateConfiguredUnitPrice({
        basePrice: product.price,
        widthInches,
        heightInches,
        hardware: hardwareId || undefined,
      });
      const unitAmount = Math.round(Number(unitPrice.toFixed(2)) * 100);
      if (!Number.isInteger(unitAmount) || unitAmount < 50) {
        throw new Error("Calculated price is too small to charge.");
      }

      orderItems.push({
        slug: product.slug,
        name: product.name,
        category: product.category,
        width: String(widthInches),
        height: String(heightInches),
        color,
        hardware: hardwareLabel,
        motor,
        ...(structure ? { structure } : {}),
        mountType: item.mountType,
        ...(roomName ? { roomName } : {}),
        quantity: item.quantity,
        unitPrice,
      });

      const dimensions = `${widthInches}" W × ${heightInches}" H`;
      const description = [
        product.category,
        dimensions,
        `Color: ${color}`,
        `Hardware: ${hardwareLabel}`,
        `Motor: ${motor}`,
        `Mount: ${mountLabel}`,
        structure ? `Structure: ${structure}` : "",
        roomName ? `Room: ${roomName}` : "",
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: `${product.name} — ${dimensions}`.slice(0, 250),
            description: description.slice(0, 500),
            metadata: {
              slug: product.slug,
              category: product.category,
              width_in: String(widthInches),
              height_in: String(heightInches),
              color,
              hardware: hardwareLabel,
              motor,
              mount_type: item.mountType,
              ...(structure ? { structure } : {}),
              ...(roomName ? { room_name: roomName } : {}),
            },
          },
        },
      };
    });

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        ...encodeOrderItemsMetadata(orderItems),
        specsConfirmedAt: confirmedAt,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    if (!session.url) {
      return { error: "Stripe did not return a checkout URL." };
    }

    return { url: session.url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "STRIPE_SECRET_KEY is not set") {
      return {
        error:
          "Checkout is not configured. Add STRIPE_SECRET_KEY to the server environment.",
      };
    }
    if (
      message.startsWith("A cart item") ||
      message.startsWith("Each shade") ||
      message.startsWith("One of the shades") ||
      message.startsWith("Calculated price") ||
      message.startsWith("Unable to determine") ||
      message.startsWith("Unknown hardware") ||
      message.startsWith("Order details")
    ) {
      return { error: message };
    }
    console.error("createCheckoutSession failed");
    return { error: "Unable to start checkout. Please try again." };
  }
}
