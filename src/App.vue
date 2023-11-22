<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import FadeTransition from '@/components/transitions/FadeTransition.vue';
  import supabase from '@/lib/supabase';
  import { useAuthStore } from '@/stores/auth';
  import type { RouteLocationRaw } from 'vue-router';

  const $router = useRouter();
  const $store = useAuthStore();
  supabase.auth.onAuthStateChange(event => {
    console.log('authStateChange', event);
    if (event === 'SIGNED_IN') {
      $store.loadUser();
      $store.loadRedirectRoute();
    } else if (event === 'SIGNED_OUT') {
      $store.clearUser();
    }
  });

  $store.$onAction(({ name, store, after }) => {
    if (name === 'loadRedirectRoute') {
      after(async () => {
        const { redirectRoute } = store;

        if (redirectRoute) {
          await $router.isReady();
          await $router.replace(redirectRoute as RouteLocationRaw);
          $store.clearRedirectRoute();
        }
      });
    }
  });
</script>

<template>
  <Suspense>
    <div class="bg-white h-full">
      <router-view v-slot="{ Component, route }">
        <fade-transition>
          <component
            :is="Component"
            :key="route.fullPath" />
        </fade-transition>
      </router-view>
    </div>
  </Suspense>
</template>

<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;700;900&display=swap");
</style>
