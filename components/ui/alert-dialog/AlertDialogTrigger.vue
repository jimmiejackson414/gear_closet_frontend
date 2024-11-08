<script setup lang="ts">
  import { AlertDialogTrigger, type AlertDialogTriggerProps } from 'radix-vue';

  const props = defineProps<AlertDialogTriggerProps>();
</script>

<template>
  <alert-dialog-trigger v-bind="props">
    <slot />
  </alert-dialog-trigger>
</template>
