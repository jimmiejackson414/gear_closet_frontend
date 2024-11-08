<script setup lang="ts">
  import { Dot } from 'lucide-vue-next';
  import { Primitive, type PrimitiveProps, useForwardProps } from 'radix-vue';

  const props = defineProps<PrimitiveProps>();
  const forwardedProps = useForwardProps(props);
</script>

<template>
  <primitive v-bind="forwardedProps">
    <slot>
      <dot />
    </slot>
  </primitive>
</template>
