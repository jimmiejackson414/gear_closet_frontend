<script lang='ts' setup>
  import type { ProfileLayoutResponse } from '@/types/profile';

  const $store = useUserStore();

  const { data, error } = await useFetch<ProfileLayoutResponse | null>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  $store.setProfile(data.value ?? null);

  const $router = useRouter();
  if (!error.value && data.value && !data.value.onboard_date) {
    $router.push('/onboarding');
  }

  useNotificationHydration();

  const $appStore = useAppStore();
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="$appStore.loading" />
    <div v-else>
      <gc-drawer />
      <div class="min-h-screen overflow-x-hidden">
        <div class="py-4 pr-4 lg:pr-9 pl-18">
          <div class="container">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
      <free-resource-selection-dialog />
    </div>
  </div>
</template>
