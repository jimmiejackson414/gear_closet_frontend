<script lang='ts' setup>
  import type { ProfileApiResponse } from '@/types/helpers';

  const $store = useUserStore();
  const { data, error } = await useFetch<ProfileApiResponse>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  $store.profile = data.value as any;

  const $router = useRouter();
  if (!error.value && data.value && !data.value.onboard_date) {
    $router.push('/onboarding');
  }

  const $appStore = useAppStore();
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="$appStore.loading" />
    <div v-else>
      <gc-drawer />
      <div class="min-h-screen">
        <div class="py-4 pl-[72px] pr-4 lg:pr-9">
          <div class="container px-0 md:px-8">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
