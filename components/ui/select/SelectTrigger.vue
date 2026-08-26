<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import { SelectIcon, SelectTrigger, useForwardProps, type SelectTriggerProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'], prependIcon?: any }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <select-trigger
    v-bind="forwardedProps"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent dark:bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start relative',
      prependIcon ? 'ps-9' : '',
      props.class,
    )">
    <component
      :is="prependIcon"
      v-if="prependIcon"
      class="inline-block top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none" />
    <slot />
    <select-icon as-child>
      <icon-chevron-down class="opacity-50 w-4 h-4 shrink-0" />
    </select-icon>
  </select-trigger>
</template>
