<script setup lang="ts">
  import { Primitive, type PrimitiveProps, useForwardProps } from 'reka-ui';

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
