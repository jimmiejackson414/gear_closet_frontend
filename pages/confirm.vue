<script setup lang="ts">
  import { AUTH_CALLBACK_PATH } from '@/utils/authRedirect';

  definePageMeta({ layout: 'auth-layout', colorMode: 'light' });
  useHead({ title: 'Confirm' });

  const route = useRoute();
  await navigateTo({
    path: AUTH_CALLBACK_PATH,
    query: route.query,
    hash: route.hash,
  }, { replace: true });
</script>

<template>
  <div>Redirecting…</div>
</template>
