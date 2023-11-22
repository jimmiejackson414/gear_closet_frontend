<script lang='ts' setup>
  import AuthLayout from '@/layouts/AuthLayout.vue'; 
  import AuthFormContainer from '@/components/auth/AuthFormContainer.vue';
  import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';
  import { useAuthLayout } from '@/composables';
  
  const { backgroundImage } = await useAuthLayout();

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
  <auth-layout
    :image="backgroundImage.image"
    :fill="backgroundImage.fill">
    <auth-form-container
      title="Forgot Password"
      subtitle="Please enter your email address<br /> to reset your password">
      <forgot-password-form />
    </auth-form-container>
  </auth-layout>
</template>
