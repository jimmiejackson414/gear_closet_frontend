/**
 * @api {get} /stripe/webhook Stripe Webhook
 * @apiName StripeWebhook
 * @param event - the H3 event
 * @param stipe - the Stripe instance
 * @param stripeEvent - the Stripe Webhook event
 */

import { defineStripeWebhook } from '#stripe';
import { serverSupabaseClient } from '#supabase/server';
import { type Database, SubscriptionLevel, SubscriptionStatus } from '@/types';

const throwError = (msg?: string) => {
  throw createError({
    statusCode: 500,
    statusMessage: msg || 'A Stripe error occurred.',
  });
};

export default defineStripeWebhook(async ({ event, stripeEvent }) => {
  const supabase = await serverSupabaseClient<Database>(event);

  switch (stripeEvent.type) {
  /**
    * Occurs whenever a new customer is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.created}
    */
  case 'customer.created': {
    try {
      const customer = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: customer.created *****');

      const { data, error } = await supabase
        .from('customers')
        .insert({
          stripe_customer_id: customer.id,
          profile_id: customer.metadata.profile_id,
        })
        .select();

      if (error || !data) throw throwError('An error occurred while creating a customer');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while creating a customer');
    }
    break;
  }

  /**
    * Occurs whenever a customer is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.deleted}
    */
  case 'customer.deleted': {
    try {
      const customer = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: customer.deleted *****');

      const { data, error } = await supabase
        .from('customers')
        .update({
          deleted_at: new Date()
            .toISOString(),
        })
        .match({ stripe_customer_id: customer.id, profile_id: customer.metadata.profil_id })
        .select();

      if (error || !data) throw throwError('An error occurred while deleting a customer');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while deleting a customer');
    }
    break;
  }

  /**
    * Occurs whenever a customer is signed up for a new plan.
    * @see {@link https://stripe.com/docs/api/events/types#event_types-customer.subscription.created}
    */
  case 'customer.subscription.created': {
    try {
      const subscription = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: customer.subscription.created *****');

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          profile_id: subscription.metadata.profile_id,
          stripe_subscription_id: subscription.id,
          status: subscription.status as SubscriptionStatus,
          metadata: subscription.metadata,
          price_id: subscription.items.data[0].price.id,
          quantity: subscription.items.data[0].quantity,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date(subscription.current_period_start * 1000)
            .toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000)
            .toISOString(),
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
            .toISOString() : null,
        })
        .select();

      if (error || !data) throw throwError('An error occurred while inserting subscription');
    } catch (error) {
      console.error(error);
      throw throwError('A catch error occurred while inserting subscription');
    }

    break;
  }

  /**
    * Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated}
    */
  case 'customer.subscription.updated': {
    try {
      const subscription = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: customer.subscription.updated *****');

      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status as SubscriptionStatus,
          metadata: subscription.metadata,
          price_id: subscription.items.data[0].price.id,
          quantity: subscription.items.data[0].quantity,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date(subscription.current_period_start * 1000)
            .toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000)
            .toISOString(),
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
            .toISOString() : null,
        })
        .match({ stripe_subscription_id: subscription.id, profile_id: subscription.metadata.profile_id })
        .select();

      if (error || !data) throw throwError('An error occurred while updating subscription');
    } catch (err) {
      throw throwError('A catch error occurred while updating subscription');
    }
    break;
  }

  /**
    * Occurs whenever a customer’s subscription ends.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.deleted}
    */
  case 'customer.subscription.deleted': {
    try {
      const subscription = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: customer.subscription.deleted *****');

      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status as SubscriptionStatus,
          canceled_at: new Date()
            .toISOString(),
        })
        .match({ stripe_subscription_id: subscription.id, profile_id: subscription.metadata.profile_id })
        .select();

      if (error || !data) throw throwError('An error occurred while deleting subscription');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while deleting subscription');
    }
    break;
  }

  /**
    * Occurs whenever a product is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.created}
    */
  case 'product.created': {
    try {
      const product = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: product.created *****');

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

      if (error || !data) throw throwError('An error occurred while inserting product');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while inserting product');
    }
    break;
  }

  /**
    * Occurs whenever a product is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.updated}
    */
  case 'product.updated': {
    try {
      const product = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: product.updated *****');

      const { data, error } = await supabase
        .from('products')
        .update({
          active: product.active,
          name: product.name.toUpperCase() as SubscriptionLevel,
          description: product.description,
          image: product.images[0],
          metadata: product.metadata,
          environment: product.livemode ? 'production' : 'test',
        })
        .match({ id: product.id })
        .select();

      if (error || !data) throw throwError('An error occurred while updating product');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while updating product');
    }
    break;
  }

  /**
    * Occurs whenever a product is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.deleted}
    */
  case 'product.deleted': {
    try {
      const product = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: product.deleted *****');

      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id: product.id });

      if (error) throw throwError('An error occurred while deleting product');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while deleting product');
    }
    break;
  }

  /**
    * Occurs whenever a price is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.created}
    */
  case 'price.created': {
    try {
      const price = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: price.created *****');

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
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          metadata: price.metadata,
          environment: price.livemode ? 'production' : 'test',
        })
        .select();

      if (error || !data) throw throwError('An error occurred while inserting price');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while inserting price');
    }
    break;
  }

  /**
    * Occurs whenever a price is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.updated}
    */
  case 'price.updated': {
    try {
      const price = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: price.updated *****');

      const { data, error } = await supabase
        .from('prices')
        .update({
          product_id: price.product as string,
          active: price.active,
          description: price.nickname,
          unit_amount: price.unit_amount,
          currency: price.currency,
          type: price.type,
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          metadata: price.metadata,
          environment: price.livemode ? 'production' : 'test',
        })
        .match({ id: price.id })
        .select();

      if (error || !data) throw throwError('An error occurred while updating price');
    } catch (err) {
      throw throwError('A catch error occurred while updating price');
    }
    break;
  }

  /**
    * Occurs whenever a price is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.deleted}
    */
  case 'price.deleted': {
    try {
      const price = stripeEvent.data.object;
      console.log('***** STRIPE EVENT: price.deleted *****');

      const { error } = await supabase
        .from('prices')
        .delete()
        .match({ id: price.id });

      if (error) throw throwError('An error occurred while deleting price');
    } catch (err) {
      console.error(err);
      throw throwError('A catch error occurred while deleting price');
    }
    break;
  }

  default:
      // Unexpected event type
  }
});