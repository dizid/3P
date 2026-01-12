import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";

export default async (req: Request, context: Context) => {
  // Allow GET and POST
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripeKey = Netlify.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Service not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get customer ID from request body or query params
    let customerId: string | null = null;
    let email: string | null = null;

    if (req.method === "POST") {
      const body = await req.json();
      customerId = body.customerId;
      email = body.email;
    } else {
      const url = new URL(req.url);
      customerId = url.searchParams.get("customerId");
      email = url.searchParams.get("email");
    }

    if (!customerId && !email) {
      return new Response(
        JSON.stringify({
          tier: "free",
          status: null,
          features: {
            aiAdvice: false,
            unlimitedHistory: false,
            insights: false,
            export: false,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeKey);

    // Find customer by ID or email
    let customer: Stripe.Customer | null = null;

    if (customerId) {
      try {
        customer = (await stripe.customers.retrieve(
          customerId
        )) as Stripe.Customer;
      } catch {
        // Customer not found
      }
    } else if (email) {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      }
    }

    if (!customer || customer.deleted) {
      return new Response(
        JSON.stringify({
          tier: "free",
          status: null,
          features: {
            aiAdvice: false,
            unlimitedHistory: false,
            insights: false,
            export: false,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Check for trialing subscriptions
      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "trialing",
        limit: 1,
      });

      if (trialingSubscriptions.data.length === 0) {
        return new Response(
          JSON.stringify({
            tier: "free",
            status: null,
            customerId: customer.id,
            features: {
              aiAdvice: false,
              unlimitedHistory: false,
              insights: false,
              export: false,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // User is on trial
      const subscription = trialingSubscriptions.data[0];
      return new Response(
        JSON.stringify({
          tier: "premium",
          status: "trialing",
          customerId: customer.id,
          subscriptionId: subscription.id,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          features: {
            aiAdvice: true,
            unlimitedHistory: true,
            insights: true,
            export: true,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // User has active subscription
    const subscription = subscriptions.data[0];
    return new Response(
      JSON.stringify({
        tier: "premium",
        status: "active",
        customerId: customer.id,
        subscriptionId: subscription.id,
        currentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
        features: {
          aiAdvice: true,
          unlimitedHistory: true,
          insights: true,
          export: true,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Subscription status error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to check subscription status",
        tier: "free",
        status: null,
        features: {
          aiAdvice: false,
          unlimitedHistory: false,
          insights: false,
          export: false,
        },
      }),
      {
        status: 200, // Return 200 with free tier on error
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/subscription-status",
};
