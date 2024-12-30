/**
 * @api {post} /api/stripe/payment-method
 * @apiName AttachPaymentMethod
 * @summary Attach a new payment method to a customer
 * @param { PaymentMethod } paymentMethod.body.required - The payment method to attach
 */
import Stripe from 'stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Database } from '@/types';

const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET as string, {
  apiVersion: '2024-06-20',
});

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);
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

    // Attach the payment method to the customer
    const { paymentMethodId } = await readBody(event);
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.stripe_customer_id as string,
    });

    // set it as the default payment method
    await stripe.customers.update(customer.stripe_customer_id as string, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // fetch the payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.stripe_customer_id as string,
      type: 'card',
    });

    return {
      paymentMethods: paymentMethods.data,
    };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Catch error attaching stripe payment method to customer',
    });
  }
});
