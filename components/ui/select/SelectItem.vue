<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { Check } from 'lucide-vue-next';
  import {
    SelectItem,
    SelectItemIndicator,
    type SelectItemProps,
    SelectItemText,
    useForwardProps,
  } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

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
        props.class,
      )
    ">
    <span class="absolute left-2 flex justify-center items-center h-3.5 w-3.5">
      <select-item-indicator>
        <check class="h-4 w-4" />
      </select-item-indicator>
    </span>

    <select-item-text>
      <slot />
    </select-item-text>
  </select-item>
</template>
