import { assertMethod, getHeader, readRawBody } from 'h3';
import { markSentryReported } from '@/utils/sentryIgnore';
import { reportServerError } from './reportServerError';
import { useServerStripe } from './stripeClient';
import type { H3Event } from 'h3';
import type Stripe from 'stripe';

type StripeWebhookVerifier = {
  webhooks: {
    constructEvent: Stripe['webhooks']['constructEvent']
  }
};

export const verifyStripeWebhookSignature = (
  stripe: StripeWebhookVerifier,
  payload: string,
  signature: string,
  webhookSecret: string,
) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    reportServerError(err, {
      tags: { 'stripe.webhook': 'signature' },
    });
    const wrapped = createError({
      statusCode: 400,
      statusMessage: 'Invalid Stripe webhook signature',
      cause: err,
    });
    markSentryReported(wrapped);
    throw wrapped;
  }
};

type WebhookHandler = (
  event: Stripe.Event,
  context: { stripe: Stripe; $event: H3Event },
) => Promise<unknown> | unknown;

/**
 * Drop-in replacement for `@fixers/nuxt-stripe`'s `stripeWebhookHandler`.
 * Verifies the Stripe signature and invokes the handler with the parsed event.
 */
export function stripeWebhookHandler (handler: WebhookHandler) {
  return defineEventHandler(async (e) => {
    assertMethod(e, ['POST', 'PUT', 'PATCH', 'DELETE']);

    const stripe = useServerStripe();
    const config = useRuntimeConfig();
    const webhookSecret = (config.stripeWebhookSecret || process.env.NUXT_STRIPE_WEBHOOK_SECRET) as string | undefined;
    if (!webhookSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing NUXT_STRIPE_WEBHOOK_SECRET',
      });
    }

    const signature = getHeader(e, 'stripe-signature');
    const payload = await readRawBody(e, 'utf-8');
    if (!signature || !payload) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing Stripe webhook signature or body',
      });
    }

    const event = verifyStripeWebhookSignature(stripe, payload, signature, webhookSecret);

    const data = await handler(event, {
      stripe,
      $event: e,
    });

    return {
      ok: true,
      data,
    };
  });
}
