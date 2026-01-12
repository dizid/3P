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

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", session.id);

        // TODO: When Supabase is set up, update subscription status here
        // For now, log the event
        console.log("Customer:", session.customer);
        console.log("Subscription:", session.subscription);
        console.log("Metadata:", session.metadata);

        // Store subscription info (will be replaced with Supabase)
        // This is where you'd call Supabase to update the user's subscription
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);
        console.log("Status:", subscription.status);
        // TODO: Update subscription status in Supabase
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", subscription.id);
        // TODO: Update subscription status in Supabase
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", invoice.id);
        // TODO: Handle failed payment (notify user, downgrade, etc.)
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
