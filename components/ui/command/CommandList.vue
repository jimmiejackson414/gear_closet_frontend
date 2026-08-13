<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { ComboboxContent, useForwardPropsEmits } from 'reka-ui';
  import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = withDefaults(defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>(), {
    class: '',
    dismissable: false,
  });
  const emits = defineEmits<ComboboxContentEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <combobox-content
    v-bind="forwarded"
    :class="cn('max-h-75 overflow-y-auto overflow-x-hidden', props.class)">
    <div role="presentation">
      <slot />
    </div>
  </combobox-content>
</template>
