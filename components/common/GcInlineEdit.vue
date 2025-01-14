<script lang="ts" setup>
  import { nextTick, ref, watch } from 'vue';
  import type { InputRoot } from '@/components/ui/input';
  import { cn } from '@/lib/utils';

  interface Props {
    name: string;
    placeholder?: string;
    hideEditBtn?: boolean;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
    inputClasses?: string;
    spanClasses?: string;
  }

  withDefaults(defineProps<Props>(), {
    placeholder: '',
    hideEditBtn: false,
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
    class="grid grid-cols-[auto] h-full relative"
    :class="inputClasses">
    <!-- Display Mode -->
    <span
      v-if="!isEditing"
      class="cursor-pointer duration-100 ease-snap flex items-center group py-1.5 transition-all"
      :class="cn(spanClasses, [ 'border border-transparent hover:border-gray-300 min-h-[34px] rounded-lg px-1 -ml-1' ])"
      @click="toggleEditing">
      <slot />
      <icon-pencil
        v-if="!hideEditBtn"
        class="cursor-pointer group-hover:opacity-100 h-4 ml-4 opacity-0 text-grey hover:text-primary transition w-4" />
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