import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";

export default async (req: Request, context: Context) => {
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
    const { customerId } = await req.json();

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "Customer ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeKey);

    // Get site URL for return
    const siteUrl =
      Netlify.env.get("URL") || Netlify.env.get("DEPLOY_URL") || "http://localhost:5173";

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/pricing`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Customer portal error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create portal session",
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
  path: "/api/customer-portal",
};
