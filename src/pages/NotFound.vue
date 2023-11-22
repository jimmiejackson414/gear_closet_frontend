<script lang='ts' setup>
  import PublicLayout from '@/layouts/PublicLayout.vue';

  useHead({
    title: '404 Not Found | Gear Closet',
    meta: [
      {
        name: 'description',
        content: '404 Not Found',
      },
    ],
  });
</script>

<template>
  <public-layout align-logo="center">
    <div class="flex justify-center items-center flex-col h-full">
      <h1 class="font-bold mb-4 text-5xl">
        Not Found!
      </h1>
      <p class="font-bold mb-4 text-base">
        You dun goofed! Or we goofed. Or both?
      </p>
      <p class="text-base">
        The page you were looking for doesn't exist. Please make sure you've typed the URL correctly.
      </p>
    </div>
  </public-layout>
</template>
