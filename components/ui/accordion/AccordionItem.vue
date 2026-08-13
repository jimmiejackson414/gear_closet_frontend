<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { AccordionItem, type AccordionItemProps, useForwardProps } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <accordion-item
    v-bind="forwardedProps"
    :class="cn('border-b', props.class)">
    <slot />
  </accordion-item>
</template>
