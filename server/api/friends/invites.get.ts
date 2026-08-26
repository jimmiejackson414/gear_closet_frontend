/**
 * @api {get} /friends/invites List sent friend emails
 * @apiName ListSentFriendEmails
 * @summary Distinct latest off-platform friend invite emails for the current user.
 */
import { isError } from 'h3';
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { listSentFriendEmails } from '@/server/utils/friendInvites';
import { reportServerError, throwPublicError } from '@/server/utils/reportServerError';
import { InviteError } from '@/server/utils/tripInvites';
import type { Database } from '@/types';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'GET');

  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    const admin = serverSupabaseServiceRole<Database>(event);
    const emails = await listSentFriendEmails({
      admin,
      inviterId: user.sub,
    });
    return { emails };
  } catch (err) {
    if (isError(err)) throw err;
    if (err instanceof InviteError) {
      if (err.statusCode >= 500) {
        reportServerError(err, { tags: { route: '/api/friends/invites' } });
      }
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.message,
      });
    }

    throwPublicError(err, {
      statusCode: 500,
      statusMessage: 'Unable to load invites',
      tags: { route: '/api/friends/invites' },
    });
  }
});
