<script lang='ts' setup>
  interface Props {
    helpText?: string;
    label?: string;
  }
  
  withDefaults(defineProps<Props>(), {
    helpText: undefined,
    label: undefined,
  });

  const emits = defineEmits(['update:modelValue']);
  const fileInput = ref<HTMLInputElement | null>(null);
  const file = reactive({ name: 'No file chosen' });

  const handleFileChange = () => {
    if (fileInput.value?.files?.length) {
      const selectedFile = fileInput.value.files[0];
      file.name = selectedFile.name;
      emits('update:modelValue', selectedFile);
    }
  };
</script>

<template>
  <div class="flex flex-col">
    <!-- Label above input -->
    <label
      v-if="$slots.label"
      class="font-bold mb-2 text-grey text-sm"
      for="file_input">
      <slot name="label" />
    </label>
    <label
      v-else-if="label"
      class="font-bold mb-2 text-grey text-sm"
      for="file_input">
      {{ label }}
    </label>

    <!-- Hidden input and custom input -->
    <input
      id="file_input"
      ref="fileInput"
      accept=".csv"
      class="hidden"
      type="file"
      @change="handleFileChange">
    <div class="flex items-center">
      <label
        class="bg-gray-100 hover:bg-gray-200 border-gray-300 border-l border-y cursor-pointer ease-snap px-4 py-2.5 rounded-l-lg rounded-y text-dark-grey transition whitespace-nowrap"
        for="file_input">
        Choose File
      </label>
      <label
        class="bg-transparent block border border-gray-300 cursor-pointer p-2.5 rounded-e-lg text-base placeholder:text-gray-400 w-full focus:outline-none"
        :class="file ? 'text-dark-grey' : 'text-gray-400'"
        for="file_input">
        {{ file.name !== 'No file chosen' ? file.name : 'Choose File' }}
      </label>
    </div>

    <!-- Helper text -->
    <p
      v-if="$slots['help-text']"
      id="file_input_help"
      class="mt-1 text-gray-500 text-sm">
      <slot name="help-text" />
    </p>
    <p
      v-if="helpText"
      id="file_input_help"
      class="mt-1 text-gray-500 text-sm">
      {{ helpText }}
    </p>
  </div>
</template>
