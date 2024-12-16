<script setup lang="ts">
  import {
    DropdownMenuRadioGroup,
    type DropdownMenuRadioGroupEmits,
    type DropdownMenuRadioGroupProps,
    useForwardPropsEmits,
  } from 'radix-vue';

  const props = defineProps<DropdownMenuRadioGroupProps>();
  const emits = defineEmits<DropdownMenuRadioGroupEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dropdown-menu-radio-group v-bind="forwarded">
    <slot />
  </dropdown-menu-radio-group>
</template>
