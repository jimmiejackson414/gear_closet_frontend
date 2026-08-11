<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import {
    AccordionHeader,
    AccordionTrigger,
    type AccordionTriggerProps,
  } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <accordion-header class="flex">
    <accordion-trigger
      v-bind="delegatedProps"
      :class="
        cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          props.class,
        )
      ">
      <slot />
      <slot name="icon">
        <icon-chevron-down class="duration-200 h-4 shrink-0 transition-transform w-4" />
      </slot>
    </accordion-trigger>
  </accordion-header>
</template>
