import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
/**
 * Unlock all packs/trips for the current user (paid upgrade).
 */
import { unlockAllUserResources } from '../../utils/planEntitlements';
import type { Database } from '@/types';

export default defineEventHandler(async (event) => {
  assertMethod(event, ['POST']);

  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const supabase = await serverSupabaseClient<Database>(event);
  await unlockAllUserResources(supabase, user.sub);
  return { ok: true };
});
