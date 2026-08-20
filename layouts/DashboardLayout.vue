<script lang='ts' setup>
  import type { ProfileLayoutResponse } from '@/types/helpers';

  const $store = useUserStore();
  const profile = toRef($store, 'profile');

  const { data, error } = await useFetch<ProfileLayoutResponse | null>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  profile.value = data.value;

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
      <div class="min-h-screen">
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
