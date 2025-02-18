<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import { NumberFieldIncrement, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import type { NumberFieldIncrementProps } from 'radix-vue';

  const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <number-field-increment
    v-bind="forwarded"
    :class="cn('absolute top-1/2 -translate-y-1/2 right-0 disabled:cursor-not-allowed disabled:opacity-20 p-3', props.class)"
    data-slot="increment">
    <slot>
      <icon-plus class="size-4" />
    </slot>
  </number-field-increment>
</template>
