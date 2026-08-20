import { isError } from 'h3';
import { SubscriptionLevel, SubscriptionStatus, type Database } from '@/types';
import {
  isPaidPlanIdentifier,
  markNeedsFreeSelectionIfExcess,
  resolvePriceIdentifier,
  unlockAllUserResources,
} from './planEntitlements';
import { reportServerError } from './reportServerError';
import { getSubscriptionItemPeriod } from './stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

const throwError = (msg?: string) => {
  throw createError({
    statusCode: 500,
    statusMessage: msg || 'A Stripe error occurred.',
  });
};

type PostgrestErrorLike = { message?: string } | null;

/** Updates/deletes: 0 rows is a no-op (replay or already gone). */
function failOnError (error: PostgrestErrorLike, message: string) {
  if (!error) return;
  throw createError({
    statusCode: 500,
    statusMessage: message,
    cause: error,
  });
}

/** Inserts should return the new row. */
function failOnEmptyInsert<T> (
  error: PostgrestErrorLike,
  data: T[] | null | undefined,
  message: string,
) {
  failOnError(error, message);
  if (!data?.length) throw throwError(message);
}

/**
 * Applies a verified Stripe webhook event to Supabase.
 * Kept separate from signature verification so unit tests can exercise DB writes.
 */
export async function processStripeWebhookEvent (
  event: Stripe.Event,
  supabase: SupabaseClient<Database>,
) {
  try {
    switch (event.type) {
    /**
      * Occurs whenever a new customer is created.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.created}
      */
      case 'customer.created': {
        const customer = event.data.object;

        const { data, error } = await supabase
          .from('customers')
          .insert({
            stripe_customer_id: customer.id,
            profile_id: customer.metadata.profile_id as string,
          })
          .select();

        failOnEmptyInsert(error, data, 'An error occurred while creating a customer');
        break;
      }

      /**
      * Occurs whenever a customer is deleted.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.deleted}
      */
      case 'customer.deleted': {
        const customer = event.data.object;

        const { error } = await supabase
          .from('customers')
          .update({
            deleted_at: new Date()
              .toISOString(),
          })
          .eq('stripe_customer_id', customer.id);

        failOnError(error, 'An error occurred while deleting a customer');
        break;
      }

      /**
      * Occurs whenever a customer is signed up for a new plan.
      * @see {@link https://stripe.com/docs/api/events/types#event_types-customer.subscription.created}
      */
      case 'customer.subscription.created': {
        const subscription = event.data.object;

        const period = getSubscriptionItemPeriod(subscription);
        const subscriptionItem = subscription.items.data[0];
        if (!subscriptionItem) throw throwError('Subscription item missing');

        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            profile_id: subscription.metadata.profile_id as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status as SubscriptionStatus,
            metadata: subscription.metadata,
            price_id: subscriptionItem.price.id,
            quantity: subscriptionItem.quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(period.current_period_start * 1000)
              .toISOString(),
            current_period_end: new Date(period.current_period_end * 1000)
              .toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
              .toISOString() : null,
          })
          .select();

        failOnEmptyInsert(error, data, 'An error occurred while inserting subscription');
        break;
      }

      /**
      * Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
      * @see {@link https://stripe.com/docs/api/events/types#event_types-customer.subscription.updated}
      */
      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        const period = getSubscriptionItemPeriod(subscription);
        const subscriptionItem = subscription.items.data[0];
        if (!subscriptionItem) throw throwError('Subscription item missing');

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status as SubscriptionStatus,
            metadata: subscription.metadata,
            price_id: subscriptionItem.price.id,
            quantity: subscriptionItem.quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(period.current_period_start * 1000)
              .toISOString(),
            current_period_end: new Date(period.current_period_end * 1000)
              .toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
              .toISOString() : null,
          })
          .eq('stripe_subscription_id', subscription.id);

        failOnError(error, 'An error occurred while updating subscription');

        const profileId = subscription.metadata.profile_id as string | undefined;
        if (profileId) {
          const identifier = await resolvePriceIdentifier(supabase, subscriptionItem.price.id);
          if (isPaidPlanIdentifier(identifier)) {
            await unlockAllUserResources(supabase, profileId);
          } else {
            await markNeedsFreeSelectionIfExcess(supabase, profileId);
          }
        }
        break;
      }

      /**
      * Occurs whenever a customer’s subscription ends.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.deleted}
      */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status as SubscriptionStatus,
            canceled_at: new Date()
              .toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        failOnError(error, 'An error occurred while deleting subscription');

        const profileId = subscription.metadata.profile_id as string | undefined;
        if (profileId) {
          await markNeedsFreeSelectionIfExcess(supabase, profileId);
        }
        break;
      }

      /**
      * Occurs whenever a product is created.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-product.created}
      */
      case 'product.created': {
        const product = event.data.object;

        const { data, error } = await supabase
          .from('products')
          .insert({
            id: product.id,
            active: product.active,
            name: product.name.toUpperCase() as SubscriptionLevel,
            description: product.description,
            image: product.images[0],
            metadata: product.metadata,
            environment: product.livemode ? 'production' : 'test',
          })
          .select();

        failOnEmptyInsert(error, data, 'An error occurred while inserting product');
        break;
      }

      /**
      * Occurs whenever a product is updated.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-product.updated}
      */
      case 'product.updated': {
        const product = event.data.object;

        const { error } = await supabase
          .from('products')
          .update({
            active: product.active,
            name: product.name.toUpperCase() as SubscriptionLevel,
            description: product.description,
            image: product.images[0],
            metadata: product.metadata,
            environment: product.livemode ? 'production' : 'test',
          })
          .eq('id', product.id);

        failOnError(error, 'An error occurred while updating product');
        break;
      }

      /**
      * Occurs whenever a product is deleted.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-product.deleted}
      */
      case 'product.deleted': {
        const product = event.data.object;

        const { error } = await supabase
          .from('products')
          .delete()
          .match({ id: product.id });

        failOnError(error, 'An error occurred while deleting product');
        break;
      }

      /**
      * Occurs whenever a price is created.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-price.created}
      */
      case 'price.created': {
        const price = event.data.object;

        const { data, error } = await supabase
          .from('prices')
          .insert({
            id: price.id,
            product_id: price.product as string,
            active: price.active,
            description: price.nickname,
            unit_amount: price.unit_amount,
            currency: price.currency,
            type: price.type,
            interval: price.recurring?.interval as 'day' | 'week' | 'month' | 'year' | undefined,
            interval_count: price.recurring?.interval_count,
            metadata: price.metadata,
            environment: price.livemode ? 'production' : 'test',
          })
          .select();

        failOnEmptyInsert(error, data, 'An error occurred while inserting price');
        break;
      }

      /**
      * Occurs whenever a price is updated.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-price.updated}
      */
      case 'price.updated': {
        const price = event.data.object;

        const { error } = await supabase
          .from('prices')
          .update({
            product_id: price.product as string,
            active: price.active,
            description: price.nickname,
            unit_amount: price.unit_amount,
            currency: price.currency,
            type: price.type,
            interval: price.recurring?.interval as 'day' | 'week' | 'month' | 'year' | undefined,
            interval_count: price.recurring?.interval_count,
            metadata: price.metadata,
            environment: price.livemode ? 'production' : 'test',
          })
          .eq('id', price.id);

        failOnError(error, 'An error occurred while updating price');
        break;
      }

      /**
      * Occurs whenever a price is deleted.
      * @see {@link https://docs.stripe.com/api/events/types#event_types-price.deleted}
      */
      case 'price.deleted': {
        const price = event.data.object;

        const { error } = await supabase
          .from('prices')
          .delete()
          .match({ id: price.id });

        failOnError(error, 'An error occurred while deleting price');
        break;
      }

      default:
        // Unexpected event type
    }
  } catch (err) {
    reportServerError(err, {
      extra: { stripeEventId: event.id },
      tags: { 'stripe.event': event.type },
    });
    if (isError(err)) throw err;
    throw throwError('A Stripe error occurred.');
  }
}
