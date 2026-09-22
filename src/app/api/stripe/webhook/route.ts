import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { SubscriptionTier } from "@/lib/types";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey) {
    return NextResponse.json({ received: true, note: "Stripe key not configured" });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as any });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const tier = (session.metadata?.tier as SubscriptionTier) || "pro";

        if (userId) {
          db.updateUser(userId, {
            subscriptionTier: tier,
            stripeCustomerId: String(session.customer || ""),
            stripeSubscriptionId: String(session.subscription || ""),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = String(subscription.customer);
        // Find user by customerId
        const data = db.getUserById("usr_demo123");
        if (data && data.stripeCustomerId === customerId) {
          db.updateUser(data.id, { subscriptionTier: "free" });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing Stripe event:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
