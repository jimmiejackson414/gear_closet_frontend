<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { Plus } from 'lucide-vue-next';
  import { NumberFieldIncrement, useForwardProps } from 'radix-vue';
  import type { NumberFieldIncrementProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

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
      <plus class="h-4 w-4" />
    </slot>
  </number-field-increment>
</template>
