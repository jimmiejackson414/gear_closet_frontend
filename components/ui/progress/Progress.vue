<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import {
    ProgressIndicator,
    ProgressRoot,
    type ProgressRootProps,
  } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = withDefaults(
    defineProps<ProgressRootProps & { class?: HTMLAttributes['class'] }>(),
    {
      class: '',
      modelValue: 0,
    },
  );

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <progress-root
    v-bind="delegatedProps"
    :class="
      cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        props.class,
      )
    ">
    <progress-indicator
      class="bg-primary flex-1 h-full transition-all w-full"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`" />
  </progress-root>
</template>
