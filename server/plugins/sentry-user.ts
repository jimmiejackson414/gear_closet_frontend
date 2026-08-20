import * as Sentry from '@sentry/nuxt';
import { serverSupabaseUser } from '#supabase/server';

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', async (event) => {
    try {
      const user = await serverSupabaseUser(event);
      const id = user?.sub;
      if (id) {
        Sentry.getIsolationScope()
          .setUser({ id });
        return;
      }
    } catch {
      // Missing session is expected for public routes.
    }

    Sentry.getIsolationScope()
      .setUser(null);
  });
});
