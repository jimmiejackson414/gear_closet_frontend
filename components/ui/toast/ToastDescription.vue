<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { ToastDescription, type ToastDescriptionProps } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<ToastDescriptionProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <toast-description
    :class="cn('text-sm opacity-90', props.class)"
    v-bind="delegatedProps">
    <slot />
  </toast-description>
</template>
