<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import {
    AlertDialogDescription,
    type AlertDialogDescriptionProps,
  } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <alert-dialog-description
    v-bind="delegatedProps"
    :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </alert-dialog-description>
</template>
