<script lang='ts' setup>
  import { PencilIcon } from 'lucide-vue-next';

  interface Props {
    modelValue?: string | number | null;
    name: string;
    placeholder?: string;
    hideEditBtn?: boolean;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placeholder: '',
    hideEditBtn: false,
    type: 'text',
    size: 'md',
  });

  const emits = defineEmits(['handleUpdate']);

  const isEditing = ref(false);
  const localModel = ref<string | number | null | undefined>(undefined);
  const inlineEditRef = ref<any>(null);

  const toggleEditing = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
      nextTick(() => inlineEditRef.value?.focusInput());
    }
  };

  const handleEmit = () => {
    isEditing.value = false;
    emits('handleUpdate', localModel.value);
  };

  const handleEscape = () => {
    isEditing.value = false;
    localModel.value = props.modelValue;
  };

  watch(() => props.modelValue, (val) => {
    localModel.value = val;
  }, { immediate: true });

  onClickOutside(inlineEditRef, () => isEditing.value = false);
</script>

<template>
  <div class="grid grid-cols-[auto] h-full relative w-fit">
    <span
      v-show="!isEditing"
      class="cursor-pointer duration-100 ease-snap flex items-center group px-1 py-1.5 transition"
      @click="toggleEditing"
      @keydown="toggleEditing"
      @trigger="toggleEditing">
      <slot />
      <pencil-icon
        v-if="!hideEditBtn"
        class="cursor-pointer duration-100 ease-snap group-hover:opacity-100 h-4 ml-4 opacity-0 text-grey hover:text-primary transition w-4" />
    </span>
    <gc-input
      v-show="isEditing"
      ref="inlineEditRef"
      v-model="localModel"
      :name="name"
      :placeholder="placeholder"
      :size="size"
      @blur="handleEmit"
      @enter="handleEmit"
      @keydown.escape="handleEscape" />
  </div>
</template>
