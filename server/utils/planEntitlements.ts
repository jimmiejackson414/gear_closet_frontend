import type { SupabaseClient } from '@supabase/supabase-js';
import { type Database, SubscriptionLevel } from '@/types';
import { FREE_PACK_LIMIT, FREE_TRIP_LIMIT, needsFreeResourcePick } from '@/utils/planLimits';

export function isPaidPlanIdentifier (identifier: string | null | undefined): boolean {
  return identifier === SubscriptionLevel.MONTHLY
    || identifier === SubscriptionLevel.ANNUAL
    || identifier === SubscriptionLevel.LIFE;
}

export async function unlockAllUserResources (
  supabase: SupabaseClient<Database>,
  profileId: string,
) {
  const nowClear = { locked_at: null };
  await Promise.all([
    supabase.from('packs')
      .update(nowClear)
      .eq('profile_id', profileId)
      .not('locked_at', 'is', null),
    supabase.from('trips')
      .update(nowClear)
      .eq('profile_id', profileId)
      .not('locked_at', 'is', null),
    supabase.from('profiles')
      .update({ needs_free_resource_selection: false })
      .eq('id', profileId),
  ]);
}

/**
 * Lock every pack/trip except the chosen Free keepers.
 * Pass null for a resource type when the user has zero of that type.
 */
export async function applyFreeResourceLocks (
  supabase: SupabaseClient<Database>,
  profileId: string,
  options: { packId: number | null; tripId: number | null },
) {
  const lockedAt = new Date()
    .toISOString();

  const { data: packs, error: packsError } = await supabase
    .from('packs')
    .select('id')
    .eq('profile_id', profileId);
  if (packsError) throw packsError;

  const { data: trips, error: tripsError } = await supabase
    .from('trips')
    .select('id')
    .eq('profile_id', profileId);
  if (tripsError) throw tripsError;

  const packIds = (packs ?? []).map((p) => p.id);
  const tripIds = (trips ?? []).map((t) => t.id);

  if (options.packId != null && !packIds.includes(options.packId)) {
    throw new Error('Selected pack does not belong to this profile');
  }
  if (options.tripId != null && !tripIds.includes(options.tripId)) {
    throw new Error('Selected trip does not belong to this profile');
  }

  if (packIds.length > FREE_PACK_LIMIT && options.packId == null) {
    throw new Error('A pack selection is required');
  }
  if (tripIds.length > FREE_TRIP_LIMIT && options.tripId == null) {
    throw new Error('A trip selection is required');
  }

  // Unlock chosen / lock others for packs
  if (packIds.length) {
    if (options.packId != null) {
      await supabase.from('packs')
        .update({ locked_at: null })
        .eq('id', options.packId)
        .eq('profile_id', profileId);
      await supabase.from('packs')
        .update({ locked_at: lockedAt })
        .eq('profile_id', profileId)
        .neq('id', options.packId);
    } else {
      // Single or zero packs — ensure unlocked
      await supabase.from('packs')
        .update({ locked_at: null })
        .eq('profile_id', profileId);
    }
  }

  if (tripIds.length) {
    if (options.tripId != null) {
      await supabase.from('trips')
        .update({ locked_at: null })
        .eq('id', options.tripId)
        .eq('profile_id', profileId);
      await supabase.from('trips')
        .update({ locked_at: lockedAt })
        .eq('profile_id', profileId)
        .neq('id', options.tripId);
    } else {
      await supabase.from('trips')
        .update({ locked_at: null })
        .eq('profile_id', profileId);
    }
  }

  await supabase.from('profiles')
    .update({ needs_free_resource_selection: false })
    .eq('id', profileId);
}

export async function markNeedsFreeSelectionIfExcess (
  supabase: SupabaseClient<Database>,
  profileId: string,
) {
  const [{ data: packs }, { data: trips }] = await Promise.all([
    supabase.from('packs')
      .select('id, locked_at')
      .eq('profile_id', profileId),
    supabase.from('trips')
      .select('id, locked_at')
      .eq('profile_id', profileId),
  ]);

  if (needsFreeResourcePick(packs ?? [], trips ?? [])) {
    await supabase.from('profiles')
      .update({ needs_free_resource_selection: true })
      .eq('id', profileId);
  }
}

export async function resolvePriceIdentifier (
  supabase: SupabaseClient<Database>,
  priceId: string | null | undefined,
): Promise<string | null> {
  if (!priceId) return null;
  const { data } = await supabase
    .from('prices')
    .select('identifier')
    .eq('id', priceId)
    .maybeSingle();
  return data?.identifier ?? null;
}
