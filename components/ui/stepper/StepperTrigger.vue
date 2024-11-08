<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { computed, type HTMLAttributes } from 'vue';
  import { StepperTrigger, useForwardProps } from 'radix-vue';
  import type { StepperTriggerProps } from 'radix-vue';
  import { cn } from '@/lib/utils';


  const props = defineProps<StepperTriggerProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <stepper-trigger
    v-bind="forwarded"
    :class="cn('p-2 flex flex-col items-center text-center gap-2 rounded-md', props.class)">
    <slot />
  </stepper-trigger>
</template>
