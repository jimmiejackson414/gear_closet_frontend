<script setup lang="ts">
  import { DialogRoot, useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'reka-ui';

  const props = defineProps<DialogRootProps>();
  const emits = defineEmits<DialogRootEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dialog-root v-bind="forwarded">
    <slot />
  </dialog-root>
</template>
