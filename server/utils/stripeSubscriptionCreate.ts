import {
  getExistingBilling,
  insertCustomerRow,
  insertSubscriptionRow,
  updateSubscriptionRecord,
} from './persistStripeBilling';
import type { Database } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

const REUSABLE_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  'active',
  'trialing',
  'past_due',
]);

export function customerIdempotencyKey (profileId: string) {
  return `gc-customer-${profileId}`;
}

export function subscriptionIdempotencyKey (profileId: string) {
  return `gc-subscription-${profileId}`;
}

export async function findStripeCustomerIdForProfile (
  stripe: Stripe,
  profileId: string,
): Promise<string | null> {
  const result = await stripe.customers.search({
    query: `metadata['profile_id']:'${profileId}'`,
    limit: 1,
  });

  return result.data[0]?.id ?? null;
}

export async function ensureStripeCustomerId (
  stripe: Stripe,
  input: {
    profileId: string;
    email?: string | null;
    name: string;
    existingDbCustomerId?: string | null;
  },
): Promise<string> {
  if (input.existingDbCustomerId) {
    return input.existingDbCustomerId;
  }

  const existingStripeCustomerId = await findStripeCustomerIdForProfile(
    stripe,
    input.profileId,
  );
  if (existingStripeCustomerId) {
    return existingStripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: input.email ?? undefined,
    name: input.name,
    metadata: { profile_id: input.profileId },
  }, {
    idempotencyKey: customerIdempotencyKey(input.profileId),
  });

  return customer.id;
}

export async function findReusableStripeSubscription (
  stripe: Stripe,
  customerId: string,
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
  });

  return subscriptions.data.find((subscription) =>
    REUSABLE_SUBSCRIPTION_STATUSES.has(subscription.status),
  ) ?? null;
}

async function attachDefaultPaymentMethod (
  stripe: Stripe,
  customerId: string,
  paymentMethodId: string,
) {
  await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });
}

export async function ensureStripeSubscription (
  stripe: Stripe,
  input: {
    profileId: string;
    customerId: string;
    priceId: string;
    paymentMethodId?: string;
  },
): Promise<Stripe.Subscription> {
  if (input.paymentMethodId) {
    await attachDefaultPaymentMethod(stripe, input.customerId, input.paymentMethodId);
  }

  const existing = await findReusableStripeSubscription(stripe, input.customerId);
  if (!existing) {
    return stripe.subscriptions.create({
      customer: input.customerId,
      items: [{ price: input.priceId }],
      metadata: { profile_id: input.profileId },
    }, {
      idempotencyKey: subscriptionIdempotencyKey(input.profileId),
    });
  }

  const subscriptionItem = existing.items.data[0];
  if (!subscriptionItem) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Subscription item missing',
    });
  }

  if (subscriptionItem.price.id === input.priceId) {
    return existing;
  }

  return stripe.subscriptions.update(existing.id, {
    items: [{ id: subscriptionItem.id, price: input.priceId }],
  });
}

async function persistBillingRows (
  admin: SupabaseClient<Database>,
  input: {
    profileId: string;
    stripeCustomerId: string;
    stripeSubscription: Stripe.Subscription;
    priceId: string;
  },
) {
  const billing = await getExistingBilling(admin, input.profileId);

  if (!billing.stripeCustomerId) {
    try {
      await insertCustomerRow(admin, {
        profileId: input.profileId,
        stripeCustomerId: input.stripeCustomerId,
      });
    } catch (err) {
      const afterInsertAttempt = await getExistingBilling(admin, input.profileId);
      if (!afterInsertAttempt.stripeCustomerId) {
        throw err;
      }
    }
  }

  const billingAfterCustomer = await getExistingBilling(admin, input.profileId);
  if (billingAfterCustomer.hasSubscription) {
    await updateSubscriptionRecord(admin, {
      profileId: input.profileId,
      priceId: input.priceId,
      stripeSubscription: input.stripeSubscription,
    });
    return;
  }

  await insertSubscriptionRow(admin, {
    profileId: input.profileId,
    stripeSubscription: input.stripeSubscription,
    priceId: input.priceId,
  });
}

export async function createOrSyncPaidSubscription (
  stripe: Stripe,
  admin: SupabaseClient<Database>,
  input: {
    profileId: string;
    email?: string | null;
    name: string;
    priceId: string;
    paymentMethodId?: string;
  },
): Promise<{ ok: true }> {
  const existingBilling = await getExistingBilling(admin, input.profileId);
  if (existingBilling.hasSubscription) {
    return { ok: true };
  }

  const stripeCustomerId = await ensureStripeCustomerId(stripe, {
    profileId: input.profileId,
    email: input.email,
    name: input.name,
    existingDbCustomerId: existingBilling.stripeCustomerId,
  });

  const stripeSubscription = await ensureStripeSubscription(stripe, {
    profileId: input.profileId,
    customerId: stripeCustomerId,
    priceId: input.priceId,
    paymentMethodId: input.paymentMethodId,
  });

  await persistBillingRows(admin, {
    profileId: input.profileId,
    stripeCustomerId,
    stripeSubscription,
    priceId: input.priceId,
  });

  return { ok: true };
}
