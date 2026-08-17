<script lang='ts' setup>
  import { AUTH_CALLBACK_PATH } from '@/utils/authRedirect';

  definePageMeta({ layout: 'auth-layout', colorMode: 'light' });

  const route = useRoute();
  if (route.query.code || String(route.hash)
    .includes('code=')) {
    await navigateTo({
      path: AUTH_CALLBACK_PATH,
      query: route.query,
      hash: route.hash,
    }, { replace: true });
  }

  useHead({
    title: 'Reset Password',
    meta: [
      {
        name: 'description',
        content: 'Choose a new password for your account',
      },
    ],
  });
</script>

<template>
  <auth-form-container
    subtitle="Enter and confirm your new password"
    title="Reset Password">
    <reset-password-form />
  </auth-form-container>
</template>
