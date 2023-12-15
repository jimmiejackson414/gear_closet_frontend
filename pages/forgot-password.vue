<script lang='ts' setup>
  definePageMeta({
    layout: 'auth-layout',
  });

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
    subtitle="Please enter your email address<br /> to reset your password"
    title="Forgot Password">
    <forgot-password-form />
  </auth-form-container>
</template>
