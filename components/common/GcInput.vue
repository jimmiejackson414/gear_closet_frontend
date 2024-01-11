<script lang='ts' setup>
  import type { Icon } from 'lucide-vue-next';

  interface Props {
    autocomplete?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    modelValue: string | number | null;
    name: string;
    passwordToggle?: boolean;
    prependIcon?: Icon;
    required?: boolean;
    type?: string;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    autocomplete: 'off',
    disabled: false,
    error: undefined,
    label: '',
    modelValue: null,
    name: '',
    passwordToggle: false,
    prependIcon: undefined,
    placeholder: undefined,
    required: false,
    type: 'text',
    size: 'md',
  });

  const inputRef = ref<HTMLInputElement | null>(null);
  const showPassword = ref(false);

  const emit = defineEmits(['update:model-value', 'blur', 'enter']);

  const focusInput = () => {
    inputRef.value?.focus();
  };

  defineExpose({ focusInput });

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const handleInput = (val: string) => {
    emit('update:model-value', val || undefined);
  };

  const enterKeyPressed = ref(false);
  const handleBlur = () => {
    nextTick(() => {
      if (!enterKeyPressed.value) {
        emit('blur', props.modelValue || undefined);
      }
      enterKeyPressed.value = false;
    });
  };

  const handleEnter = () => {
    enterKeyPressed.value = true;
    emit('enter', props.modelValue || undefined);
  };

  const computedType = computed(() => {
    return showPassword.value ? 'text' : props.type;
  });

  const hasError = computed(() => !!props.error );

  const computedClasses = computed(() => {
    const classes = [];

    // determine padding based on size prop
    if (props.size === 'sm') { classes.push('p-2 text-xs'); }
    else if (props.size === 'md') { classes.push('p-2.5 text-sm'); }
    else if (props.size === 'lg') { classes.push('p-4 sm:text-md'); }

    // determine properties based on disabled prop and error state
    hasError.value ? classes.push('border-danger') : classes.push('border-gray-300');
    props.disabled ? classes.push('bg-gray-100 pointer-events-none') : classes.push('bg-white pointer-events-auto');

    // override padding based on prependIcon prop
    if (props.prependIcon) { classes.push('ps-11'); }

    return classes;
  });
</script>

<template>
  <div class="w-fit">
    <div class="relative">
      <div class="absolute inset-y-0 flex items-center pointer-events-none ps-3.5 start-0">
        <component
          :is="prependIcon"
          class="h-5 text-grey w-5" />
      </div>
      <input
        :id="name"
        ref="inputRef"
        :autocomplete="autocomplete"
        class="appearance-none bg-transparent block border-1 focus:border-primary border-gray-300 peer rounded-lg text-dark-grey placeholder:text-grey-200 w-full focus:outline-none focus:ring-0"
        :class="computedClasses"
        :disabled="disabled"
        :placeholder="placeholder"
        :required="required"
        :type="computedType"
        :value="modelValue"
        @blur="handleBlur"
        @input="handleInput(($event.target as HTMLInputElement).value)"
        @keydown.enter.prevent="handleEnter">
      <label
        class="-translate-y-4 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 absolute top-2 bg-white duration-300 origin-[0] peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:scale-75 peer-focus:text-primary peer-focus:top-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 px-2 scale-75 start-1 text-gray-500 text-sm transform z-10"
        :for="name">
        {{ label }}
      </label>
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
