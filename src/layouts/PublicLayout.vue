<template>
  <q-layout
    view="hHh Lpr lff"
    class="bg-grey-1">
    <LoadingPage v-if="loading" />
    <div v-else>
      <q-page-container>
        <q-page class="content-wrapper">
          <NavbarAlt />
          <div class="container slot-wrapper">
            <slot />
          </div>
        </q-page>
        <Footer />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  import LoadingPage from '@/components/common/LoadingPage.vue';
  import NavbarAlt from '@/components/common/NavbarAlt.vue';
  import Footer from '@/components/common/Footer.vue';

  const loading = ref(false);
</script>

<style lang='scss' scoped>
  .q-page-container {
    min-height: 100vh;
  }

  nav {
    padding: 1rem;
    margin-left: 0;
  }

  .content-wrapper {
    padding: 1rem;
    margin-left: 0;

    .slot-wrapper {
      height: calc(100vh - 9.25rem);
    }
  }
</style>
