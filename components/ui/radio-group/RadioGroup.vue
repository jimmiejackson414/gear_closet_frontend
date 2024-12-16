<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { RadioGroupRoot, type RadioGroupRootEmits, type RadioGroupRootProps, useForwardPropsEmits } from 'radix-vue';
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
