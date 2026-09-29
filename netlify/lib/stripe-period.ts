import type Stripe from "stripe";

/**
 * Billing period of a subscription as ISO strings.
 *
 * Since Stripe API 2025-03-31 (stripe-node v18+, we use 2025-12-15.clover),
 * current_period_start/end live on the subscription *items*, not on the
 * subscription itself. Reading the old top-level fields gives undefined,
 * which would be stored as "Invalid Date".
 * Returns null for a missing value so the DB stores NULL instead.
 */
export const getSubscriptionPeriod = (
  subscription: Stripe.Subscription
): { start: string | null; end: string | null } => {
  const firstItem = subscription.items?.data?.[0];
  const toIso = (unixSeconds?: number | null) =>
    typeof unixSeconds === "number" ? new Date(unixSeconds * 1000).toISOString() : null;

  return {
    start: toIso(firstItem?.current_period_start),
    end: toIso(firstItem?.current_period_end),
  };
};
