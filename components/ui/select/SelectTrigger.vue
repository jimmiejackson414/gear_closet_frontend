<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from 'radix-vue';
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
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent dark:bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start relative',
      prependIcon ? 'ps-9' : '',
      props.class,
    )">
    <component
      :is="prependIcon"
      v-if="prependIcon"
      class="pointer-events-none absolute left-2.5 top-1/2 inline-block size-5 -translate-y-1/2 text-base text-foreground" />
    <slot />
    <select-icon as-child>
      <icon-chevron-down class="size-4 shrink-0 opacity-50" />
    </select-icon>
  </select-trigger>
</template>
