<script lang='ts' setup>
  definePageMeta({ colorMode: 'light', layout: 'auth-layout' });

  useHead({
    meta: [
      {
        content: 'Forgot your password? Reset it here',
        name: 'description',
      },
    ],
    title: 'Forgot Password',
  });
</script>

<template>
  <auth-form-container
    subtitle="Enter your email address to reset your password"
    title="Forgot Password">
    <forgot-password-form />
  </auth-form-container>
</template>
