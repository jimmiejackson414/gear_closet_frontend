/**
 * @api {post} /stripe/subscription Create a subscription
 * @apiName CreateSubscription
 * @summary Create a subscription in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 */

import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { type Database, SubscriptionStatus } from '~/types';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string);

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    // Read the subscription from the request body
    const { subscription } = await readBody(event);

    // Fetch the price ID for the new plan from Supabase
    const { data: price, error: priceError } = await supabase.from('prices')
      .select('id')
      .eq('identifier', subscription)
      .single();

    // Fetch the user's profile from Supabase
    const { data: profile, error: profileError } = await supabase.from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (priceError || !price || profileError || !profile) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching data',
      });
    }

    // Create the customer in Stripe
    const stripeCustomer = await stripe.customers.create({
      email: user!.email,
      metadata: { profile_id: user!.id },
      name: `${profile.first_name} ${profile!.last_name}`,
    });

    // Create the subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: price.id }],
    });

    // Save the customer in Supabase
    const { data: customer, error: customerError } = await supabase.from('customers')
      .insert({
        profile_id: user!.id,
        stripe_customer_id: stripeCustomer.id,
      })
      .select();

    if (customerError || !customer) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error saving customer',
      });
    }

    // Save the subscription ID to your database
    const { data: sub, error: subscriptionError } = await supabase.from('subscriptions')
      .insert({
        cancel_at_period_end: false,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000)
          .toISOString(),
        current_period_start: new Date(stripeSubscription.current_period_start * 1000)
          .toISOString(),
        ended_at: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000)
          .toISOString() : null,
        metadata: { profile_id: user!.id },
        price_id: price.id,
        profile_id: user!.id,
        quantity: 1,
        status: SubscriptionStatus.active,
        stripe_subscription_id: stripeSubscription.id,
      })
      .select();

    if (subscriptionError || !sub) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error saving subscription',
      });
    }

    return { ok: !!stripeSubscription };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating subscription',
    });
  }
});
