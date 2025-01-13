<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { ComboboxEmpty } from 'radix-vue';
  import type { ComboboxEmptyProps } from 'radix-vue';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <combobox-empty
    v-bind="delegatedProps"
    :class="cn('py-3 text-center text-sm', props.class)">
    <slot />
  </combobox-empty>
</template>
