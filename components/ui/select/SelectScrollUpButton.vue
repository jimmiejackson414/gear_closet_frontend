<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { ChevronUp } from 'lucide-vue-next';
  import { SelectScrollUpButton, type SelectScrollUpButtonProps, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <select-scroll-up-button
    v-bind="forwardedProps"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <slot>
      <chevron-up class="h-4 w-4" />
    </slot>
  </select-scroll-up-button>
</template>
