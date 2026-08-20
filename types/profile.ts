import type { ProfileWithSubscriptions } from '@/stores/user';
import type { Tables } from '@/types';
import type { Stripe } from 'stripe';

export type SubscriptionType = Tables<'subscriptions'> & {
  prices: Tables<'prices'> | null;
};

export type ProfileLayoutResponse = ProfileWithSubscriptions;

export type ProfileApiResponse = ProfileWithSubscriptions & {
  onboarding_steps?: Tables<'onboarding_steps'>[];
};

export type SubscriptionApiResponse = {
  customer?: Stripe.Customer;
  subscriptions: Stripe.Subscription[];
  nextBillingDate: number | null;
  paymentMethods: Stripe.PaymentMethod[];
  invoices: Stripe.Invoice[];
};

export type ExtendedUser = Tables<'profiles'> & {
  onboarding_steps: Tables<'onboarding_steps'>[];
};

/**
 * Minimal profile shape needed to render a display name or initials, so callers
 * can pass narrow selections instead of a full profile row.
 */
export type DisplayNameProfile = Pick<Tables<'profiles'>, 'email' | 'first_name' | 'last_name'> & {
  trail_name?: string | null;
};

export type NotificationSender = Pick<
  Tables<'profiles'>,
  'id' | 'image' | 'email' | 'first_name' | 'last_name' | 'slug'
>;

export type ExtendedNotification = Tables<'notifications'> & {
  sender: NotificationSender | null;
};
