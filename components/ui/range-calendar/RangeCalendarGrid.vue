<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { computed, type HTMLAttributes } from 'vue';
  import { RangeCalendarGrid, type RangeCalendarGridProps, useForwardProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<RangeCalendarGridProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <range-calendar-grid
    :class="cn('w-full border-collapse space-y-1', props.class)"
    v-bind="forwardedProps">
    <slot />
  </range-calendar-grid>
</template>
