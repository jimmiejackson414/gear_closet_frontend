<script lang='ts' setup>
  interface Props {
    disabled?: boolean;
    label?: string;
    modelValue: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'positive' | 'danger';
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    label: undefined,
    modelValue: false,
    size: 'md',
    variant: 'primary',
  });

  const computedClasses = computed(() => {
    const classes = [];

    // determine size
    if (props.size === 'sm') { classes.push('w-9 h-5 after:top-[2px] after:start-[2px] after:h-4 after:w-4'); }
    else if (props.size === 'md') { classes.push('w-11 h-6 after:top-[3px] after:start-[2px] after:h-5 after:w-5'); }
    else if (props.size === 'lg') { classes.push('w-14 h-7 after:top-0.5 after:start-[4px] after:w-6 after:h-6'); }

    // determine variant
    if (props.variant === 'primary') { classes.push('peer-checked:bg-primary'); }
    else if (props.variant === 'positive') { classes.push('peer-checked:bg-positive'); }
    else if (props.variant === 'danger') { classes.push('peer-checked:bg-danger'); }

    return classes;
  });

  const emit = defineEmits(['update:modelValue']);
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
  };
</script>

<template>
  <label class="cursor-pointer inline-flex items-center relative w-fit">
    <input
      :checked="modelValue"
      class="peer sr-only"
      type="checkbox"
      @change="handleChange">
    <div
      class="bg-gray-200 after:bg-white peer peer-checked:after:border-white peer-checked:after:translate-x-full peer-focus:outline-none rounded-full after:rounded-full after:absolute after:border after:border-gray-300 after:content-[''] after:transition-all"
      :class="computedClasses" />
    <span
      v-if="$slots.default"
      class="ml-3">
      <slot />
    </span>
    <span
      v-else
      class="font-medium ms-3 text-gray-900 dark:text-gray-300 text-sm">
      {{ label }}
    </span>
  </label>
</template>
