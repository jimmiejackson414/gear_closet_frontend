/**
 * @api PUT /api/stripe/subscription
 * @apiName UpdateSubscription
 * @summary Upgrade or downgrade a user's subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import Stripe from 'stripe';
import { updateSubscriptionRecord } from '../../utils/persistStripeBilling';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import type { Database } from '@/types';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string);

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    const { data: subscription, error: subscriptionError } = await supabase.from('subscriptions')
      .select('stripe_subscription_id')
      .eq('profile_id', user.sub)
      .single();

    if (subscriptionError || !subscription) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching subscription',
      });
    }

    const { newPlan } = await readBody(event);

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

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id as string);

    const subscriptionItem = stripeSubscription.items.data[0];
    if (!subscriptionItem) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Subscription item missing',
      });
    }
    const subscriptionItemId = subscriptionItem.id;

    const updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id as string, {
      items: [{ id: subscriptionItemId, price: price.id }],
    });

    await updateSubscriptionRecord(admin, {
      profileId: user.sub,
      priceId: price.id,
      stripeSubscription: updatedStripeSubscription,
    });

    return {
      ok: !!updatedStripeSubscription,
    };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating subscription',
    });
  }
});
