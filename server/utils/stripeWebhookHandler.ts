import type { H3Event } from 'h3';
import { assertMethod, getHeader, readRawBody } from 'h3';
import type Stripe from 'stripe';
import { useServerStripe } from './stripeClient';

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

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw createError({
        statusCode: 400,
        statusMessage: err instanceof Error ? err.message : 'Invalid Stripe webhook signature',
      });
    }

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
