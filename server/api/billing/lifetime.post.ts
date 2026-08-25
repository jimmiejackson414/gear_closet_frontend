import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { isLifetimePromoEnabled } from '@/utils/lifetimePromo';
import type { Database } from '@/types';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user?.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const config = useRuntimeConfig(event);
  if (!isLifetimePromoEnabled(config.public.lifetimePromo)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Lifetime promo is not enabled.',
    });
  }

  const admin = serverSupabaseServiceRole<Database>(event);
  const { error } = await admin.rpc('grant_beta_lifetime_for_profile', {
    p_profile_id: user.sub,
  });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to grant lifetime membership.',
    });
  }

  return { ok: true };
});
