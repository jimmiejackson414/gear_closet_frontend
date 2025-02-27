<script setup lang="ts">
  import { cn } from '@/lib/utils';
  import { type BadgeVariants, badgeVariants } from '.';
  import type { HTMLAttributes } from 'vue';

  const props = withDefaults(defineProps<{
    class?: HTMLAttributes['class']
    variant?: BadgeVariants['variant']
  }>(), {
    class: '',
    variant: 'default',
  });
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
