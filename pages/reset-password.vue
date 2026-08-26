<script lang='ts' setup>
  import { AUTH_CALLBACK_PATH } from '@/utils/authRedirect';

  definePageMeta({ colorMode: 'light', layout: 'auth-layout' });

  const route = useRoute();
  if (route.query.code || String(route.hash)
    .includes('code=')) {
    await navigateTo({
      hash: route.hash,
      path: AUTH_CALLBACK_PATH,
      query: route.query,
    }, { replace: true });
  }

  useHead({
    meta: [
      {
        content: 'Choose a new password for your account',
        name: 'description',
      },
    ],
    title: 'Reset Password',
  });
</script>

<template>
  <auth-form-container
    subtitle="Enter and confirm your new password"
    title="Reset Password">
    <reset-password-form />
  </auth-form-container>
</template>
