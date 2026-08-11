<script setup lang="ts">
  import { ToastProvider, type ToastProviderProps } from 'reka-ui';

  const props = defineProps<ToastProviderProps>();
</script>

<template>
  <toast-provider v-bind="props">
    <slot />
  </toast-provider>
</template>
