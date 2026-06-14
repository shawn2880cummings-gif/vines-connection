import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// Creates a $36/month subscription Checkout Session for the
// "Architects of Reality" membership tier (price defined inline).
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Architects of Reality — Membership",
              description:
                "Private research AI grounded in Shawn Cummings' work, plus members-first access.",
            },
            unit_amount: 3600, // $36.00
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/architects?subscribed=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/architects`,
      metadata: { tier: "architects-of-reality" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Architects checkout error:", error);
    return NextResponse.json(
      { error: "Failed to start membership checkout" },
      { status: 500 }
    );
  }
}
