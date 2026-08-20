<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { type HTMLAttributes } from 'vue';
  import { RangeCalendarPrev, useForwardProps, type RangeCalendarPrevProps } from 'reka-ui';
  import { buttonVariants } from '@/components/ui/button';
  import { cn } from '@/lib/utils';

  const props = defineProps<RangeCalendarPrevProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <range-calendar-prev
    :class="cn(
      buttonVariants({ variant: 'outline' }),
      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
      props.class,
    )"
    v-bind="forwardedProps">
    <slot>
      <icon-chevron-left class="h-4 w-4" />
    </slot>
  </range-calendar-prev>
</template>
