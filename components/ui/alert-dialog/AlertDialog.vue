<script setup lang="ts">
  import { AlertDialogRoot, useForwardPropsEmits, type AlertDialogEmits, type AlertDialogProps } from 'reka-ui';

  const props = defineProps<AlertDialogProps>();
  const emits = defineEmits<AlertDialogEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <alert-dialog-root v-bind="forwarded">
    <slot />
  </alert-dialog-root>
</template>
