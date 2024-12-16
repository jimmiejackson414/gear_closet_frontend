<script lang='ts' setup>
  import ProfileContent from '@/components/profile/ProfileContent.vue';

  definePageMeta({ layout: 'page-layout' });
  useHead({
    title: 'Profile | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet profile page!',
      },
    ],
  });
</script>

<template>
  <profile-content />
</template>
