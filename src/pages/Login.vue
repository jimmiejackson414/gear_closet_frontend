<script lang='ts' setup>
  import { useHead } from '@unhead/vue';
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import AuthFormContainer from '@/components/auth/AuthFormContainer.vue';
  import LoginForm from '@/components/auth/LoginForm.vue';
  import cld from '@/lib/cloudinary';
  import { logoColor } from '@/helpers';

  const fetchImage = async () => {
    const rand = Math.round(Math.random() * (14 - 1) + 1);
    const newImage = cld.image(`${import.meta.env.VITE_CLOUDINARY_AUTH_PAGES_PATH}/background${rand}`);
    return {
      image: newImage.format('auto')
        .toURL(),
      fill: logoColor(newImage),
    };
  };

  const backgroundImage = reactive(await fetchImage());

  useHead({
    title: 'Login',
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
