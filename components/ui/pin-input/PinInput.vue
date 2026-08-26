<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { PinInputRoot, useForwardPropsEmits, type PinInputRootEmits, type PinInputRootProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = withDefaults(defineProps<PinInputRootProps & { class?: HTMLAttributes['class'] }>(), {
    class: '',
    modelValue: () => [],
  });
  const emits = defineEmits<PinInputRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <pin-input-root
    v-bind="forwarded"
    :class="cn('flex gap-2 items-center', props.class)">
    <slot />
  </pin-input-root>
</template>
