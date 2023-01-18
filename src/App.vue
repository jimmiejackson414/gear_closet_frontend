<template>
  <div class="app-container">
    <router-view v-slot="{ Component, route }">
      <FadeTransition>
        <component
          :is="Component"
          :key="route.path" />
      </FadeTransition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import {
    RouteLocationRaw, RouterView, useRoute, useRouter,
  } from 'vue-router';
  import FadeTransition from '@/components/transitions/FadeTransition.vue';
  import supabase from '@/lib/supabase';
  import { useAuthStore } from '@/stores/auth';
  import { useUserStore } from '@/stores/user';

  // instantiate libs and stores
  const router = useRouter();
  const currentRoute = useRoute();
  const auth = useAuthStore();
  const user = useUserStore();

  // only load user on auth'd pages
  if (currentRoute.meta.authRequired) {
    auth.loadUser();
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      auth.loadUser();
      auth.loadRedirectRoute();
    } else {
      auth.clearUser();
    }

    if (event === 'SIGNED_OUT') {
      auth.$reset();
      user.$reset();
    }

    if (event === 'PASSWORD_RECOVERY') {
      console.log('password recovery event');
    }
  });

  auth.$onAction(({ name, store, after }) => {
    if (name === 'loadRedirectRoute') {
      after(async () => {
        const { redirectRoute } = store;

        if (redirectRoute) {
          await router.isReady();
          await router.replace(redirectRoute as RouteLocationRaw);
          auth.clearRedirectRoute();
        }
      });
    }
  });
</script>

<style lang="scss">
/* stylelint-disable function-no-unknown */
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;700;900&display=swap");

html,
body,
#app,
.app-container {
  height: 100%;
  background-color: white;
}

body {
  color: #4a4a4a;
}

.no-underline {
  text-decoration: none;
}

.pointer {
  cursor: pointer;
}

a {
  color: $primary;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s color $cubic-bezier;

  &:hover {
    color: lighten($primary, 20%);
  }
}

table {
  color: $text;
}

.box-shadow {
  box-shadow: $box-shadow !important;

  &-light {
    box-shadow: $box-shadow-light !important;
  }
}

.container,
.container-sm,
.container-md,
.container-lg,
.container-xl {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.container,
.container-sm {
  max-width: 540px;
}

@media (min-width: $breakpoint-sm-min) {
  .container,
  .container-sm,
  .container-md {
    max-width: 920px;
  }
}

@media (min-width: $breakpoint-md-min) {
  .container,
  .container-sm,
  .container-md,
  .container-lg {
    max-width: 1140px;
  }
}

@media (min-width: $breakpoint-lg-min) {
  .container,
  .container-sm,
  .container-md,
  .container-lg,
  .container-xl {
    max-width: 1440px;
  }
}
</style>
