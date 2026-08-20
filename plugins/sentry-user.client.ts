import * as Sentry from '@sentry/nuxt';

export default defineNuxtPlugin(() => {
  const user = useSupabaseUser();

  watch(user, (session) => {
    const id = session?.sub;
    if (id) {
      Sentry.setUser({ id });
      return;
    }
    Sentry.setUser(null);
  }, { immediate: true });
});
