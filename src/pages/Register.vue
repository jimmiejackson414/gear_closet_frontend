<script lang='ts' setup>
  import { useHead } from '@unhead/vue';
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import AuthFormContainer from '@/components/auth/AuthFormContainer.vue';
  import RegisterForm from '@/components/auth/RegisterForm.vue';
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
    title: 'Register',
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
