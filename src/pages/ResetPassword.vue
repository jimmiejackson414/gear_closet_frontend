<script lang='ts' setup>
  import AuthLayout from '@/layouts/AuthLayout.vue'; 
  import AuthFormContainer from '@/components/auth/AuthFormContainer.vue';
  import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue';
  import { useAuthLayout } from '@/composables';

  const { backgroundImage } = await useAuthLayout();

  useHead({
    title: 'Reset Password | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Reset your password here',
      },
    ],
  });
</script>

<template>
  <auth-layout
    :fill="backgroundImage.fill"
    :image="backgroundImage.image">
    <auth-form-container
      subtitle="Please create a new password"
      title="Reset Password">
      <reset-password-form />
    </auth-form-container>
  </auth-layout>
</template>
