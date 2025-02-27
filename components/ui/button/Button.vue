<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'radix-vue';
  import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
  import { cn } from '@/lib/utils';
  import { type ButtonVariants, buttonVariants } from '.';
  import type { HTMLAttributes } from 'vue';

  interface Props extends PrimitiveProps {
    class?: HTMLAttributes['class'];
    loading?: boolean;
    size?: ButtonVariants['size'];
    variant?: ButtonVariants['variant'];
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    class: '',
    loading: false,
    size: 'default',
    variant: 'default',
  });
</script>

<template>
  <primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)">
    <spinner-icon
      v-if="loading"
      class="mr-2 size-4 animate-spin" />
    <slot />
  </primitive>
</template>
