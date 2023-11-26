<script lang='ts' setup>
  import type { Icon } from 'lucide-vue-next';

  interface Props {
    autocomplete?: string;
    disabled?: boolean;
    error?: string;
    modelValue: string | null;
    prependIcon?: Icon;
    passwordToggle?: boolean;
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
    prependIcon: undefined,
    required: false,
    type: 'text',
  });

  const showPassword = ref(false);
  const computedType = computed(() => {
    return showPassword.value ? 'text' : props.type;
  });

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

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
</script>

<template>
  <div>
    <div class="relative">
      <div class="absolute inset-y-0 flex items-center pointer-events-none ps-3.5 start-0">
        <component
          :is="prependIcon"
          class="h-5 text-grey w-5" />
      </div>
      <input
        :autocomplete="autocomplete"
        class="bg-white block border focus:border-primary p-2.5 rounded-lg text-dark-grey text-sm w-full focus:ring-primary"
        :class="[
          Boolean(prependIcon) ? 'ps-11' : '',
          hasError ? 'border-danger' : 'border-gray-300',
          disabled ? 'bg-gray-100 pointer-events-none' : 'bg-white pointer-events-auto',
        ]"
        :disabled="disabled"
        :model-value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :type="computedType"
        @blur="handleBlur(($event.target as HTMLInputElement).value)"
        @input="handleInput(($event.target as HTMLInputElement).value)">
      <button
        v-if="passwordToggle"
        class="absolute top-0 end-0 p-3.5 rounded-e-md"
        type="button"
        @click="togglePasswordVisibility">
        <svg
          class="flex-shrink-0 h-3.5 text-gray-400 w-3.5"
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24">
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
    </div>
    <p
      v-if="hasError"
      class="mt-1 text-danger text-sm">
      {{ error }}
    </p>
  </div>
</template>
