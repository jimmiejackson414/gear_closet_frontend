<script lang="ts" setup>
  import type { InputRoot } from '@/components/ui/input';
  import { cn } from '@/lib/utils';

  interface Props {
    name: string;
    placeholder?: string;
    hideEditBtn?: boolean;
    disabled?: boolean;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
    inputClasses?: string;
    spanClasses?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    hideEditBtn: false,
    disabled: false,
    type: 'text',
    size: 'md',
    inputClasses: 'w-full',
    spanClasses: undefined,
  });

  const modelValue = defineModel<string | number | null>({
    required: false,
    default: null,
  });

  const isEditing = ref(false);
  const localModel = ref<string | number | null>(modelValue.value);

  watch(
    () => modelValue,
    (newVal) => {
      if (!isEditing.value) {
        localModel.value = newVal.value;
      }
    },
  );

  const inlineEditRef = ref<InstanceType<typeof InputRoot> | null>(null);

  const toggleEditing = () => {
    if (props.disabled) return;
    isEditing.value = !isEditing.value;
    nextTick(() => {
      inlineEditRef.value?.focusInput();
    });
  };

  const saveChanges = debounce(() => {
    if (localModel.value !== modelValue.value) {
      modelValue.value = localModel.value;
    }
    setTimeout(() => {
      isEditing.value = false;
    }, 10);
  }, 200);

  const cancelEditing = () => {
    isEditing.value = false;
    localModel.value = modelValue.value; // Revert to the original value.
  };
</script>

<template>
  <div
    class="relative grid grid-cols-[auto] h-full"
    :class="inputClasses">
    <!-- Display Mode -->
    <span
      v-if="!isEditing"
      class="group flex items-center py-1.5 transition-all duration-100 ease-out"
      :class="cn(spanClasses, [
        'border border-transparent min-h-8.5 rounded-lg px-1 -ml-1',
        props.disabled ? '' : 'cursor-pointer hover:border-gray-300',
      ])"
      @click="toggleEditing">
      <slot />
      <icon-pencil
        v-if="!hideEditBtn && !props.disabled"
        class="opacity-0 group-hover:opacity-100 ml-4 w-4 h-4 text-muted-foreground hover:text-primary transition cursor-pointer" />
    </span>

    <!-- Edit Mode -->
    <input-root
      v-else
      ref="inlineEditRef"
      v-model="localModel"
      :class="inputClasses"
      dense
      :name="name"
      :placeholder="placeholder"
      @blur="saveChanges"
      @keydown.enter="saveChanges"
      @keydown.escape="cancelEditing" />
  </div>
</template>