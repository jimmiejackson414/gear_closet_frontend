<template>
  <q-layout
    view="hHh Lpr lff"
    class="bg-white full-height">
    <LoadingPage v-if="loading" />
    <div v-else>
      <Drawer v-if="shouldDisplay" />
      <q-page-container>
        <q-page class="content-wrapper container">
          <div>
            <slot />
          </div>
        </q-page>
      </q-page-container>
      <Footer />
    </div>
  </q-layout>
</template>

<script lang='ts' setup>
  import { useUserStore } from '@/stores/user';
  import LoadingPage from '@/components/common/LoadingPage.vue';
  import Drawer from '@/components/common/Drawer.vue';
  import Footer from '@/components/common/Footer.vue';

  interface Props {
    minimalLayout?: boolean;
    pageTitle?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    minimalLayout: false,
    pageTitle: '',
  });

  const route = useRoute();
  const store = useUserStore();

  store.fetchCurrentUser();

  const loading = ref(false);
  const { currentUser } = storeToRefs(store);

  const shouldDisplay = computed(() => {
    if (props.minimalLayout) {
      // takes care of case where user is logged in but on public page (e.g. Public Pack page)
      if (!route.meta.authRequired && currentUser.value) {
        return true;
      }
      return false;
    }

    return true;
  });
</script>

<style lang='scss' scoped>
  .content-wrapper {
    padding: 2.5rem;
  }
</style>
