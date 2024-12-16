<script setup lang="ts">
  import { DialogRoot, type DialogRootEmits, type DialogRootProps, useForwardPropsEmits } from 'radix-vue';

  const props = defineProps<DialogRootProps>();
  const emits = defineEmits<DialogRootEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dialog-root v-bind="forwarded">
    <slot />
  </dialog-root>
</template>
