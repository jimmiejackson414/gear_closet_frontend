<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { NumberFieldDecrement, useForwardProps } from 'reka-ui';
  import type { NumberFieldDecrementProps } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <number-field-decrement
    v-bind="forwarded"
    :class="cn('absolute top-1/2 -translate-y-1/2 left-0 p-3 disabled:cursor-not-allowed disabled:opacity-20', props.class)"
    data-slot="decrement">
    <slot>
      <icon-minus class="h-4 w-4" />
    </slot>
  </number-field-decrement>
</template>
