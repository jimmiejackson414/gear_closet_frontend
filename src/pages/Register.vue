<script lang='ts' setup>
  import { useHead } from '@unhead/vue';
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import AuthFormContainer from '@/components/auth/AuthFormContainer.vue';
  import RegisterForm from '@/components/auth/RegisterForm.vue';
  import { useAuthLayout } from '@/composables';

  const { backgroundImage } = await useAuthLayout();

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
  <auth-layout
    :image="backgroundImage.image"
    :fill="backgroundImage.fill">
    <auth-form-container
      title="Create an Account"
      subtitle="Please sign up to continue">
      <register-form />
    </auth-form-container>
  </auth-layout>
</template>
