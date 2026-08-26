<script lang='ts' setup>
  import GcFooter from '@/components/common/GcFooter.vue';
  import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
  import type { ProfileLayoutResponse } from '@/types/profile';

  const loading = ref(false);

  const user = useSupabaseUser();
  const isLoggedIn = computed(() => !!user.value);

  const $store = useUserStore();

  // Skip /api/profile for anonymous public views (avoids 401 + blocking layout).
  if (user.value) {
    const { data, error } = await useFetch<ProfileLayoutResponse | null>('/api/profile', {
      headers: useRequestHeaders(['cookie']),
    });

    $store.setProfile(data.value ?? null);

    const $router = useRouter();
    if (!error.value && data.value && !data.value.onboard_date) {
      $router.push('/onboarding');
    }

    useNotificationHydration();
  }
</script>

<template>
  <div class="bg-background">
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer v-if="isLoggedIn" />
      <div class="min-h-screen overflow-x-hidden">
        <div
          class="container min-w-0"
          :class="!isLoggedIn ? 'px-4 pt-4 pb-20' : 'pt-4 pb-20 lg:pl-20 lg:pt-9'">
          <gc-navbar v-if="isLoggedIn" />
          <gc-navbar-alt
            v-else
            align-logo="center" />
          <div class="py-6">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
