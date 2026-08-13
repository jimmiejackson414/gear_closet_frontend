<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { RadioGroupRoot, type RadioGroupRootEmits, type RadioGroupRootProps, useForwardPropsEmits } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<RadioGroupRootProps & { class?: HTMLAttributes['class'] }>();
  const emits = defineEmits<RadioGroupRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <radio-group-root
    :class="cn('grid gap-2', props.class)"
    v-bind="forwarded">
    <slot />
  </radio-group-root>
</template>
