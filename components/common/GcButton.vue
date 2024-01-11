<script lang='ts' setup>
  import GcSpinner from '@/components/common/GcSpinner.vue';
  import type { Icon } from 'lucide-vue-next';
  import type { RouteLocationRaw } from 'vue-router';

  interface Props {
    disabled?: boolean;
    icon?: Icon;
    label?: string;
    loading?: boolean;
    outlined?: boolean;
    ghost?: boolean;
    round?: boolean;
    size?: 'sm' | 'md' | 'lg';
    to?: RouteLocationRaw;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'positive' | 'danger' | 'secondary';
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    icon: undefined,
    label: '',
    loading: false,
    outlined: false,
    ghost: false,
    round: false,
    to: undefined,
    size: 'md',
    type: 'button',
    variant: 'primary',
  });

  // const emit = defineEmits(['click']);
  
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
    } else if (props.variant === 'secondary') {
      classes.push('btn-secondary');
    } else {
      if (props.variant === 'primary') { classes.push('btn-primary'); }
      if (props.variant === 'positive') { classes.push('btn-positive'); }
      if (props.variant === 'danger') { classes.push('btn-danger'); }
    }

    // Disabled
    if (props.disabled) { classes.push('cursor-not-allowed opacity-50'); }

    // Round
    if (props.round) { classes.push('rounded-full'); }

    // Icon
    if (props.icon) {
      classes.push('btn-icon p-0');
      if (props.size == 'sm') { classes.push('w-6 h-6'); }
      if (props.size == 'md') { classes.push('w-8 h-8'); }
      if (props.size == 'lg') { classes.push('w-12 h-12'); }
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
    v-bind="$attrs"
    :class="classList"
    :disabled="disabled"
    :type="type">
    <gc-spinner
      v-if="loading"
      fill />
    <span v-else-if="$slots.default">
      <slot />
    </span>
    <component
      :is="icon"
      v-else-if="icon"
      class="text-white" />
    <span v-else>
      {{ label }}
    </span> 
  </button>
</template>
