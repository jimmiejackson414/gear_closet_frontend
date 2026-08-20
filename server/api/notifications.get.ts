/**
 * @api {get} /notifications Get Notifications
 * @apiName GetNotifications
 * @summary Fetch recent notifications for the current user (lazy-loaded after layout shell)
 */
import { isError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { NOTIFICATION_FETCH_LIMIT } from '~/server/utils/notificationLimit';
import type { ExtendedNotification } from '~/types/profile';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_id(*)')
      .eq('profile_id', user.sub)
      .order('created_at', { ascending: false })
      .limit(NOTIFICATION_FETCH_LIMIT);

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'An error occurred while fetching notifications',
      });
    }

    return (data ?? []) as ExtendedNotification[];
  } catch (err) {
    if (isError(err)) throw err;

    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching notifications',
    });
  }
});
