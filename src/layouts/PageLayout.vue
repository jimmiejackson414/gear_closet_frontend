<script lang='ts' setup>
  // import { useQuasar } from 'quasar';
  import Navbar from '@/components/common/Navbar.vue';
  import NavbarAlt from '@/components/common/NavbarAlt.vue';
  // import Drawer from '@/components/common/Drawer.vue';
  import Footer from '@/components/common/Footer.vue';
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
          <Navbar
            v-if="shouldDisplay"
            :page-title="props.pageTitle || capitalize($route.name as string)" />
          <NavbarAlt
            v-else
            :align-logo="alignLogo" />
          <div class="container">
            <NavbarAlt :align-logo="alignLogo" />
            <slot />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<!-- <style lang="scss" scoped>
  .q-page-container {
    min-height: 100vh;
  }

  .content-wrapper {
    padding: 1rem;
    margin-left: 0;

    @media (min-width: $breakpoint-md-min) {
      padding: 36px 56px;
    }
  }
</style> -->
