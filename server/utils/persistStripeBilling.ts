import { SubscriptionStatus, type Database } from '@/types';
import { getSubscriptionItemPeriod } from './stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

/**
 * Stripe-sourced billing rows. Callers must use the service-role client:
 * `customers` has no INSERT policy and `subscriptions` has no INSERT after
 * migration 52. Always pass the session user's id — never a client-supplied
 * profile_id — so a user cannot persist billing for someone else.
 */
export async function getExistingBilling (
  admin: SupabaseClient<Database>,
  profileId: string,
) {
  const { data: customer } = await admin
    .from('customers')
    .select('stripe_customer_id')
    .eq('profile_id', profileId)
    .maybeSingle();

  const { data: subscription } = await admin
    .from('subscriptions')
    .select('id')
    .eq('profile_id', profileId)
    .maybeSingle();

  return {
    stripeCustomerId: customer?.stripe_customer_id ?? null,
    hasSubscription: Boolean(subscription),
  };
}

export async function insertCustomerRow (
  admin: SupabaseClient<Database>,
  input: {
    profileId: string;
    stripeCustomerId: string;
  },
) {
  const { data: customer, error: customerError } = await admin
    .from('customers')
    .insert({
      stripe_customer_id: input.stripeCustomerId,
      profile_id: input.profileId,
    })
    .select();

  if (customerError || !customer?.length) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error saving customer',
    });
  }
}

export async function insertSubscriptionRow (
  admin: SupabaseClient<Database>,
  input: {
    profileId: string;
    stripeSubscription: Stripe.Subscription;
    priceId: string;
  },
) {
  const period = getSubscriptionItemPeriod(input.stripeSubscription);

  const { data: sub, error: subscriptionError } = await admin
    .from('subscriptions')
    .insert({
      profile_id: input.profileId,
      status: SubscriptionStatus.active,
      metadata: { profile_id: input.profileId },
      price_id: input.priceId,
      quantity: 1,
      cancel_at_period_end: false,
      current_period_start: new Date(period.current_period_start * 1000)
        .toISOString(),
      current_period_end: new Date(period.current_period_end * 1000)
        .toISOString(),
      ended_at: input.stripeSubscription.ended_at
        ? new Date(input.stripeSubscription.ended_at * 1000)
          .toISOString()
        : null,
      stripe_subscription_id: input.stripeSubscription.id,
    })
    .select();

  if (subscriptionError || !sub?.length) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error saving subscription',
    });
  }
}

export async function insertCustomerAndSubscription (
  admin: SupabaseClient<Database>,
  input: {
    profileId: string;
    stripeCustomerId: string;
    stripeSubscription: Stripe.Subscription;
    priceId: string;
  },
) {
  const { data: customer, error: customerError } = await admin
    .from('customers')
    .insert({
      stripe_customer_id: input.stripeCustomerId,
      profile_id: input.profileId,
    })
    .select();

  if (customerError || !customer?.length) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error saving customer',
    });
  }

  await insertSubscriptionRow(admin, {
    profileId: input.profileId,
    stripeSubscription: input.stripeSubscription,
    priceId: input.priceId,
  });
}

export async function updateSubscriptionRecord (
  admin: SupabaseClient<Database>,
  input: {
    profileId: string;
    priceId: string;
    stripeSubscription: Stripe.Subscription;
  },
) {
  const period = getSubscriptionItemPeriod(input.stripeSubscription);

  const { data, error } = await admin
    .from('subscriptions')
    .update({
      price_id: input.priceId,
      current_period_start: new Date(period.current_period_start * 1000)
        .toISOString(),
      current_period_end: new Date(period.current_period_end * 1000)
        .toISOString(),
      ended_at: input.stripeSubscription.ended_at
        ? new Date(input.stripeSubscription.ended_at * 1000)
          .toISOString()
        : null,
      cancel_at_period_end: input.stripeSubscription.cancel_at_period_end,
      stripe_subscription_id: input.stripeSubscription.id,
    })
    .eq('profile_id', input.profileId)
    .select();

  if (error || !data?.length) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating subscription',
    });
  }
}
