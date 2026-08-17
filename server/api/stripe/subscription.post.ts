/**
 * @api {post} /stripe/subscription Create a subscription
 * @apiName CreateSubscription
 * @summary Create a subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import Stripe from 'stripe';
import { insertCustomerAndSubscription } from '../../utils/persistStripeBilling';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
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

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    const { subscription } = await readBody(event);

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

    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      name: `${profile.first_name} ${profile.last_name}`,
      metadata: { profile_id: user.sub },
    });

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: price.id }],
      metadata: { profile_id: user.sub },
    });

    await insertCustomerAndSubscription(admin, {
      profileId: user.sub,
      stripeCustomerId: stripeCustomer.id,
      stripeSubscription,
      priceId: price.id,
    });

    return { ok: !!stripeSubscription };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating subscription',
    });
  }
});
