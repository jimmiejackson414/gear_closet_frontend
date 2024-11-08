<script setup lang="ts">
  import {
    AccordionRoot,
    type AccordionRootEmits,
    type AccordionRootProps,
    useForwardPropsEmits,
  } from 'radix-vue';

  const props = defineProps<AccordionRootProps>();
  const emits = defineEmits<AccordionRootEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <accordion-root v-bind="forwarded">
    <slot />
  </accordion-root>
</template>
