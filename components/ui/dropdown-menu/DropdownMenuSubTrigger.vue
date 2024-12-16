<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import {
    DropdownMenuSubTrigger,
    type DropdownMenuSubTriggerProps,
    useForwardProps,
  } from 'radix-vue';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<DropdownMenuSubTriggerProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <dropdown-menu-sub-trigger
    v-bind="forwardedProps"
    :class="cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
      props.class,
    )">
    <slot />
    <icon-chevron-right class="h-4 ml-auto w-4" />
  </dropdown-menu-sub-trigger>
</template>
