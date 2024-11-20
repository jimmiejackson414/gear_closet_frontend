<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'radix-vue';
  import type { HTMLAttributes } from 'vue';
  import { type ButtonVariants, buttonVariants } from '.';
  import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
  import { cn } from '@/lib/utils';

  interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    variant: 'default',
    size: 'default',
    class: '',
    loading: false,
  });
</script>

<template>
  <primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)">
    <spinner-icon
      v-if="loading"
      class="animate-spin h-4 mr-2 w-4" />
    <slot />
  </primitive>
</template>
