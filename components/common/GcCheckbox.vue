<script lang='ts' setup>
  interface Props {
    id: string;
    modelValue: boolean;
    label?: string | null;
    strikeThrough?: boolean;
    variant?: 'primary' | 'positive' | 'danger' | 'secondary';
  }

  const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    strikeThrough: false,
    variant: 'positive',
  });

  const emits = defineEmits(['update:modelValue']);

  const handleChange = (event: Event) => {
    emits('update:modelValue', (event.target as HTMLInputElement).checked);
  };

  const computedClasses = computed(() => {
    let classes = [];

    if (props.variant === 'primary') { classes.push('text-primary focus:ring-primary'); }
    if (props.variant === 'positive') { classes.push('text-positive focus:ring-positive'); }
    if (props.variant === 'danger') { classes.push('text-danger focus:ring-danger'); }
    if (props.variant === 'secondary') { classes.push('text-secondary focus:ring-secondary'); }

    return classes.join(' ');
  });
</script>

<template>
  <div class="cursor-pointer flex items-start">
    <input
      :id="id"
      :checked="modelValue"
      class="bg-gray-100 border-gray-300 cursor-pointer h-4 mt-1 rounded w-4 focus:ring-2"
      :class="computedClasses"
      type="checkbox"
      value=""
      @change="handleChange">
    <label
      v-if="label"
      class="cursor-pointer font-medium ms-2 text-gray-500 text-sm"
      :for="id">
      {{ label }}
    </label>
  </div>
</template>
