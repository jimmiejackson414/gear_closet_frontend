<script setup lang="ts">
  import { AvatarFallback, type AvatarFallbackProps } from 'radix-vue';

  const props = defineProps<AvatarFallbackProps>();
</script>

<template>
  <avatar-fallback v-bind="props">
    <slot />
  </avatar-fallback>
</template>
