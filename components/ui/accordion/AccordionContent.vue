<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { AccordionContent, type AccordionContentProps } from 'radix-vue';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <accordion-content
    v-bind="delegatedProps"
    class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all">
    <div :class="cn('pb-4 pt-0', props.class)">
      <slot />
    </div>
  </accordion-content>
</template>
