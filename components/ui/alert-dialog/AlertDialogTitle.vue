<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { AlertDialogTitle, type AlertDialogTitleProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <alert-dialog-title
    v-bind="delegatedProps"
    :class="cn('text-lg font-semibold', props.class)">
    <slot />
  </alert-dialog-title>
</template>
