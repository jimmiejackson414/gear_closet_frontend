<script lang='ts' setup>
  interface Props {
    id: string;
    modelValue: boolean;
    label?: string | null;
    strikeThrough?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    label: undefined,
    strikeThrough: false,
  });

  const emits = defineEmits(['update:modelValue']);

  const handleChange = (event: Event) => {
    emits('update:modelValue', (event.target as HTMLInputElement).checked);
  };
</script>

<template>
  <div class="cursor-pointer flex items-center">
    <input
      :id="id"
      :checked="modelValue"
      class="bg-gray-100 border-gray-300 cursor-pointer h-4 rounded text-positive w-4 focus:ring-2 focus:ring-positive"
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
