<script lang='ts' setup>
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import AuthFormContainer from '@/components/auth/AuthFormContainer.vue';
  import LoginForm from '@/components/auth/LoginForm.vue';
  import { useAuthLayout } from '@/composables';

  const { backgroundImage } = await useAuthLayout();

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
  <auth-layout
    :fill="backgroundImage.fill"
    :image="backgroundImage.image">
    <auth-form-container
      subtitle="Please sign in to continue"
      title="Welcome Back!">
      <login-form />
    </auth-form-container>
  </auth-layout>
</template>
