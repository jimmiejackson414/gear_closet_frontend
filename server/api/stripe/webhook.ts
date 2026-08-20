/**
 * @api {post} /stripe/webhook Stripe Webhook
 * @apiName StripeWebhook
 */

import { serverSupabaseServiceRole } from '#supabase/server';
import { processStripeWebhookEvent } from '../../utils/processStripeWebhookEvent';
import type { Database } from '@/types';

export default stripeWebhookHandler(async (event, context) => {
  // Webhook has no user JWT; billing tables require service_role under RLS.
  const supabase = serverSupabaseServiceRole<Database>(context.$event);
  await processStripeWebhookEvent(event, supabase);
});
