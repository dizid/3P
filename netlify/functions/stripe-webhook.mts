import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripeKey = Netlify.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Netlify.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response(
      JSON.stringify({ error: "Stripe not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response(
      JSON.stringify({ error: "Missing signature" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Invalid signature" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = getDb();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const customerEmail = session.customer_details?.email;

        if (!customerId || !customerEmail) break;

        // Ensure profile exists and link Stripe customer
        const profiles = await sql`
          INSERT INTO profiles (email, stripe_customer_id)
          VALUES (${customerEmail.toLowerCase()}, ${customerId})
          ON CONFLICT (email)
          DO UPDATE SET stripe_customer_id = ${customerId}, updated_at = NOW()
          RETURNING id
        `;
        const profileId = profiles[0].id;

        // Get subscription details from Stripe
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        // Upsert subscription record
        await sql`
          INSERT INTO subscriptions (profile_id, stripe_customer_id, stripe_subscription_id, status, plan, current_period_start, current_period_end)
          VALUES (
            ${profileId},
            ${customerId},
            ${subscriptionId},
            ${sub.status},
            ${"pro"},
            ${new Date(sub.current_period_start * 1000).toISOString()},
            ${new Date(sub.current_period_end * 1000).toISOString()}
          )
          ON CONFLICT (stripe_subscription_id)
          DO UPDATE SET
            status = ${sub.status},
            plan = ${"pro"},
            current_period_start = ${new Date(sub.current_period_start * 1000).toISOString()},
            current_period_end = ${new Date(sub.current_period_end * 1000).toISOString()},
            updated_at = NOW()
        `;

        console.log(`Subscription activated for ${customerEmail} (${subscriptionId})`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await sql`
          UPDATE subscriptions
          SET
            status = ${sub.status},
            current_period_start = ${new Date(sub.current_period_start * 1000).toISOString()},
            current_period_end = ${new Date(sub.current_period_end * 1000).toISOString()},
            cancel_at_period_end = ${sub.cancel_at_period_end},
            updated_at = NOW()
          WHERE stripe_subscription_id = ${sub.id}
        `;

        console.log(`Subscription updated: ${sub.id} -> ${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await sql`
          UPDATE subscriptions
          SET status = 'canceled', cancel_at_period_end = FALSE, updated_at = NOW()
          WHERE stripe_subscription_id = ${sub.id}
        `;

        console.log(`Subscription canceled: ${sub.id}`);
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/stripe-webhook",
};
