<script lang='ts' setup>
  import { useHead } from '@unhead/vue';
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
    :image="backgroundImage.image"
    :fill="backgroundImage.fill">
    <auth-form-container
      title="Welcome Back!"
      subtitle="Please sign in to continue">
      <login-form />
    </auth-form-container>
  </auth-layout>
</template>
