<script lang='ts' setup>
  import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';
  import { Label as UiLabel } from '../ui';
  // import type { Icon } from 'lucide-vue-next';
  import { cn } from '@/lib/utils';

  interface Props {
    autocomplete?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    modelValue?: string | number | null;
    name: string;
    passwordToggle?: boolean;
    // prependIcon?: Icon;
    required?: boolean;
    type?: string;
    placeholder?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    autocomplete: 'off',
    disabled: false,
    error: undefined,
    label: '',
    modelValue: undefined,
    name: '',
    passwordToggle: false,
    // prependIcon: undefined,
    placeholder: undefined,
    required: false,
    type: 'text',
  });

  const inputRef = ref<HTMLInputElement | null>(null);

  const emit = defineEmits(['update:model-value', 'blur', 'enter']);

  const focusInput = () => {
    inputRef.value?.focus();
  };

  defineExpose({ focusInput });

  const showPassword = ref(false);
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

  const computedType = computed(() => showPassword.value ? 'text' : props.type);

  const hasError = computed(() => !!props.error );

  const computedClasses = computed(() => {
    const classes = [];

    // determine padding based on size prop
    // if (props.size === 'sm') { classes.push('p-2 text-base h-8'); }
    // else if (props.size === 'md') { classes.push('p-2.5 text-base h-10'); }
    // else if (props.size === 'lg') { classes.push('p-4 sm:text-md h-12'); }

    // determine properties based on disabled prop and error state
    if (hasError.value) { classes.push('border-danger'); }
    // hasError.value ? classes.push('!border-danger') : classes.push('border-gray-300');
    props.disabled ? classes.push('bg-gray-100 pointer-events-none text-gray-400') : classes.push('bg-white pointer-events-auto text-dark-grey');

    // override padding based on prependIcon prop
    // if (props.prependIcon) { classes.push('ps-9'); }

    return classes;
  });
</script>

<template>
  <div class="w-fit">
    <div class="flex flex-col gap-2 relative">
      <!-- <label
        v-if="label"
        class="font-bold text-grey text-sm"
        :for="name">
        {{ label }}
      </label> -->
      <ui-label
        v-if="label"
        :for="name">
        {{ label }}
      </ui-label>
      <div class="relative">
        <!-- <component
          :is="prependIcon"
          class="-translate-y-1/2 absolute top-1/2 left-2.5 h-5 inline-block pointer-events-none text-base text-grey w-5" /> -->
        <input
          :id="name"
          ref="inputRef"
          :autocomplete="autocomplete"
          class="appearance-none bg-transparent block border-1 focus:border-primary peer py-2.5 rounded-lg w-full focus:outline-none focus:ring-0 placeholder:!text-gray-400"
          :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', computedClasses)"
          data-testid="gc-input"
          :disabled="disabled"
          :placeholder="placeholder"
          :required="required"
          :type="computedType"
          :value="modelValue"
          @blur="handleBlur"
          @input="handleInput(($event.target as HTMLInputElement).value)"
          @keydown.enter.prevent="handleEnter">
      </div>
      <button
        v-if="passwordToggle"
        class="absolute bottom-0.5 end-0 px-3.5 py-2.5 rounded-e-md"
        type="button"
        @click="togglePasswordVisibility">
        <eye-icon
          v-if="!showPassword"
          class="h-6 text-gray-400 w-5" />
        <eye-off-icon
          v-if="showPassword"
          class="h-6 text-gray-400 w-5" />
      </button>
    </div>
    <p
      v-if="hasError"
      class="mt-1 text-danger text-sm">
      {{ error }}
    </p>
  </div>
</template>
