<script lang='ts' setup>
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
  const $store = useAppStore();

  const { loading } = storeToRefs($store);

  const $userStore = useUserStore();
  $userStore.fetchProfile();
</script>

<template>
  <div class="bg-white">
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer v-if="!minimal" />
      <div class="min-h-screen pt-5">
        <div
          class="container-xxl py-4"
          :class="$route.name === 'onboarding' ? 'px-4' : 'pl-[90px] pr-4 lg:pr-0 2xl:pl-0 py-9'">
          <gc-navbar
            v-if="!minimal"
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
