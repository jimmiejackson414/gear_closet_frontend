import type Stripe from 'stripe';

/**
 * Billing period lives on SubscriptionItem (Basil+), not Subscription.
 * We only sell single-item subscriptions, so the first item is authoritative.
 */
export function getSubscriptionItemPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  if (!item) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Subscription has no items',
    });
  }

  return {
    current_period_start: item.current_period_start,
    current_period_end: item.current_period_end,
  };
}
