<script setup lang="ts">
  import { DialogClose, type DialogCloseProps } from 'radix-vue';

  const props = defineProps<DialogCloseProps>();
</script>

<template>
  <dialog-close
    v-bind="props"
    as-child>
    <button-root variant="secondary">
      <slot />
    </button-root>
  </dialog-close>
</template>
