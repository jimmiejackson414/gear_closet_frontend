<script lang='ts' setup>
  definePageMeta({ layout: 'page-layout' });

  useHead({
    meta: [
      {
        content: 'Welcome to your Gear Closet!',
        name: 'description',
      },
    ],
    title: 'Closet',
  });
</script>

<template>
  <div class="pb-8">
    <closet-container />
  </div>
</template>
