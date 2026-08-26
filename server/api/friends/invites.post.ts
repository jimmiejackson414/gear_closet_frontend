/**
 * @api {post} /friends/invites Invite a person by email
 * @apiName InviteFriendByEmail
 * @summary Create an in-app friend request when a profile exists, or email a
 * join link when it does not. Always returns a generic success payload.
 */
import { isError } from 'h3';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import {
  parseFriendInviteBody,
  sendFriendEmailInvite,
} from '@/server/utils/friendInvites';
import { reportServerError, throwPublicError } from '@/server/utils/reportServerError';
import { InviteError } from '@/server/utils/tripInvites';
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

  const parsed = parseFriendInviteBody(await readBody(event));
  if ('error' in parsed) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error,
    });
  }

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    return await sendFriendEmailInvite({
      inviterId: user.sub,
      email: parsed.email,
      origin: getRequestURL(event).origin,
      userClient: supabase,
      admin,
    });
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
      statusMessage: 'Unable to send invites',
      tags: { route: '/api/friends/invites' },
    });
  }
});
