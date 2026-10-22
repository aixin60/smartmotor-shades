import type Stripe from "stripe";
import { upsertOrderFromSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "STRIPE_SECRET_KEY is not set") {
      return Response.json(
        { error: "STRIPE_SECRET_KEY is not set" },
        { status: 500 }
      );
    }
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const completed = event.data.object;
    try {
      let session = completed;
      try {
        session = await getStripe().checkout.sessions.retrieve(completed.id);
      } catch (error) {
        console.error("Checkout session retrieve failed; saving the event payload");
        if (error instanceof Error && error.message === "STRIPE_SECRET_KEY is not set") {
          throw error;
        }
      }
      await upsertOrderFromSession(session);
    } catch (error) {
      console.error("Failed to save order from checkout.session.completed");
      const message = error instanceof Error ? error.message : "";
      if (message === "STRIPE_SECRET_KEY is not set") {
        return Response.json(
          { error: "STRIPE_SECRET_KEY is not set" },
          { status: 500 }
        );
      }
      return Response.json({ error: "Unable to save order" }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
