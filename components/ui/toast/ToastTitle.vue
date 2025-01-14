<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { ToastTitle, type ToastTitleProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<ToastTitleProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <toast-title
    v-bind="delegatedProps"
    :class="cn('text-sm font-semibold', props.class)">
    <slot />
  </toast-title>
</template>
