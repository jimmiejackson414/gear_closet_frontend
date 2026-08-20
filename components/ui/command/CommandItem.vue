<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { ComboboxItem, useForwardPropsEmits } from 'reka-ui';
  import { cn } from '@/lib/utils';
  import type { ComboboxItemEmits, ComboboxItemProps } from 'reka-ui';

  const props = defineProps<ComboboxItemProps & { class?: HTMLAttributes['class'] }>();
  const emits = defineEmits<ComboboxItemEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <combobox-item
    v-bind="forwarded"
    :class="cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50', props.class)">
    <slot />
  </combobox-item>
</template>
