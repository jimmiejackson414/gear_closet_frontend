<script setup lang="ts">
  import { PopoverTrigger, type PopoverTriggerProps } from 'radix-vue';

  const props = defineProps<PopoverTriggerProps>();
</script>

<template>
  <popover-trigger v-bind="props">
    <slot />
  </popover-trigger>
</template>
