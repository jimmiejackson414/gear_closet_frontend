<script setup lang="ts">
  import { ToastProvider, type ToastProviderProps } from 'radix-vue';

  const props = defineProps<ToastProviderProps>();
</script>

<template>
  <toast-provider v-bind="props">
    <slot />
  </toast-provider>
</template>
