<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { ComboboxEmpty } from 'reka-ui';
  import { cn } from '@/lib/utils';
  import type { ComboboxEmptyProps } from 'reka-ui';

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
