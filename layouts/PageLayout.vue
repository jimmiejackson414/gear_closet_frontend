<script lang='ts' setup>
  import type { Tables } from '@/types';

  interface Props {
    alignLogo?: 'start' | 'center' | 'end';
    minimal?: boolean;
    pageTitle?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    alignLogo: 'start',
    minimal: false,
    pageTitle: '',
  });

  const $route = useRoute();
  const $router = useRouter();
  const $store = useUserStore();
  const $appStore = useAppStore();

  const { loading } = storeToRefs($appStore);
  const { profile } = storeToRefs($store);

  const { data, error } = await useFetch<Tables<'profiles'> | null>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  profile.value = data.value as any;

  if (!error.value && data.value && !data.value.onboard_date) {
    $router.push('/onboarding');
  }
</script>

<template>
  <div class="bg-background">
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer v-if="!minimal && $route.name !== 'onboarding'" />
      <div class="min-h-screen pt-5">
        <div
          class="container-xxl py-4"
          :class="$route.name === 'onboarding' ? 'px-4 pb-14' : 'pl-[90px] pr-4 lg:pr-0 2xl:pl-0 py-9'">
          <gc-navbar
            v-if="!minimal && $route.name !== 'onboarding'"
            :page-title="props.pageTitle || capitalize($route.name as string)" />
          <gc-navbar-alt
            v-else
            :align-logo="alignLogo" />
          <div class="py-6">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
