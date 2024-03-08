import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { SubscriptionApiResponse } from '@/types/helpers';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string, {
  apiVersion: '2023-10-16',
});

/**
 * @param event - the H3 event
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    // fetch customer from supabase first
    const { data: customer, error } = await supabase.from('customers')
      .select('stripe_customer_id')
      .eq('profile_id', user!.id)
      .single();

    if (error || !customer) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching customer',
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
    });

    const nextBillingDate = subscriptions.data[0]?.current_period_end ?? null;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.stripe_customer_id,
      type: 'card',
    });

    const invoices = await stripe.invoices.list({
      customer: customer.stripe_customer_id,
      limit: 15,
    });

    return {
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
