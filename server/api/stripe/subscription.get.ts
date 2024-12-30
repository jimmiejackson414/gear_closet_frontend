/**
 * @api {get} /api/stripe/subscription
 * @apiName GetSubscription
 * @summary Fetch the subscription details for the current user
 */
import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Database } from '@/types';
import type { SubscriptionApiResponse } from '@/types/helpers';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string, {
  apiVersion: '2024-06-20',
});

/**
 * @param event - the H3 event
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    // fetch customer from supabase first
    const { data: customer, error } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('profile_id', user!.id)
      .maybeSingle();

    if (error || !customer) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching customer',
      });
    }

    // fetch the customer from stripe
    const stripeCustomer = await stripe.customers.retrieve(customer.stripe_customer_id as string);

    // fetch the subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id as string,
    });

    // get the next billing date
    const nextBillingDate = subscriptions.data[0]?.current_period_end ?? null;

    // fetch the payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.stripe_customer_id as string,
      type: 'card',
    });

    // fetch the invoices
    const invoices = await stripe.invoices.list({
      customer: customer.stripe_customer_id as string,
      limit: 15,
    });

    return {
      customer: stripeCustomer,
      subscriptions: subscriptions.data,
      nextBillingDate,
      paymentMethods: paymentMethods.data,
      invoices: invoices.data,
    } as SubscriptionApiResponse;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Catch error fetching stripe subscription',
    });
  }
});
