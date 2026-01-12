import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";

export default async (req: Request, context: Context) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripeKey = Netlify.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Payment service not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { priceId, userId, email } = await req.json();

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: priceId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeKey);

    // Get the site URL for redirects
    const siteUrl = Netlify.env.get("URL") || "http://localhost:8888";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card", "ideal"], // Card + iDEAL for Dutch users
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: {
        userId: userId || "anonymous",
      },
      allow_promotion_codes: true,
    };

    // Pre-fill email if provided
    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/create-checkout",
};
