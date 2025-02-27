<script lang='ts' setup>
  definePageMeta({ colorMode: 'light', layout: 'auth-layout' });

  useHead({
    meta: [
      {
        content: 'Login to your account',
        name: 'description',
      },
    ],
    title: 'Login',
  });
</script>

<template>
  <auth-form-container
    subtitle="Please sign in to continue"
    title="Welcome Back!">
    <login-form />
  </auth-form-container>
</template>
