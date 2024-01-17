<script lang='ts' setup>
  definePageMeta({
    layout: 'auth-layout',
  });

  useHead({
    title: 'Register | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Register for an account',
      },
    ],
  });
</script>

<template>
  <auth-form-container
    subtitle="Please sign up to continue"
    title="Create an Account">
    <register-form />
  </auth-form-container>
</template>
