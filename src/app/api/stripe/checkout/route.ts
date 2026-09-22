import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval = "monthly" } = await req.json();
    const tier = plan === "business" ? "business" : "pro";
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Real Stripe Integration if key is provided and not placeholder
    if (stripeKey && !stripeKey.includes("placeholder") && stripeKey.startsWith("sk_")) {
      const stripe = new Stripe(stripeKey, {
        apiVersion: "2024-12-18.acacia" as any,
      });

      const priceAmount = tier === "business" ? (interval === "yearly" ? 49000 : 4900) : (interval === "yearly" ? 19000 : 1900);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `TeleExpense ${tier.toUpperCase()} Plan`,
                description: `Unlimited invoices, Telegram Bot sync, Google Sheets live sync & cashflow analytics (${interval})`,
              },
              unit_amount: priceAmount,
              recurring: {
                interval: interval === "yearly" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          tier,
        },
        success_url: `${origin}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing?canceled=true`,
      });

      return NextResponse.json({ url: session.url, mock: false });
    }

    // Mock / Test Sandbox Mode (Immediate seamless upgrade for testing without requiring live keys)
    db.updateUser(user.id, {
      subscriptionTier: tier,
      stripeCustomerId: `cus_test_${Date.now()}`,
      stripeSubscriptionId: `sub_test_${Date.now()}`,
    });

    return NextResponse.json({
      url: `${origin}/dashboard?upgraded=true&tier=${tier}`,
      mock: true,
      message: `Successfully upgraded to ${tier.toUpperCase()} plan (Stripe Test Sandbox Mode).`,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
