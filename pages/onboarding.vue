<script lang="ts" setup>
  import OnboardingContent from '@/components/onboarding/OnboardingContent.vue';

  definePageMeta({ layout: 'page-layout' });

  useHead({
    meta: [
      {
        content: 'Welcome to your Gear Closet, let\'s get started!',
        name: 'description',
      },
    ],
    title: 'Onboarding',
  });
</script>

<template>
  <onboarding-content />
</template>