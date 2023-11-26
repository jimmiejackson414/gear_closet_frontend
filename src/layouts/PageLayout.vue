<script lang='ts' setup>
  import GcNavbar from '@/components/common/GcNavbar.vue';
  import GcDrawer from '@/components/common/GcDrawer.vue';
  import GcFooter from '@/components/common/GcFooter.vue';
  import GcLoadingWrapper from '@/components/common/GcLoadingWrapper.vue';
  import { useUserStore } from '@/stores/user';
  import { capitalize } from '@/helpers/functions';

  interface Props {
    alignLogo?: 'start' | 'center' | 'end';
    minimalLayout?: boolean;
    pageTitle?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    alignLogo: 'start',
    minimalLayout: false,
    pageTitle: '',
  });

  const $route = useRoute();
  const $store = useUserStore();

  // $store.fetchCurrentUser();

  const { loading } = storeToRefs($store);
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer />
      <div class="min-h-screen">
        <div class="p-4 pl-[72px] pr-9">
          <gc-navbar :page-title="props.pageTitle || capitalize($route.name as string)" />
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
