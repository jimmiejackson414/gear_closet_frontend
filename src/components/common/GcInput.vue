<script lang='ts' setup>
  interface Props {
    autocomplete?: string;
    disabled?: boolean;
    error?: string;
    label: string;
    modelValue: string | null;
    passwordToggle: boolean;
    placeholder?: string;
    required?: boolean;
    type?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    autocomplete: 'off',
    disabled: false,
    error: undefined,
    label: '',
    modelValue: null,
    passwordToggle: false,
    placeholder: undefined,
    required: false,
    type: 'text',
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
        id="hs-toggle-password"
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
      <button
        v-if="passwordToggle"
        type="button"
        data-hs-toggle-password='{
        "target": "#hs-toggle-password"
      }'
        class="absolute top-0 end-0 p-3.5 rounded-e-md">
        <svg
          class="flex-shrink-0 h-3.5 text-gray-400 w-3.5"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path
            class="hs-password-active:hidden"
            d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path
            class="hs-password-active:hidden"
            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path
            class="hs-password-active:hidden"
            d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line
            class="hs-password-active:hidden"
            x1="2"
            x2="22"
            y1="2"
            y2="22" />
          <path
            class="hidden hs-password-active:block"
            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle
            class="hidden hs-password-active:block"
            cx="12"
            cy="12"
            r="3" />
        </svg>
      </button>
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
