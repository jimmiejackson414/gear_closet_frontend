<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import { ComboboxInput, type ComboboxInputProps, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import { CommandCancel } from '.';

  defineOptions({
    inheritAttrs: false,
  });

  const emits = defineEmits<{
    (e: 'clear'): void;
  }>();
  const props = defineProps<ComboboxInputProps & {
    class?: HTMLAttributes['class']
    clearable?: boolean
  }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <div
    class="flex items-center border-b px-3"
    cmdk-input-wrapper>
    <slot name="prepend-icon">
      <icon-search class="mr-2 size-4 shrink-0 opacity-50" />
    </slot>
    <combobox-input
      v-bind="{ ...forwardedProps, ...$attrs }"
      auto-focus
      :class="cn('flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', props.class)" />
    <command-cancel
      v-if="clearable"
      @click="emits('clear')" />
  </div>
</template>
