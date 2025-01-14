<script lang="ts" setup>
  interface Props {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'blockquote' | 'large' | 'lead' | 'small' | 'muted';
    class?: string;
  }

  const props = withDefaults(defineProps<Props>(), { variant: 'p', class: '' });

  const tagMap: Record<NonNullable<Props['variant']>, string> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    p: 'p',
    blockquote: 'blockquote',
    large: 'div',
    lead: 'p',
    small: 'small',
    muted: 'p',
  };

  const classMap: Record<NonNullable<Props['variant']>, string> = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    p: 'leading-7 font-normal',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    large: 'text-lg font-semibold',
    lead: 'text-xl text-muted-foreground',
    small: 'text-sm font-medium leading-none',
    muted: 'text-sm text-muted-foreground',
  };

  const tag = computed(() => tagMap[props.variant || 'p']);

  const computedClass = computed(() => [classMap[props.variant || 'p'], props.class].filter(Boolean)
    .join(' '));
</script>

<template>
  <component
    :is="tag"
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </component>
</template>