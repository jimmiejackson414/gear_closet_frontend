<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import { AvatarRoot } from 'reka-ui';
  import { cn } from '@/lib/utils';
  import { avatarVariant, type AvatarVariants } from '.';

  const props = withDefaults(defineProps<{
    class?: HTMLAttributes['class']
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
  }>(), {
    class: '',
    shape: 'circle',
    size: 'sm',
  });
</script>

<template>
  <avatar-root :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot />
  </avatar-root>
</template>
