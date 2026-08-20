/**
 * @api {get} /profile Get Profile
 * @apiName GetProfile
 * @summary Fetch the profile details for the current user
 */
import { isError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { ProfileLayoutResponse } from '~/types/helpers';

export default defineEventHandler(async (event) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);


    const supabase = await serverSupabaseClient(event);
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
        subscriptions!subscriptions_profile_id_fkey(*, prices!subscriptions_price_id_fkey(*))
      `)
      .eq('id', user!.sub)
      .maybeSingle();

    clearTimeout(timeout);

    if (!data || error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'An error occurred while fetching profile',
      });
    }

    return {
      ...data,
      subscriptions: data.subscriptions ?? [],
    } as ProfileLayoutResponse;
  } catch (err) {
    if (isError(err)) throw err;

    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching profile',
    });
  }
});