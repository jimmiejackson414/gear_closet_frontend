<script setup lang="ts">
  import {
    DropdownMenuSub,
    type DropdownMenuSubEmits,
    type DropdownMenuSubProps,
    useForwardPropsEmits,
  } from 'reka-ui';

  const props = defineProps<DropdownMenuSubProps>();
  const emits = defineEmits<DropdownMenuSubEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dropdown-menu-sub v-bind="forwarded">
    <slot />
  </dropdown-menu-sub>
</template>
