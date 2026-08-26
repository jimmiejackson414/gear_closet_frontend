<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import { Primitive, type PrimitiveProps } from 'reka-ui';
  import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
  import { cn } from '@/lib/utils';
  import { buttonVariants, type ButtonVariants } from '.';

  interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
    loading?: boolean;
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
      class="animate-spin h-4 mr-2 w-4" />
    <slot />
  </primitive>
</template>
