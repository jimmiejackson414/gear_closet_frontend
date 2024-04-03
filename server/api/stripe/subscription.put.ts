/**
 * @api PUT /api/stripe/subscription
 * @apiName UpdateSubscription
 * @summary Upgrade or downgrade a user's subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string, {
  apiVersion: '2023-10-16',
});

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
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
      .select('id')
      .eq('identifier', newPlan)
      .single();

    if (priceError || !price) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching price',
      });
    }

    // Fetch the subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);

    // Get the id of the first item
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Update the subscription in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      items: [{ id: subscriptionItemId, price: price.id }],
    });

    return { ok: !!updatedStripeSubscription };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating subscription',
    });
  }
});
