<script lang='ts' setup>
  definePageMeta({ layout: 'page-layout' });

  useHead({
    title: 'Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet!',
      },
    ],
  });
</script>

<template>
  <div class="pb-8">
    <closet-container />
  </div>
</template>
