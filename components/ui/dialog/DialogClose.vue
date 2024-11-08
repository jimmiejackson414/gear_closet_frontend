<script setup lang="ts">
  import { DialogClose, type DialogCloseProps } from 'radix-vue';

  const props = defineProps<DialogCloseProps>();
</script>

<template>
  <dialog-close v-bind="props">
    <slot />
  </dialog-close>
</template>
