<script setup lang="ts">
  import { DialogTrigger, type DialogTriggerProps } from 'radix-vue';

  const props = defineProps<DialogTriggerProps>();
</script>

<template>
  <dialog-trigger v-bind="props">
    <slot />
  </dialog-trigger>
</template>
