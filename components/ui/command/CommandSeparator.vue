<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { ComboboxSeparator } from 'radix-vue';
  import type { ComboboxSeparatorProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<ComboboxSeparatorProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <combobox-separator
    v-bind="delegatedProps"
    :class="cn('-mx-1 h-px bg-border', props.class)">
    <slot />
  </combobox-separator>
</template>
