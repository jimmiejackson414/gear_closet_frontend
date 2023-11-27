<script lang='ts' setup>
  import GcNavbar from '@/components/common/GcNavbar.vue';
  import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
  import GcDrawer from '@/components/common/GcDrawer.vue';
  import GcFooter from '@/components/common/GcFooter.vue';
  import GcLoadingWrapper from '@/components/common/GcLoadingWrapper.vue';
  import { useUserStore } from '@/stores/user';
  import { capitalize } from '@/helpers/functions';

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
  const $store = useUserStore();

  const { loading } = storeToRefs($store);
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer v-if="!minimal" />
      <div class="min-h-screen">
        <div
          class="py-4"
          :class="$route.name === 'onboarding' ? 'px-4' : 'pl-[72px] pr-9'">
          <gc-navbar
            v-if="!minimal"
            :page-title="props.pageTitle || capitalize($route.name as string)" />
          <gc-navbar-alt
            v-else
            :align-logo="alignLogo" />
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
