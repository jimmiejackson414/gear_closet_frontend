<script setup lang="ts">
  import { AUTH_CALLBACK_PATH } from '@/utils/authRedirect';

  definePageMeta({ colorMode: 'light', layout: 'auth-layout' });
  useHead({ title: 'Confirm' });

  const route = useRoute();
  await navigateTo({
    hash: route.hash,
    path: AUTH_CALLBACK_PATH,
    query: route.query,
  }, { replace: true });
</script>

<template>
  <div>Redirecting…</div>
</template>
