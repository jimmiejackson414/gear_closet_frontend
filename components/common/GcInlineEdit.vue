<script lang='ts' setup>
  import type { InputRoot } from '@/components/ui/input';

  interface Props {
    modelValue?: string | number | null;
    name: string;
    placeholder?: string;
    hideEditBtn?: boolean;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
    inputClasses?: string;
    spanClasses?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placeholder: '',
    hideEditBtn: false,
    type: 'text',
    size: 'md',
    inputClasses: 'w-fit',
    spanClasses: undefined,
  });

  const emits = defineEmits(['handleUpdate']);

  const isEditing = ref(false);
  const localModel = ref<string | number | undefined | null>(undefined);
  const inlineEditRef = ref<InstanceType<typeof InputRoot> | null>(null);

  const toggleEditing = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
      nextTick(() => inlineEditRef.value?.focusInput());
    }
  };

  const handleEmit = () => {
    isEditing.value = false;
    // only emit if the value has changed
    if (localModel.value !== props.modelValue) {
      emits('handleUpdate', localModel.value);
    }
  };

  const handleEscape = () => {
    isEditing.value = false;
    localModel.value = props.modelValue;
  };

  watch(() => props.modelValue, (val) => {
    localModel.value = val;
  }, { immediate: true });

  onClickOutside(inlineEditRef as unknown as HTMLElement, () => isEditing.value = false);
</script>

<template>
  <div
    class="grid grid-cols-[auto] h-full relative"
    :class="inputClasses">
    <span
      v-show="!isEditing"
      class="cursor-pointer duration-100 ease-snap flex items-center group py-1.5 transition-all"
      :class="[ spanClasses, { 'border border-transparent hover:border-gray-300 min-h-[34px] rounded-lg': !modelValue } ]"
      @click="toggleEditing"
      @keydown="toggleEditing"
      @trigger="toggleEditing">
      <slot />
      <icon-pencil
        v-if="!hideEditBtn"
        class="cursor-pointer duration-100 ease-snap group-hover:opacity-100 h-4 ml-4 opacity-0 text-grey hover:text-primary transition w-4" />
    </span>
    <input-root
      v-show="isEditing"
      ref="inlineEditRef"
      v-model="localModel"
      :class="inputClasses"
      dense
      :name="name"
      :placeholder="placeholder"
      @blur="handleEmit"
      @keydown.enter="handleEmit"
      @keydown.escape="handleEscape" />
  </div>
</template>
