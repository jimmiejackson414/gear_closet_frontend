<script setup lang="ts">
  import { PopoverTrigger, type PopoverTriggerProps } from 'reka-ui';

  const props = defineProps<PopoverTriggerProps>();
</script>

<template>
  <popover-trigger v-bind="props">
    <slot />
  </popover-trigger>
</template>
