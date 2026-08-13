<script lang='ts' setup>
  definePageMeta({ layout: 'auth-layout', colorMode: 'light' });

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
