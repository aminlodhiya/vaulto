import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (stripeKey && user.stripeCustomerId && !user.stripeCustomerId.startsWith("cus_test_")) {
      const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as any });
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${origin}/settings`,
      });
      return NextResponse.json({ url: portalSession.url });
    }

    // Fallback if test mode
    return NextResponse.json({ url: `${origin}/settings?billing_portal=sandbox` });
  } catch (error) {
    console.error("Stripe Portal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
