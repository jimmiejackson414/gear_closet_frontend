<script lang='ts' setup>
  import GcSpinner from '@/components/common/GcSpinner.vue';
  import type { RouteLocationRaw } from 'vue-router';

  interface Props {
    disabled?: boolean;
    label?: string;
    loading?: boolean;
    outlined?: boolean;
    ghost?: boolean;
    size?: 'sm' | 'md' | 'lg';
    to?: RouteLocationRaw;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'positive' | 'danger';
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    label: '',
    loading: false,
    outlined: false,
    ghost: false,
    to: undefined,
    size: 'md',
    type: 'button',
    variant: 'primary',
  });
  
  const classList = computed(() => {
    let classes = ['btn'];

    // Sizes
    if (props.size == 'sm') { classes.push('btn-sm'); }
    if (props.size == 'md') { classes.push('btn-md'); }
    if (props.size == 'lg') { classes.push('btn-lg'); }

    // Variants
    if (props.outlined) {
      if (props.variant === 'primary') { classes.push('btn-primary-outline'); }
      if (props.variant === 'positive') { classes.push('btn-positive-outline'); }
      if (props.variant === 'danger') { classes.push('btn-danger-outline'); }
    } else if (props.ghost) {
      if (props.variant === 'primary') { classes.push('btn-primary-ghost'); }
      if (props.variant === 'positive') { classes.push('btn-positive-ghost'); }
      if (props.variant === 'danger') { classes.push('btn-danger-ghost'); }
    } else {
      if (props.variant === 'primary') { classes.push('btn-primary'); }
      if (props.variant === 'positive') { classes.push('btn-positive'); }
      if (props.variant === 'danger') { classes.push('btn-danger'); }
    }

    // Disabled
    if (props.disabled) {
      classes.push('cursor-not-allowed opacity-50');
    }

    return classes;
  });
</script>

<template>
  <nuxt-link
    v-if="to"
    :class="classList">
    {{ label }}
  </nuxt-link>
  <button
    v-else
    :class="classList"
    :disabled="disabled"
    :type="type">
    <gc-spinner
      v-if="loading"
      fill />
    <span v-else-if="$slots.default">
      <slot />
    </span>
    <span v-else>
      {{ label }}
    </span> 
  </button>
</template>
