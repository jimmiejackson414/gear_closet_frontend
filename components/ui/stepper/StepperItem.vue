<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { type HTMLAttributes } from 'vue';
  import { StepperItem, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import type { StepperItemProps } from 'radix-vue';


  const props = defineProps<StepperItemProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <stepper-item
    v-slot="slotProps"
    v-bind="forwarded"
    :class="cn('flex items-center gap-2 group data-[disabled]:pointer-events-none', props.class)">
    <slot v-bind="slotProps" />
  </stepper-item>
</template>
