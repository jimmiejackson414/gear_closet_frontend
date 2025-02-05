<script lang='ts' setup>
  definePageMeta({ layout: 'page-layout' });

  useHead({
    title: 'Planning',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet planning page!',
      },
    ],
  });
</script>

<template>
  <planning-container />
</template>
