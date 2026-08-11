<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { StepperSeparator, useForwardProps } from 'reka-ui';
  import type { StepperSeparatorProps } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';


  const props = defineProps<StepperSeparatorProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <stepper-separator
    v-bind="forwarded"
    :class="cn(
      'bg-muted',
      // Disabled
      'group-data-disabled:bg-muted group-data-disabled:opacity-50',
      // Completed
      'group-data-[state=completed]:bg-accent-foreground',
      props.class,
    )" />
</template>
