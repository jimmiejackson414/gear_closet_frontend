import type { Database } from '@/types';
import type { QueryData, SupabaseClient } from '@supabase/supabase-js';

/** A profile's subscription together with the price it points at. */
export const subscriptionWithPriceQuery = (
  supabase: SupabaseClient<Database>,
  profileId: string,
) => supabase.from('subscriptions')
  .select('*, prices(*)')
  .eq('profile_id', profileId)
  .maybeSingle();

export type SubscriptionWithPrice = NonNullable<
  QueryData<ReturnType<typeof subscriptionWithPriceQuery>>
>;
