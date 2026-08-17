/**
 * @api {post} /stripe/subscription Create a subscription
 * @apiName CreateSubscription
 * @summary Create a subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import Stripe from 'stripe';
import {
  getExistingBilling,
  insertCustomerAndSubscription,
  insertSubscriptionRow,
} from '../../utils/persistStripeBilling';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { isPaidPlanIdentifier } from '@/utils/planLimits';
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

  const { subscription } = await readBody(event);

  if (!isPaidPlanIdentifier(subscription)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A paid plan is required',
    });
  }

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    const existingBilling = await getExistingBilling(admin, user.sub);
    if (existingBilling.hasSubscription) {
      return { ok: true };
    }

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

    let stripeCustomerId = existingBilling.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${profile.first_name} ${profile.last_name}`,
        metadata: { profile_id: user.sub },
      });
      stripeCustomerId = stripeCustomer.id;
    }

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: price.id }],
      metadata: { profile_id: user.sub },
    });

    if (existingBilling.stripeCustomerId) {
      await insertSubscriptionRow(admin, {
        profileId: user.sub,
        stripeSubscription,
        priceId: price.id,
      });
    } else {
      await insertCustomerAndSubscription(admin, {
        profileId: user.sub,
        stripeCustomerId,
        stripeSubscription,
        priceId: price.id,
      });
    }

    return { ok: !!stripeSubscription };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating subscription',
    });
  }
});
