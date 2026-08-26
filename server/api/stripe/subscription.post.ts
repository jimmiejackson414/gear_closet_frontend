/**
 * @api {post} /stripe/subscription Create a subscription
 * @apiName CreateSubscription
 * @summary Create a subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import { isError } from 'h3';
import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { isPaidPlanIdentifier } from '@/utils/planLimits';
import { createOrSyncPaidSubscription } from '../../utils/stripeSubscriptionCreate';
import type { Database } from '~/types';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string);

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const { paymentMethodId, subscription } = await readBody(event);

  if (!isPaidPlanIdentifier(subscription)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A paid plan is required',
    });
  }

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    const { data: price, error: priceError } = await supabase.from('prices')
      .select('id')
      .eq('identifier', subscription)
      .single();

    const { data: profile, error: profileError } = await supabase.from('profiles')
      .select('*')
      .eq('id', user.sub)
      .single();

    if (priceError || !price || profileError || !profile) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching data',
      });
    }

    return await createOrSyncPaidSubscription(stripe, admin, {
      email: user.email,
      name: `${profile.first_name} ${profile.last_name}`,
      paymentMethodId: typeof paymentMethodId === 'string' ? paymentMethodId : undefined,
      priceId: price.id,
      profileId: user.sub,
    });
  } catch (err) {
    if (isError(err)) throw err;

    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating subscription',
    });
  }
});
