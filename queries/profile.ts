import type { Database } from '@/types';
import type { QueryData, SupabaseClient } from '@supabase/supabase-js';

/*
 * Query builders live next to the type derived from them, so a change to the
 * select string updates the type instead of silently disagreeing with it.
 * See #112 for why this is preferred over hand-writing the result shape.
 */

/** Profile plus its subscriptions and the price each subscription points at. */
export const profileWithSubscriptionsQuery = (
  supabase: SupabaseClient<Database>,
  profileId: string,
) => supabase.from('profiles')
  .select(`
    *,
    subscriptions!subscriptions_profile_id_fkey(*, prices!subscriptions_price_id_fkey(*))
  `)
  .eq('id', profileId)
  .single();

export type ProfileWithSubscriptions = QueryData<ReturnType<typeof profileWithSubscriptionsQuery>>;
