/**
 * @api {get} /profile Get Profile
 * @apiName GetProfile
 * @summary Fetch the profile details for the current user
 */
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { type Database, FriendRequestStatus } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);


    const supabase = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const { data, error } = await supabase.from('profiles')
      .select(`
        *,
        onboarding_steps(*),
        notifications!notifications_profile_id_fkey(*, sender:sender_id(*)),
        subscriptions!subscriptions_profile_id_fkey(*, prices!subscriptions_price_id_fkey(*))
      `)
      .eq('id', user!.id)
      .maybeSingle();

    if (!data || error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'An error occurred while fetching profile',
      });
    }

    // Fetch friend invitation count
    const { count, error: countError } = await supabase
      .from('friend_invitations')
      .select('*', { count: 'exact' })
      .match({ recipient_id: user!.id, status: FriendRequestStatus.PENDING });

    if (countError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'An error occurred while fetching friend invitations',
      });
    }

    clearTimeout(timeout);

    return { ...data, friend_invitations: count || 0 };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching profile',
    });
  }
});