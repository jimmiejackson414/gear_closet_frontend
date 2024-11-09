<script lang="ts" setup>
  import OnboardingContent from '@/components/onboarding/OnboardingContent.vue';

  definePageMeta({ layout: 'page-layout' });

  useHead({
    title: 'Onboarding | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet, let\'s get started!',
      },
    ],
  });
</script>

<template>
  <onboarding-content />
</template>