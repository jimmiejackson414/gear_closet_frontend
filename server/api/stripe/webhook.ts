import { defineStripeWebhook } from '#stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { Database, InsertSubscription, SubscriptionStatus } from '@/types';

/**
 * @param event - the H3 event
 * @param stipe - the Stripe instance
 * @param stripeEvent - the Stripe Webhook event
 */
export default defineStripeWebhook(async ({ event, stripe, stripeEvent }) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event);

  switch (stripeEvent.type) {
    /**
    * Occurs whenever a new customer is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.created}
    */
    case 'customer.created': {
      console.log('***** STRIPE EVENT: customer.created *****');

      const customer = stripeEvent.data.object;
      console.log('Customer created:', customer);
      // Insert the customer into your 'customers' table
      break;
    }

    /**
    * Occurs whenever a customer is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.deleted}
    */
    case 'customer.deleted': {
      console.log('***** STRIPE EVENT: customer.deleted *****');

      const customer = stripeEvent.data.object;
      console.log('Customer deleted:', customer);
      // Delete the customer from your 'customers' table
      break;
    }

    /**
    * Occurs whenever any property of a customer changes.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.updated}
    */
    case 'customer.updated': {
      console.log('***** STRIPE EVENT: customer.updated *****');

      const customer = stripeEvent.data.object;
      console.log('Customer updated:', customer);
      // Update the customer in your 'customers' table
      break;
    }

    /**
    * Occurs whenever a customer is signed up for a new plan.
    * @see {@link https://stripe.com/docs/api/events/types#event_types-customer.subscription.created}
    */
    case 'customer.subscription.created': {
      try {
      console.log('***** STRIPE EVENT: customer.subscription.created *****');

      const subscription = stripeEvent.data.object;
      console.log('Customer subscription created:', subscription);

      const payload: InsertSubscription = {
        profile_id: user!.id as string,
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
      };
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(payload)
        .select();

        if (error || !data) {
          throw createError({
            statusCode: 400,
            statusMessage: 'An error occurred while inserting subscription',
          });
        }
      } catch (error) {
        throw createError({
          statusCode: 400,
          statusMessage: 'An error occurred while inserting subscription',
        });
      }

      break;
    }

    /**
    * Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated}
    */
    case 'customer.subscription.updated': {
      console.log('***** STRIPE EVENT: customer.subscription.updated *****');

      const subscription = stripeEvent.data.object;
      console.log('Customer subscription updated:', subscription);
      // Update the subscription in your 'subscriptions' table
      break;
    }

    /**
    * Occurs whenever a customer’s subscription ends.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.deleted}
    */
    case 'customer.subscription.deleted': {
      console.log('***** STRIPE EVENT: customer.subscription.deleted *****');

      const subscription = stripeEvent.data.object;
      console.log('Customer subscription deleted:', subscription);
      // Delete the subscription from your 'subscriptions' table
      break;
    }

    /**
    * Occurs whenever an invoice payment attempt succeeds.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-invoice.payment_succeeded}
    */
    case 'invoice.payment_succeeded': {
      console.log('***** STRIPE EVENT: invoice.payment_succeeded *****');

      const invoice = stripeEvent.data.object;
      console.log('Invoice payment succeeded:', invoice);
      // Add the invoice to the customer's payment history
      break;
    }

    /**
    * Occurs whenever an invoice payment attempt fails, due either to a declined payment or to the lack of a stored payment method.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-invoice.payment_failed}
    */
    case 'invoice.payment_failed': {
      console.log('***** STRIPE EVENT: invoice.payment_failed *****');

      const invoice = stripeEvent.data.object;
      console.log('Invoice payment failed:', invoice);
      // Notify the customer that their payment failed
      break;
    }

    /**
    * Occurs whenever a new payment method is attached to a customer.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-payment_method.attached}
    */
    case 'payment_method.attached': {
      console.log('***** STRIPE EVENT: payment_method.attached *****');

      const paymentMethod = stripeEvent.data.object;
      console.log('PaymentMethod was attached to a Customer:', paymentMethod);
      // Attach the PaymentMethod to a Customer
      break;
    }

    /**
    * Occurs whenever a product is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.created}
    */
    case 'product.created': {
      console.log('***** STRIPE EVENT: product.created *****');

      const product = stripeEvent.data.object;
      console.log('Product created:', product);
      // Insert the new product into your database
      break;
    }

    /**
    * Occurs whenever a product is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.updated}
    */
    case 'product.updated': {
      console.log('***** STRIPE EVENT: product.updated *****');

      const product = stripeEvent.data.object;
      console.log('Product updated:', product);
      // Update the product in your database
      break;
    }

    /**
    * Occurs whenever a product is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.deleted}
    */
    case 'product.deleted': {
      console.log('***** STRIPE EVENT: product.deleted *****');

      const product = stripeEvent.data.object;
      console.log('Product deleted:', product);
      // Delete the product in your database
      break;
    }

    /**
    * Occurs whenever a price is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.created}
    */
    case 'price.created': {
      console.log('***** STRIPE EVENT: price.created *****');

      const price = stripeEvent.data.object;
      console.log('Price created:', price);
      // Insert the new price into your database
      break;
    }

    /**
    * Occurs whenever a price is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.updated}
    */
    case 'price.updated': {
      console.log('***** STRIPE EVENT: price.updated *****');

      const price = stripeEvent.data.object;
      console.log('Price updated:', price);
      // Update the price in your database
      break;
    }

    /**
    * Occurs whenever a price is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.deleted}
    */
    case 'price.deleted': {
      console.log('***** STRIPE EVENT: price.deleted *****');

      const price = stripeEvent.data.object;
      console.log('Price deleted:', price);
      // Delete the price in your database
      break;
    }

    default:
      // Unexpected event type
  }
});