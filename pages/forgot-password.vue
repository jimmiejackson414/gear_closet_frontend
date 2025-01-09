<script lang='ts' setup>
  definePageMeta({ layout: 'auth-layout', colorMode: 'light' });

  useHead({
    title: 'Forgot Password | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Forgot your password? Reset it here',
      },
    ],
  });
</script>

<template>
  <auth-form-container
    subtitle="Enter your email address to reset your password"
    title="Forgot Password">
    <forgot-password-form />
  </auth-form-container>
</template>
