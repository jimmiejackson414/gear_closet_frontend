<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { type HTMLAttributes } from 'vue';
  import { StepperRoot, useForwardPropsEmits } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import type { StepperRootEmits, StepperRootProps } from 'radix-vue';


  const props = defineProps<StepperRootProps & { class?: HTMLAttributes['class'] }>();
  const emits = defineEmits<StepperRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <stepper-root
    v-slot="slotProps"
    :class="cn(
      'flex gap-2',
      props.class,
    )"
    v-bind="forwarded">
    <slot v-bind="slotProps" />
  </stepper-root>
</template>
