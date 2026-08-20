/**
 * @api {get} /trip-invites/preview Preview a pending trip invite token
 * @apiName PreviewTripInvite
 * @summary Public trip summary for a claim token. Does not reveal the invitee email.
 */
import { serverSupabaseServiceRole } from '#supabase/server';
import { normalizeInviteToken, previewTripInvite } from '@/server/utils/tripInviteClaim';
import type { Database } from '@/types';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'GET');

  const token = normalizeInviteToken(getQuery(event).token);
  if (!token) {
    return { status: 'invalid' as const };
  }

  const admin = serverSupabaseServiceRole<Database>(event);
  return await previewTripInvite(admin, token);
});
