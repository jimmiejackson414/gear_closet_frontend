<script setup lang="ts">
  import { DropdownMenuTrigger, useForwardProps, type DropdownMenuTriggerProps } from 'reka-ui';

  const props = defineProps<DropdownMenuTriggerProps>();

  const forwardedProps = useForwardProps(props);
</script>

<template>
  <dropdown-menu-trigger
    class="outline-hidden"
    v-bind="forwardedProps">
    <slot />
  </dropdown-menu-trigger>
</template>
