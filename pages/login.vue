<script lang='ts' setup>
  definePageMeta({ layout: 'auth-layout', colorMode: 'light' });

  useHead({
    title: 'Login',
    meta: [
      {
        name: 'description',
        content: 'Login to your account',
      },
    ],
  });
</script>

<template>
  <auth-form-container
    subtitle="Please sign in to continue"
    title="Welcome Back!">
    <login-form />
  </auth-form-container>
</template>
