<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { ComboboxInput, type ComboboxInputProps, useForwardProps } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<ComboboxInputProps & {
    class?: HTMLAttributes['class']
  }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <div
    class="border-b flex items-center px-3"
    cmdk-input-wrapper>
    <icon-search class="h-4 mr-2 opacity-50 shrink-0 w-4" />
    <combobox-input
      v-bind="{ ...forwardedProps, ...$attrs }"
      auto-focus
      :class="cn('flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', props.class)" />
  </div>
</template>
