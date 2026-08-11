<script setup lang="ts">
  import { SelectItemText, type SelectItemTextProps } from 'reka-ui';

  const props = defineProps<SelectItemTextProps>();
</script>

<template>
  <select-item-text v-bind="props">
    <slot />
  </select-item-text>
</template>
