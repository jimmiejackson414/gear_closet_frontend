<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class'], inset?: boolean }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <dropdown-menu-item
    v-bind="forwardedProps"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50  [&>svg]:size-4 [&>svg]:shrink-0',
      inset && 'pl-8',
      props.class,
    )">
    <slot />
  </dropdown-menu-item>
</template>
