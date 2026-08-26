/**
 * @api PUT /api/stripe/subscription
 * @apiName UpdateSubscription
 * @summary Upgrade or downgrade a user's subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import { isError } from 'h3';
import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { resolveSubscriptionBillingAccess } from '../../utils/billingAccess';
import { updateSubscriptionRecord } from '../../utils/persistStripeBilling';
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
      .maybeSingle();

    const subscriptionAccess = resolveSubscriptionBillingAccess(
      subscription,
      Boolean(subscriptionError),
    );
    if (!subscriptionAccess.ok) {
      throw createError({
        statusCode: subscriptionAccess.statusCode,
        statusMessage: subscriptionAccess.statusMessage,
      });
    }

    const { newPlan } = await readBody(event);

    const { data: price, error: priceError } = await supabase.from('prices')
      .select('*')
      .eq('identifier', newPlan)
      .single();

    if (priceError || !price) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid plan',
      });
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscriptionAccess.stripeSubscriptionId,
    );

    const subscriptionItem = stripeSubscription.items.data[0];
    if (!subscriptionItem) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subscription item missing',
      });
    }

    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscriptionAccess.stripeSubscriptionId,
      {
        items: [{ id: subscriptionItem.id, price: price.id }],
      },
    );

    await updateSubscriptionRecord(admin, {
      priceId: price.id,
      profileId: user.sub,
      stripeSubscription: updatedStripeSubscription,
    });

    return {
      ok: !!updatedStripeSubscription,
    };
  } catch (err) {
    if (isError(err)) throw err;

    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating subscription',
    });
  }
});
