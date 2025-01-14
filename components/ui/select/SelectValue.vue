<script setup lang="ts">
  import { SelectValue, type SelectValueProps } from 'radix-vue';

  const props = defineProps<SelectValueProps>();
</script>

<template>
  <select-value v-bind="props">
    <slot />
  </select-value>
</template>
