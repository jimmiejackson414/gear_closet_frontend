/**
 * @api {get} /api/stripe/subscription
 * @apiName GetSubscription
 * @summary Fetch the subscription details for the current user
 */
import { isError } from 'h3';
import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { resolveBillingCustomerAccess } from '../../utils/billingAccess';
import { getSubscriptionItemPeriod } from '../../utils/stripe';
import type { Database } from '@/types';
import type { SubscriptionApiResponse } from '@/types/profile';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string);

/**
 * @param event - the H3 event
 */
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

    const { data: customer, error } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('profile_id', user.sub)
      .maybeSingle();

    const customerAccess = resolveBillingCustomerAccess(customer, Boolean(error));
    if (!customerAccess.ok) {
      throw createError({
        statusCode: customerAccess.statusCode,
        statusMessage: customerAccess.statusMessage,
      });
    }

    const stripeCustomer = await stripe.customers.retrieve(customerAccess.stripeCustomerId);

    const subscriptions = await stripe.subscriptions.list({
      customer: customerAccess.stripeCustomerId,
    });

    const nextBillingDate = subscriptions.data[0]
      ? getSubscriptionItemPeriod(subscriptions.data[0]).current_period_end
      : null;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerAccess.stripeCustomerId,
      type: 'card',
    });

    const invoices = await stripe.invoices.list({
      customer: customerAccess.stripeCustomerId,
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
    if (isError(err)) throw err;

    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching stripe subscription',
    });
  }
});
