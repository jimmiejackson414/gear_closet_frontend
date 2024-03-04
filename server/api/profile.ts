import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Profile } from '~/types';

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
        onboarding_steps(*),
        notifications!notifications_profile_id_fkey(*, sender:sender_id(*))
      `)
      .eq('id', user!.id)
      .maybeSingle();

      clearTimeout(timeout);

      if (!data || error) {
        throw createError({
          statusCode: 400,
          statusMessage: 'An error occurred while fetching profile',
        });
      }

      return { data: data as Profile };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching profile',
    });
  }
});