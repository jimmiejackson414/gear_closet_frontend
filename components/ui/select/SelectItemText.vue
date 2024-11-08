<script setup lang="ts">
  import { SelectItemText, type SelectItemTextProps } from 'radix-vue';

  const props = defineProps<SelectItemTextProps>();
</script>

<template>
  <select-item-text v-bind="props">
    <slot />
  </select-item-text>
</template>
