<script lang="ts" setup>
  import { cn } from '@/lib/utils';
  import { RangeCalendarHeading, type RangeCalendarHeadingProps, useForwardProps } from 'radix-vue';
  import { computed, type HTMLAttributes } from 'vue';

  const props = defineProps<RangeCalendarHeadingProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <range-calendar-heading
    v-slot="{ headingValue }"
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps">
    <slot name="heading-value">
      {{ headingValue }}
    </slot>
  </range-calendar-heading>
</template>
