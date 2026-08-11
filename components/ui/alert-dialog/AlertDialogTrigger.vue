<script setup lang="ts">
  import { AlertDialogTrigger, type AlertDialogTriggerProps } from 'reka-ui';

  const props = defineProps<AlertDialogTriggerProps>();
</script>

<template>
  <alert-dialog-trigger v-bind="props">
    <slot />
  </alert-dialog-trigger>
</template>
