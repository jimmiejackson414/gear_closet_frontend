<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { type HTMLAttributes } from 'vue';
  import { StepperDescription, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import type { StepperDescriptionProps } from 'radix-vue';


  const props = defineProps<StepperDescriptionProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <stepper-description
    v-slot="slotProps: { [key: string]: any }"
    v-bind="forwarded"
    :class="cn('text-xs text-muted-foreground', props.class)">
    <slot v-bind="slotProps" />
  </stepper-description>
</template>
