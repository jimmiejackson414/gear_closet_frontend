<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { SelectScrollDownButton, type SelectScrollDownButtonProps, useForwardProps } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <select-scroll-down-button
    v-bind="forwardedProps"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <slot>
      <icon-chevron-down class="h-4 w-4" />
    </slot>
  </select-scroll-down-button>
</template>
