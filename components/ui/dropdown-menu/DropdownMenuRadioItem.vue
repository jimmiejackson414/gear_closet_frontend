<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import {
    DropdownMenuItemIndicator,
    DropdownMenuRadioItem,
    type DropdownMenuRadioItemEmits,
    type DropdownMenuRadioItemProps,
    useForwardPropsEmits,
  } from 'radix-vue';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<DropdownMenuRadioItemProps & { class?: HTMLAttributes['class'] }>();

  const emits = defineEmits<DropdownMenuRadioItemEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <dropdown-menu-radio-item
    v-bind="forwarded"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class,
    )">
    <span class="absolute left-2 flex justify-center items-center h-3.5 w-3.5">
      <dropdown-menu-item-indicator>
        <icon-circle class="fill-current h-2 w-2" />
      </dropdown-menu-item-indicator>
    </span>
    <slot />
  </dropdown-menu-radio-item>
</template>
