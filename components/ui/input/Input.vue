<script setup lang="ts">
  import { useVModel } from '@vueuse/core';
  import type { HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number | null;
    class?: HTMLAttributes['class'];
    passwordToggle?: boolean;
    prependIcon?: any;
    type?: string;
    dense?: boolean;
  }>();

  const showPassword = ref(false);

  const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });

  const attrs = useAttrs();
  const computedClasses = computed(() => {
    const baseClasses = 'flex w-full rounded-md border bg-transparent dark:bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const heightClass = props.dense ? 'h-8 py-1' : 'h-10 py-2'; // Adjust height and padding for dense variant
    const borderClass = attrs['aria-invalid'] ? 'border-destructive' : 'border-input';
    const prependIconClass = props.prependIcon ? 'ps-9' : '';
    const passwordToggleClass = props.passwordToggle ? 'pr-9' : '';

    return cn(baseClasses, heightClass, borderClass, prependIconClass, passwordToggleClass, props.class);
  });

  const computedType = computed(() => showPassword.value ? 'text' : props.type);

  const inputRef = ref<HTMLInputElement | null>(null);
  const focusInput = () => {
    inputRef.value?.focus();
  };

  defineExpose({ focusInput });
</script>

<template>
  <div class="items-center relative w-full">
    <component
      :is="prependIcon"
      class="-translate-y-1/2 absolute top-1/2 left-2.5 h-5 inline-block pointer-events-none text-base text-grey w-5" />
    <input
      v-bind="$attrs"
      ref="inputRef"
      v-model="modelValue"
      :class="computedClasses"
      :type="computedType">
    <button
      v-if="passwordToggle"
      class="absolute bottom-0.5 end-0 px-2 py-2 rounded-e-md"
      type="button"
      @click="showPassword = !showPassword">
      <icon-eye
        v-if="!showPassword"
        class="h-6 text-gray-400 w-5" />
      <icon-eye-off
        v-if="showPassword"
        class="h-6 text-gray-400 w-5" />
    </button>
  </div>
</template>
