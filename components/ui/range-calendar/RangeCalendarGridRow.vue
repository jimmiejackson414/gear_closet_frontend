<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { RangeCalendarGridRow, type RangeCalendarGridRowProps, useForwardProps } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<RangeCalendarGridRowProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <range-calendar-grid-row
    :class="cn('flex mt-2 w-full', props.class)"
    v-bind="forwardedProps">
    <slot />
  </range-calendar-grid-row>
</template>
