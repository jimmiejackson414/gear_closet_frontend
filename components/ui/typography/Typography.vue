<script lang="ts" setup>
  import { cn } from '@/lib/utils';

  interface Props {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'blockquote' | 'large' | 'lead' | 'small' | 'muted';
    class?: string;
  }

  const props = withDefaults(defineProps<Props>(), { class: '', variant: 'p' });

  const tagMap: Record<NonNullable<Props['variant']>, string> = {
    blockquote: 'blockquote',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    large: 'div',
    lead: 'p',
    muted: 'p',
    p: 'p',
    small: 'small',
  };

  const classMap: Record<NonNullable<Props['variant']>, string> = {
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    large: 'text-lg font-semibold',
    lead: 'text-xl text-muted-foreground',
    muted: 'text-sm text-muted-foreground',
    p: 'text-base',
    small: 'text-sm font-medium leading-none',
  };

  const tag = computed(() => tagMap[props.variant || 'p']);

  const computedClass = computed(() => cn(classMap[props.variant || 'p'], props.class));
</script>

<template>
  <component
    :is="tag"
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </component>
</template>