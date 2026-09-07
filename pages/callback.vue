<script lang="ts" setup>
  import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
  import {
    destinationAfterAuth,
    isPasswordRecoveryCallback,
  } from '@/utils/authRedirect';
  import type { ProfileLayoutResponse } from '@/types/profile';

  definePageMeta({ colorMode: 'light', layout: 'auth-layout' });

  useHead({ title: 'Signing in' });

  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const route = useRoute();
  const redirectInfo = useSupabaseCookieRedirect();
  const failed = ref(false);
  const handled = ref(false);

  const isRecovery = computed(() => isPasswordRecoveryCallback(route.query.type, route.hash));

  const title = computed(() => (failed.value ? 'Sign-in failed' : 'Welcome back'));
  const subtitle = computed(() => (
    failed.value
      ? 'We could not finish signing you in'
      : 'Just a moment while we get things ready'
  ));

  async function continueAuthenticated (isPasswordRecovery: boolean) {
    if (handled.value) return;
    handled.value = true;

    if (isPasswordRecovery) {
      await navigateTo('/reset-password');
      return;
    }

    try {
      const profile = await $fetch<ProfileLayoutResponse | null>('/api/profile', {
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
  <auth-form-container
    :subtitle="subtitle"
    :title="title">
    <div class="flex flex-col items-center gap-4 px-2 py-6 text-center">
      <template v-if="!failed">
        <spinner-icon class="animate-spin h-8 text-[hsl(204_100%_26.9%)] w-8" />
        <typography class="text-gray-800">
          Signing you in…
        </typography>
      </template>
      <template v-else>
        <typography class="text-gray-800">
          The link may have expired or the sign-in was cancelled. Try again from the login page.
        </typography>
        <nuxt-link to="/login">
          <button-root>
            Back to login
          </button-root>
        </nuxt-link>
      </template>
    </div>
  </auth-form-container>
</template>
