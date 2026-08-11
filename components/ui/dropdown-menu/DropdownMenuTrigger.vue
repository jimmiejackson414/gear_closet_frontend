<script setup lang="ts">
  import { DropdownMenuTrigger, type DropdownMenuTriggerProps, useForwardProps } from 'reka-ui';

  const props = defineProps<DropdownMenuTriggerProps>();

  const forwardedProps = useForwardProps(props);
</script>

<template>
  <dropdown-menu-trigger
    class="outline-none"
    v-bind="forwardedProps">
    <slot />
  </dropdown-menu-trigger>
</template>
