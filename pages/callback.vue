<script lang="ts" setup>
  import type { Tables } from '@/types';
  import {
    destinationAfterAuth,
    isPasswordRecoveryCallback,
  } from '@/utils/authRedirect';

  definePageMeta({ layout: 'auth-layout', colorMode: 'light' });

  useHead({ title: 'Signing in' });

  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const route = useRoute();
  const redirectInfo = useSupabaseCookieRedirect();
  const failed = ref(false);
  const handled = ref(false);

  const isRecovery = computed(() => isPasswordRecoveryCallback(route.query.type, route.hash));

  async function continueAuthenticated (isPasswordRecovery: boolean) {
    if (handled.value) return;
    handled.value = true;

    if (isPasswordRecovery) {
      await navigateTo('/reset-password');
      return;
    }

    try {
      const profile = await $fetch<Tables<'profiles'> | null>('/api/profile', {
        headers: useRequestHeaders(['cookie']),
      });
      const dest = destinationAfterAuth({
        onboardDate: profile?.onboard_date,
        savedPath: redirectInfo.path.value,
      });
      if (dest.consumeSavedPath) {
        redirectInfo.pluck();
      }
      await navigateTo(dest.path);
    } catch {
      await navigateTo('/onboarding');
    }
  }

  const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'PASSWORD_RECOVERY') {
      await continueAuthenticated(true);
    }
  });

  onUnmounted(() => {
    authListener.subscription.unsubscribe();
  });

  watch(user, async (next) => {
    if (!next) return;
    await continueAuthenticated(isRecovery.value);
  }, { immediate: true });

  onMounted(() => {
    window.setTimeout(() => {
      if (!user.value && !handled.value) {
        failed.value = true;
      }
    }, 10000);
  });
</script>

<template>
  <div class="text-center">
    <typography v-if="!failed">
      Signing you in…
    </typography>
    <div
      v-else
      class="flex flex-col items-center gap-4">
      <typography>
        We could not finish signing you in. The link may have expired.
      </typography>
      <nuxt-link to="/login">
        <button-root>
          Back to login
        </button-root>
      </nuxt-link>
    </div>
  </div>
</template>
