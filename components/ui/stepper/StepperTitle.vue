<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { computed, type HTMLAttributes } from 'vue';
  import { StepperTitle, useForwardProps } from 'radix-vue';
  import type { StepperTitleProps } from 'radix-vue';
  import { cn } from '@/lib/utils';


  const props = defineProps<StepperTitleProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <stepper-title
    v-bind="forwarded"
    :class="cn('text-md font-semibold whitespace-nowrap', props.class)">
    <slot />
  </stepper-title>
</template>
