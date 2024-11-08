<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { DialogDescription, type DialogDescriptionProps, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <dialog-description
    v-bind="forwardedProps"
    :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </dialog-description>
</template>
