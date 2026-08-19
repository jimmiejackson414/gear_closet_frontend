/**
 * @api {post} /api/stripe/payment-method
 * @apiName AttachPaymentMethod
 * @summary Attach a new payment method to a customer
 * @param { PaymentMethod } paymentMethod.body.required - The payment method to attach
 */
import { isError } from 'h3';
import Stripe from 'stripe';
import { getExistingBilling, insertCustomerRow } from '../../utils/persistStripeBilling';
import { ensureStripeCustomerId } from '../../utils/stripeSubscriptionCreate';
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

  const { paymentMethodId } = await readBody(event);
  if (!paymentMethodId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment method required',
    });
  }

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    const { data: profile, error: profileError } = await supabase.from('profiles')
      .select('first_name, last_name')
      .eq('id', user.sub)
      .single();

    if (profileError || !profile) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching profile',
      });
    }

    const billing = await getExistingBilling(admin, user.sub);
    let stripeCustomerId = billing.stripeCustomerId;

    if (!stripeCustomerId) {
      stripeCustomerId = await ensureStripeCustomerId(stripe, {
        profileId: user.sub,
        email: user.email,
        name: `${profile.first_name} ${profile.last_name}`,
      });

      try {
        await insertCustomerRow(admin, {
          profileId: user.sub,
          stripeCustomerId,
        });
      } catch {
        const afterInsert = await getExistingBilling(admin, user.sub);
        if (!afterInsert.stripeCustomerId) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Error creating customer',
          });
        }
        stripeCustomerId = afterInsert.stripeCustomerId;
      }
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });

    return {
      paymentMethods: paymentMethods.data,
    };
  } catch (err) {
    if (isError(err)) throw err;

    throw createError({
      statusCode: 500,
      statusMessage: 'Error attaching payment method',
    });
  }
});
