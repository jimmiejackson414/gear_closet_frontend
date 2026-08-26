<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';
  import { badgeVariants, type BadgeVariants } from '.';

  const props = withDefaults(defineProps<{
    variant?: BadgeVariants['variant']
    class?: HTMLAttributes['class']
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
