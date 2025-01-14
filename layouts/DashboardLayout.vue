<script lang='ts' setup>
  import type { Tables } from '@/types';


  const $store = useUserStore();
  const { profile } = storeToRefs($store);

  const { data, error } = await useFetch<Tables<'profiles'> | null>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  profile.value = data.value as any;

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
        <div class="pl-[72px] pr-4 lg:pr-9 py-4">
          <div class="container">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
