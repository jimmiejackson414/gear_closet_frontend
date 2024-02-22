import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.NUXT_STRIPE_PUBLIC_KEY ?? '');
  }
  return stripePromise;
};
