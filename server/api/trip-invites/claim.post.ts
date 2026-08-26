/**
 * @api {post} /trip-invites/claim Claim a pending trip invite
 * @apiName ClaimTripInvite
 * @summary Accept the trip for the authenticated user and consume the invitation once.
 */
import { isError } from 'h3';
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { claimTripInvite, normalizeInviteToken } from '@/server/utils/tripInviteClaim';
import type { Database } from '@/types';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const body = await readBody(event);
  const token = normalizeInviteToken(
    body && typeof body === 'object' && 'token' in body ? (body as { token: unknown }).token : null,
  );
  if (!token) {
    return { ok: false as const, reason: 'invalid' as const };
  }

  try {
    const admin = serverSupabaseServiceRole<Database>(event);
    const { data: profile } = await admin
      .from('profiles')
      .select('email')
      .eq('id', user.sub)
      .maybeSingle();

    return await claimTripInvite({
      admin,
      token,
      userEmail: profile?.email ?? (typeof user.email === 'string' ? user.email : null),
      userId: user.sub,
    });
  } catch (err) {
    if (isError(err)) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to claim invite',
    });
  }
});
