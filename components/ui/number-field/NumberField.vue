<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { NumberFieldRoot, useForwardPropsEmits } from 'reka-ui';
  import type { NumberFieldRootEmits, NumberFieldRootProps } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<NumberFieldRootProps & { class?: HTMLAttributes['class'] }>();
  const emits = defineEmits<NumberFieldRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <number-field-root
    v-bind="forwarded"
    :class="cn('grid gap-1.5', props.class)">
    <slot />
  </number-field-root>
</template>
