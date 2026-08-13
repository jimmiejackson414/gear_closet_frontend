/**
 * Apply Free-tier pack/trip keepers after downgrade (or pending selection).
 */
import { applyFreeResourceLocks } from '../../utils/planEntitlements';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { Database } from '@/types';

export default defineEventHandler(async (event) => {
  assertMethod(event, ['POST']);

  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody<{ packId?: number | null; tripId?: number | null }>(event);
  const packId = body?.packId == null ? null : Number(body.packId);
  const tripId = body?.tripId == null ? null : Number(body.tripId);

  if (packId != null && !Number.isFinite(packId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid packId' });
  }
  if (tripId != null && !Number.isFinite(tripId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid tripId' });
  }

  const supabase = await serverSupabaseClient<Database>(event);

  try {
    await applyFreeResourceLocks(supabase, user.sub, { packId, tripId });
    return { ok: true };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to apply Free resource selection',
    });
  }
});
