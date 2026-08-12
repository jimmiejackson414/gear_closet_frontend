import Stripe from 'stripe';

let _stripe: Stripe | undefined;

/**
 * Server-side Stripe SDK singleton (secret key from runtimeConfig / env).
 */
export function useServerStripe () {
  if (_stripe) return _stripe;

  const config = useRuntimeConfig();
  const secret = (config.stripeSecret || process.env.NUXT_STRIPE_SECRET) as string | undefined;
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_STRIPE_SECRET',
    });
  }

  _stripe = new Stripe(secret);
  return _stripe;
}
