<script lang='ts' setup>
  import type { ProfileLayoutResponse } from '@/types/profile';

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

  const { data, error } = await useFetch<ProfileLayoutResponse | null>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  $store.setProfile(data.value ?? null);

  if (!error.value && data.value && !data.value.onboard_date) {
    $router.push('/onboarding');
  }

  useNotificationHydration();

  const compactHeader = computed(() =>
    ['closet', 'friends', 'planning'].includes(String($route.name)),
  );
</script>

<template>
  <div class="bg-background">
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer v-if="!minimal && $route.name !== 'onboarding'" />
      <div class="min-h-screen overflow-x-hidden">
        <div
          class="container min-w-0"
          :class="$route.name === 'onboarding' ? 'px-4 pt-4 pb-14' : 'pt-4 pb-20 lg:pl-20 lg:pt-9'">
          <gc-navbar
            v-if="!minimal && $route.name !== 'onboarding'"
            :compact-header="compactHeader"
            :page-title="compactHeader ? '' : (props.pageTitle || capitalize($route.name as string))" />
          <gc-navbar-alt
            v-else
            :align-logo="alignLogo" />
          <div :class="compactHeader ? 'pt-5 sm:pt-6 pb-6' : 'py-6'">
            <slot />
          </div>
          <free-resource-selection-dialog />
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
