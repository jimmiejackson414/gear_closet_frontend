import { defineStripeWebhook } from '#stripe';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { InsertSubscription, Subscription, SubscriptionStatus } from '@/types';

/**
 * @param event - the H3 event
 * @param stipe - the Stripe instance
 * @param stripeEvent - the Stripe Webhook event
 */
export default defineStripeWebhook(async ({ event, stripe, stripeEvent }) => {
  const supabase = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  switch (stripeEvent.type) {
    case 'customer.created': {
      const customer = stripeEvent.data.object;
      console.log('Customer created:', customer);
      // Insert the customer into your 'customers' table
      break;
    }
    case 'customer.deleted': {
      const customer = stripeEvent.data.object;
      console.log('Customer deleted:', customer);
      // Delete the customer from your 'customers' table
      break;
    }
    case 'customer.updated': {
      const customer = stripeEvent.data.object;
      console.log('Customer updated:', customer);
      // Update the customer in your 'customers' table
      break;
    }
    case 'customer.subscription.created': {
      const subscription = stripeEvent.data.object;
      console.log('Customer subscription created:', subscription);

      const payload = [{
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
      }] as InsertSubscription[];
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(payload)
        .select();

      break;
    }
    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object;
      console.log('Customer subscription updated:', subscription);
      // Update the subscription in your 'subscriptions' table
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object;
      console.log('Customer subscription deleted:', subscription);
      // Delete the subscription from your 'subscriptions' table
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = stripeEvent.data.object;
      console.log('Invoice payment succeeded:', invoice);
      // Add the invoice to the customer's payment history
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = stripeEvent.data.object;
      console.log('Invoice payment failed:', invoice);
      // Notify the customer that their payment failed
      break;
    }
    case 'payment_method.attached': {
      const paymentMethod = stripeEvent.data.object;
      console.log('PaymentMethod was attached to a Customer:', paymentMethod);
      // Attach the PaymentMethod to a Customer
      break;
    }
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }
});