/**
 * @api {post} /stripe/webhook Stripe Webhook
 * @apiName StripeWebhook
 */

import { processStripeWebhookEvent } from '../../utils/processStripeWebhookEvent';
import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '@/types';

export default stripeWebhookHandler(async (event, context) => {
  const supabase = await serverSupabaseClient<Database>(context.$event);
  await processStripeWebhookEvent(event, supabase);
});
