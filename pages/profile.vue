<script lang='ts' setup>
  import ProfileContent from '@/components/profile/ProfileContent.vue';

  definePageMeta({ layout: 'page-layout' });
  useHead({
    meta: [
      {
        content: 'Welcome to your Gear Closet profile page!',
        name: 'description',
      },
    ],
    title: 'Profile',
  });
</script>

<template>
  <profile-content />
</template>
