<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type LabelProps, Label as UiLabel } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <ui-label
    v-bind="delegatedProps"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class,
      )
    ">
    <slot />
  </ui-label>
</template>
