<script lang='ts' setup>
  // import { useQuasar } from 'quasar';
  import GcNavbar from '@/components/common/GcNavbar.vue';
  import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
  // import Drawer from '@/components/common/Drawer.vue';
  import GcFooter from '@/components/common/GcFooter.vue';
  // import LoadingPage from '@/components/common/LoadingPage.vue';
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
  const userStore = useUserStore();
  // const $q = useQuasar();

  // userStore.fetchCurrentUser();

  const { currentUser, loading } = storeToRefs(userStore);
  const pageStyles = ref({});

  const shouldDisplay = computed(() => {
    if (props.minimalLayout) {
      // takes care of case where user is logged in but on public page (e.g. Public Pack page)
      if (!$route.meta.authRequired && currentUser.value) {
        return true;
      }
      return false;
    }

    return true;
  });

  // watchEffect(() => {
  //   if ($q.screen.xs || props.minimalLayout) {
  //     pageStyles.value = {
  //       paddingLeft: '0',
  //     };
  //   } else {
  //     pageStyles.value = {
  //       paddingLeft: '57px',
  //     };
  //   }
  // });
</script>

<template>
  <div class="bg-gray-100">
    <!-- <LoadingPage v-if="loading" /> -->
    <div>
      <!-- <Drawer v-if="shouldDisplay" /> -->
      <div
        :style="pageStyles"
        class="min-h-screen">
        <div class="p-4 md:px-9 md:py-14">
          <gc-navbar
            v-if="shouldDisplay"
            :page-title="props.pageTitle || capitalize($route.name as string)" />
          <gc-navbar-alt
            v-else
            :align-logo="alignLogo" />
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
