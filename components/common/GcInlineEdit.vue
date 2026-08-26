<script lang="ts" setup>
  import { cn } from '@/lib/utils';
  import type { InputRoot } from '@/components/ui/input';

  interface Props {
    name: string;
    placeholder?: string;
    hideEditBtn?: boolean;
    disabled?: boolean;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
    inputClasses?: string;
    spanClasses?: string;
    startEditing?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    hideEditBtn: false,
    inputClasses: 'w-full',
    placeholder: '',
    size: 'md',
    spanClasses: undefined,
    startEditing: false,
    type: 'text',
  });

  const modelValue = defineModel<string | number | null>({
    default: null,
    required: false,
  });

  const isEditing = ref(props.startEditing && !props.disabled);
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

  const focusInput = () => {
    nextTick(() => {
      inlineEditRef.value?.focusInput();
    });
  };

  onMounted(() => {
    if (isEditing.value) focusInput();
  });

  watch(
    () => props.startEditing,
    (shouldEdit) => {
      if (shouldEdit && !props.disabled && !isEditing.value) {
        isEditing.value = true;
        focusInput();
      }
    },
  );

  const hasDisplayValue = computed(() => {
    const value = modelValue.value;
    if (value == null) return false;
    if (typeof value === 'string') return value.length > 0;
    return true;
  });

  const toggleEditing = () => {
    if (props.disabled) return;
    isEditing.value = !isEditing.value;
    if (isEditing.value) focusInput();
  };

  const saveChanges = useDebounceFn(() => {
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
      <slot v-if="hasDisplayValue" />
      <span
        v-else-if="placeholder"
        class="text-gray-400">
        {{ placeholder }}
      </span>
      <icon-pencil
        v-if="!hideEditBtn && !props.disabled"
        class="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ml-4 w-4 h-4 text-muted-foreground hover:text-primary transition cursor-pointer" />
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