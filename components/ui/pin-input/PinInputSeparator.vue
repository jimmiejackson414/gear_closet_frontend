<script setup lang="ts">
  import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui';

  const props = defineProps<PrimitiveProps>();
  const forwardedProps = useForwardProps(props);
</script>

<template>
  <primitive v-bind="forwardedProps">
    <slot>
      <icon-dot />
    </slot>
  </primitive>
</template>
