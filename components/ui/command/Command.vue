<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import { ComboboxRoot, useForwardPropsEmits } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import type { ComboboxRootEmits, ComboboxRootProps } from 'radix-vue';

  const props = withDefaults(defineProps<ComboboxRootProps & { class?: HTMLAttributes['class'] }>(), {
    class: '',
    modelValue: '',
    open: true,
  });

  const emits = defineEmits<ComboboxRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <combobox-root
    v-bind="forwarded"
    :class="cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', props.class)">
    <slot />
  </combobox-root>
</template>
