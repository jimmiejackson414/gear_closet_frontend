<script lang='ts' setup>
  const $store = useUserStore();
  definePageMeta({ layout: 'public-layout', colorMode: $store.profile ? undefined : 'light' });
</script>

<template>
  <div>
    Public Friends Page
  </div>
</template>
