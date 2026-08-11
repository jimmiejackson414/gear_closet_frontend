<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { Primitive, type PrimitiveProps, useForwardProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>();
  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
  });
  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <primitive
    v-bind="forwardedProps"
    :class="cn('flex items-center', props.class)">
    <slot />
  </primitive>
</template>
