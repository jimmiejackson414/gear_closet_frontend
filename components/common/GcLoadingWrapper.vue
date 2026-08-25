<script lang='ts' setup>
  // Eager import: Nuxt auto-imports this as an async chunk, which Vitest can
  // try to load after the test environment is already torn down.
  import GcLoading from '@/components/icons/GcLoading.vue';
</script>

<template>
  <div class="flex justify-center items-center flex-col h-screen w-full">
    <gc-loading icon-class="w-12 h-12 mb-4" />
  </div>
</template>
