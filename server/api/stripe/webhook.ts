/**
 * @api {get} /stripe/webhook Stripe Webhook
 * @apiName StripeWebhook
 * @param event - the H3 event
 * @param stipe - the Stripe instance
 * @param event - the Stripe Webhook event
 */

import { serverSupabaseClient } from '#supabase/server';
import { type Database, SubscriptionLevel, SubscriptionStatus } from '@/types';

const throwError = (msg?: string) => {
  throw createError({
    statusCode: 500,
    statusMessage: msg || 'A Stripe error occurred.',
  });
};

export default stripeWebhookHandler(async ( event, context ) => {
  const supabase = await serverSupabaseClient<Database>(context.$event);

  switch (event.type) {
  /**
    * Occurs whenever a new customer is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.created}
    */
  case 'customer.created': {
    try {
      const customer = event.data.object;
      console.log('***** STRIPE EVENT: customer.created *****');

      const { data, error } = await supabase
        .from('customers')
        .insert({
          profile_id: customer.metadata.profile_id,
          stripe_customer_id: customer.id,
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
      const customer = event.data.object;
      console.log('***** STRIPE EVENT: customer.deleted *****');

      const { data, error } = await supabase
        .from('customers')
        .update({
          deleted_at: new Date()
            .toISOString(),
        })
        .match({ profile_id: customer.metadata.profil_id, stripe_customer_id: customer.id })
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
      const subscription = event.data.object;
      console.log('***** STRIPE EVENT: customer.subscription.created *****');

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
            .toISOString() : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: new Date(subscription.current_period_end * 1000)
            .toISOString(),
          current_period_start: new Date(subscription.current_period_start * 1000)
            .toISOString(),
          metadata: subscription.metadata,
          price_id: subscription.items.data[0].price.id,
          profile_id: subscription.metadata.profile_id,
          quantity: subscription.items.data[0].quantity,
          status: subscription.status as SubscriptionStatus,
          stripe_subscription_id: subscription.id,
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
      const subscription = event.data.object;
      console.log('***** STRIPE EVENT: customer.subscription.updated *****');

      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
            .toISOString() : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: new Date(subscription.current_period_end * 1000)
            .toISOString(),
          current_period_start: new Date(subscription.current_period_start * 1000)
            .toISOString(),
          metadata: subscription.metadata,
          price_id: subscription.items.data[0].price.id,
          quantity: subscription.items.data[0].quantity,
          status: subscription.status as SubscriptionStatus,
        })
        .match({ profile_id: subscription.metadata.profile_id, stripe_subscription_id: subscription.id })
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
      const subscription = event.data.object;
      console.log('***** STRIPE EVENT: customer.subscription.deleted *****');

      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          canceled_at: new Date()
            .toISOString(),
          status: subscription.status as SubscriptionStatus,
        })
        .match({ profile_id: subscription.metadata.profile_id, stripe_subscription_id: subscription.id })
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
      const product = event.data.object;
      console.log('***** STRIPE EVENT: product.created *****');

      const { data, error } = await supabase
        .from('products')
        .insert({
          active: product.active,
          description: product.description,
          environment: product.livemode ? 'production' : 'test',
          id: product.id,
          image: product.images[0],
          metadata: product.metadata,
          name: product.name.toUpperCase() as SubscriptionLevel,
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
      const product = event.data.object;
      console.log('***** STRIPE EVENT: product.updated *****');

      const { data, error } = await supabase
        .from('products')
        .update({
          active: product.active,
          description: product.description,
          environment: product.livemode ? 'production' : 'test',
          image: product.images[0],
          metadata: product.metadata,
          name: product.name.toUpperCase() as SubscriptionLevel,
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
      const product = event.data.object;
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
      const price = event.data.object;
      console.log('***** STRIPE EVENT: price.created *****');

      const { data, error } = await supabase
        .from('prices')
        .insert({
          active: price.active,
          currency: price.currency,
          description: price.nickname,
          environment: price.livemode ? 'production' : 'test',
          id: price.id,
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          metadata: price.metadata,
          product_id: price.product as string,
          type: price.type,
          unit_amount: price.unit_amount,
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
      const price = event.data.object;
      console.log('***** STRIPE EVENT: price.updated *****');

      const { data, error } = await supabase
        .from('prices')
        .update({
          active: price.active,
          currency: price.currency,
          description: price.nickname,
          environment: price.livemode ? 'production' : 'test',
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          metadata: price.metadata,
          product_id: price.product as string,
          type: price.type,
          unit_amount: price.unit_amount,
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
      const price = event.data.object;
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