import Link from "next/link";
import ClearCartOnSuccess from "@/components/checkout/ClearCartOnSuccess";
import { formatOrderMoney, upsertOrderFromSession, type Order } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string | string[] }>;
}

async function captureSession(
  sessionId: string | undefined
): Promise<{ order: Order } | { message: string }> {
  if (!sessionId) {
    return {
      message:
        "We could not find a checkout session on this page. If you completed payment, open the confirmation link from Stripe.",
    };
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete") {
      return {
        message:
          "This checkout is not complete yet. Your cart is unchanged until Stripe confirms payment.",
      };
    }
    const order = await upsertOrderFromSession(session);
    return { order };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "STRIPE_SECRET_KEY is not set") {
      return {
        message:
          "Payment may have succeeded, but this server cannot read the Stripe session yet. Add STRIPE_SECRET_KEY and refresh this page.",
      };
    }
    return {
      message:
        "Payment may have succeeded, but we could not save the order from this page. Refresh in a moment, or check the Stripe webhook.",
    };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  const result = await captureSession(sessionId);
  const order = "order" in result ? result.order : null;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      {order ? <ClearCartOnSuccess /> : null}
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
        {order ? "Payment received" : "Checkout"}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium text-charcoal">
        {order ? "Thank you" : "Order not saved yet"}
      </h1>
      {order ? (
        <>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-light">
            Order {order.id} is confirmed
            {order.totalAmount
              ? ` for ${formatOrderMoney(order.totalAmount, order.currency)}`
              : ""}
            . We will make each shade to the dimensions on your receipt.
          </p>
          {order.shippingAddress.line1 ? (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-light">
              Shipping to {order.shippingAddress.line1}
              {order.shippingAddress.city
                ? `, ${order.shippingAddress.city}`
                : ""}
              .
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-light">
          {"message" in result ? result.message : ""}
        </p>
      )}
      <Link
        href="/collections"
        className="mt-8 rounded-sm bg-charcoal px-8 py-3 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-charcoal-light"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
