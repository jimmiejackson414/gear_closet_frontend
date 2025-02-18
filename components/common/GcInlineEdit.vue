<script lang="ts" setup>
  import { nextTick, ref, watch } from 'vue';
  import { cn } from '@/lib/utils';
  import type { InputRoot } from '@/components/ui';

  interface Props {
    hideEditBtn?: boolean;
    inputClasses?: string;
    name: string;
    placeholder?: string;
    size?: 'lg' | 'md' | 'sm';
    spanClasses?: string;
    type?: string;
  }

  withDefaults(defineProps<Props>(), {
    hideEditBtn: false,
    inputClasses: 'w-full',
    placeholder: '',
    size: 'md',
    spanClasses: undefined,
    type: 'text',
  });

  const modelValue = defineModel<number | string | null>({
    default: null,
    required: false,
  });

  const isEditing = ref(false);
  const localModel = ref<number | string | null>(modelValue.value);

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
    class="relative grid h-full grid-cols-[auto]"
    :class="inputClasses">
    <!-- Display Mode -->
    <span
      v-if="!isEditing"
      class="group flex cursor-pointer items-center py-1.5 transition-all duration-100 ease-in-out"
      :class="cn(spanClasses, [ 'border border-transparent hover:border-gray-300 min-h-[34px] rounded-lg px-1 -ml-1' ])"
      @click="toggleEditing">
      <slot />
      <icon-pencil
        v-if="!hideEditBtn"
        class="ml-4 size-4 cursor-pointer text-muted-foreground opacity-0 transition hover:text-primary group-hover:opacity-100" />
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