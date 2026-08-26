/**
 * @api {post} /trips/:id/invites Invite existing users by email
 * @apiName InviteTripByEmail
 * @summary Invite matching profiles, or create a pending claim invitation when no account exists. Always returns a generic success payload.
 */
import { isError } from 'h3';
import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import {
  InviteError,
  parseInviteEmailsBody,
  sendExistingUserTripInvites,
} from '@/server/utils/tripInvites';
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

  const tripId = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(tripId) || tripId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid trip',
    });
  }

  const parsed = parseInviteEmailsBody(await readBody(event));
  if ('error' in parsed) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error,
    });
  }

  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const admin = serverSupabaseServiceRole<Database>(event);

    return await sendExistingUserTripInvites({
      admin,
      emails: parsed.emails,
      inviterId: user.sub,
      origin: getRequestURL(event).origin,
      tripId,
      userClient: supabase,
    });
  } catch (err) {
    if (isError(err)) throw err;
    if (err instanceof InviteError) {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.message,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to send invites',
    });
  }
});
