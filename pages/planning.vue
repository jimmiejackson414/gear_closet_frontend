<script lang='ts' setup>
  definePageMeta({ layout: 'page-layout' });

  useHead({
    meta: [
      {
        content: 'Welcome to your Gear Closet planning page!',
        name: 'description',
      },
    ],
    title: 'Planning',
  });
</script>

<template>
  <planning-container />
</template>
