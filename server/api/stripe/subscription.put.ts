/**
 * @api PUT /api/stripe/subscription
 * @apiName UpdateSubscription
 * @summary Upgrade or downgrade a user's subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Database } from '@/types';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string);

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    // Fetch the user's subscription from your database
    const { data: subscription, error: subscriptionError } = await supabase.from('subscriptions')
      .select('stripe_subscription_id')
      .eq('profile_id', user!.id)
      .single();

    if (subscriptionError || !subscription) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching subscription',
      });
    }

    // Read the new plan from the request body
    const { newPlan } = await readBody(event);

    // Fetch the price ID for the new plan from your database
    const { data: price, error: priceError } = await supabase.from('prices')
      .select('*')
      .eq('identifier', newPlan)
      .single();

    if (priceError || !price) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching price',
      });
    }

    // Fetch the subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id as string);

    // Get the id of the first item
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Update the subscription in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id as string, {
      items: [{ id: subscriptionItemId, price: price.id }],
    });

    // Update the subscription in Supabase
    const { data: updatedSubscription, error: updatedSubscriptionError } = await supabase.from('subscriptions')
      .update({
        cancel_at_period_end: updatedStripeSubscription.cancel_at_period_end,
        current_period_end: new Date(updatedStripeSubscription.current_period_end)
          .toISOString(),
        current_period_start: new Date(updatedStripeSubscription.current_period_start)
          .toISOString(),
        ended_at: updatedStripeSubscription.ended_at ? new Date(updatedStripeSubscription.ended_at)
          .toISOString() : null,
        price_id: price.id,
        stripe_subscription_id: updatedStripeSubscription.id,
      })
      .eq('profile_id', user!.id)
      .select();

    if (updatedSubscriptionError || !updatedSubscription) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error updating subscription',
      });
    }

    return {
      ok: !!updatedStripeSubscription,
    };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating subscription',
    });
  }
});
