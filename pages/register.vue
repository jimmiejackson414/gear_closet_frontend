<script lang='ts' setup>
  definePageMeta({
    colorMode: 'light',
    layout: 'auth-layout',
  });

  useHead({
    meta: [
      {
        content: 'Register for an account',
        name: 'description',
      },
    ],
    title: 'Register',
  });
</script>

<template>
  <auth-form-container
    subtitle="Please sign up to continue"
    title="Create an Account">
    <register-form />
  </auth-form-container>
</template>
