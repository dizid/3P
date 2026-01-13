import type { Context, Config } from "@netlify/functions";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

// Get database connection
const getDb = () => {
  const dbUrl = Netlify.env.get("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL not configured");
  return neon(dbUrl);
};

export default async (req: Request, context: Context) => {
  // Only allow POST
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
      JSON.stringify({ error: "Webhook not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const stripe = new Stripe(stripeKey);

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sql = getDb();

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", session.id);

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const customerEmail = session.customer_email;

        // Get subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Create or update profile
        await sql`
          INSERT INTO profiles (email, stripe_customer_id)
          VALUES (${customerEmail}, ${customerId})
          ON CONFLICT (stripe_customer_id)
          DO UPDATE SET email = COALESCE(EXCLUDED.email, profiles.email)
        `;

        // Get profile ID
        const profiles = await sql`
          SELECT id FROM profiles WHERE stripe_customer_id = ${customerId}
        `;
        const profileId = profiles[0]?.id;

        // Create or update subscription
        await sql`
          INSERT INTO subscriptions (
            profile_id,
            stripe_customer_id,
            stripe_subscription_id,
            status,
            plan,
            current_period_start,
            current_period_end,
            cancel_at_period_end
          )
          VALUES (
            ${profileId},
            ${customerId},
            ${subscriptionId},
            ${subscription.status},
            'pro',
            ${new Date(subscription.current_period_start * 1000).toISOString()},
            ${new Date(subscription.current_period_end * 1000).toISOString()},
            ${subscription.cancel_at_period_end}
          )
          ON CONFLICT (stripe_subscription_id)
          DO UPDATE SET
            status = EXCLUDED.status,
            current_period_start = EXCLUDED.current_period_start,
            current_period_end = EXCLUDED.current_period_end,
            cancel_at_period_end = EXCLUDED.cancel_at_period_end
        `;

        console.log("Subscription saved to database for customer:", customerId);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);

        await sql`
          UPDATE subscriptions
          SET
            status = ${subscription.status},
            current_period_start = ${new Date(subscription.current_period_start * 1000).toISOString()},
            current_period_end = ${new Date(subscription.current_period_end * 1000).toISOString()},
            cancel_at_period_end = ${subscription.cancel_at_period_end}
          WHERE stripe_subscription_id = ${subscription.id}
        `;

        console.log("Subscription updated in database:", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", subscription.id);

        await sql`
          UPDATE subscriptions
          SET status = 'canceled'
          WHERE stripe_subscription_id = ${subscription.id}
        `;

        console.log("Subscription marked as canceled:", subscription.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", invoice.id);

        if (invoice.subscription) {
          await sql`
            UPDATE subscriptions
            SET status = 'past_due'
            WHERE stripe_subscription_id = ${invoice.subscription}
          `;
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(
      JSON.stringify({ received: true, type: event.type }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: "Webhook handler failed",
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
  path: "/api/webhook",
};
