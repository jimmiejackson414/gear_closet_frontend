<script lang='ts' setup>
  definePageMeta({ layout: 'page-layout' });

  useHead({
    title: 'Planning | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet planning page!',
      },
    ],
  });
</script>

<template>
  <div class="pb-8">
    <planning-container />
  </div>
</template>
