<script lang='ts' setup>
  interface Props {
    autocomplete?: string;
    disabled?: boolean;
    error?: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    type?: string;
    modelValue: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    autocomplete: 'off',
    disabled: false,
    error: undefined,
    label: '',
    placeholder: undefined,
    required: false,
    type: 'text',
    modelValue: null,
  });

  const emit = defineEmits(['update:model-value', 'blur']);

  const handleInput = (val: string) => {
    emit('update:model-value', val || undefined);
  };

  const handleBlur = (val: string) => {
    emit('blur', val || undefined);
  };

  const hasError = computed(() => {
    return !!props.error;
  });

  const slots = useSlots();
  const hasPrependSlot = computed(() => {
    return !!slots['prepend'];
  });
</script>

<template>
  <div>
    <div class="relative">
      <input
        :type="type"
        class="bg-white block border focus:border-primary duration-100 ease-in-out peer px-4 py-3 rounded-lg text-sm transition-all w-full disabled:opacity-50 disabled:pointer-events-none focus:ring-primary"
        :class="[
          hasPrependSlot ? 'ps-11' : 'ps-4',
          hasError ? 'border-danger' : 'border-gray-200',
          disabled ? 'bg-gray-100 pointer-events-none' : 'bg-white pointer-events-auto',
        ]"
        :autocomplete="autocomplete"
        :required="required"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="handleBlur(($event.target as HTMLInputElement).value)"
        @input="handleInput(($event.target as HTMLInputElement).value)">
      <div class="absolute inset-y-0 flex items-center peer-disabled:opacity-50 peer-disabled:pointer-events-none pointer-events-none ps-4 start-0">
        <slot name="prepend" />
      </div>
    </div>
    <p
      class="mt-1 text-danger text-sm"
      v-if="hasError">
      {{ error }}
    </p>
  </div>
</template>
