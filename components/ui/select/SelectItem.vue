<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import {
    SelectItem,
    SelectItemIndicator,
    type SelectItemProps,
    SelectItemText,
    useForwardProps,
  } from 'radix-vue';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'], hideCheckmark?: boolean }>();

  const delegatedProps = computed(() => {
    const { class: _, hideCheckmark, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <select-item
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        hideCheckmark ? 'pl-2' : 'pl-8',
        props.class,
      )
    ">
    <span
      v-if="!hideCheckmark"
      class="absolute left-2 flex justify-center items-center h-3.5 w-3.5">
      <select-item-indicator>
        <icon-check class="h-4 w-4" />
      </select-item-indicator>
    </span>

    <select-item-text>
      <slot />
    </select-item-text>
  </select-item>
</template>
