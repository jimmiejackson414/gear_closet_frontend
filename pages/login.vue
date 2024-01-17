<script lang='ts' setup>
  definePageMeta({
    layout: 'auth-layout',
  });

  useHead({
    title: 'Login | Gear Closet',
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
