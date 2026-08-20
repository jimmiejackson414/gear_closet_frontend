<script setup lang="ts">
  import {
    AccordionRoot,
    useForwardPropsEmits,
    type AccordionRootEmits,
    type AccordionRootProps,
  } from 'reka-ui';

  const props = defineProps<AccordionRootProps>();
  const emits = defineEmits<AccordionRootEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <accordion-root v-bind="forwarded">
    <slot />
  </accordion-root>
</template>
