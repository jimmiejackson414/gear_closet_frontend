<script setup lang="ts">
  import {
    ComboboxAnchor,
    ComboboxContent,
    ComboboxInput,
    ComboboxPortal,
    ComboboxRoot,
  } from 'reka-ui';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Begin searching...',
    disabled: false,
    loading: false,
  });
  const emit = defineEmits<{
    (e: 'search', query: string): void;
    (e: 'select', options: SelectOption[]): void;
  }>();

  const modelValue = ref<SelectOption[]>([]);
  const open = ref(false);
  const searchTerm = ref('');
  const isDisabled = computed(() => props.loading || props.disabled || false);

  // Debounced search emit
  const debouncedSearch = debounce(() => {
    emit('search', searchTerm.value);
  }, 500);

  watch(searchTerm, () => {
    debouncedSearch();
  });

  // Add selected option to `modelValue`
  const inputRef = ref<HTMLElement | undefined>(undefined);
  const handleSelect = (option: SelectOption) => {
    if (!modelValue.value.some((item) => item.value === option.value)) {
      modelValue.value.push(option);
      emit('select', modelValue.value);
    }

    // Close dropdown if no options are available
    if (props.options.length === 0) {
      open.value = false;
    }
  };

  // Remove selected option from `modelValue`
  const removeOption = (option: SelectOption) => {
    modelValue.value = modelValue.value.filter((item) => item.value !== option.value);
  };
</script>

<template>
  <tags-input
    class="cursor-pointer gap-0 px-0 relative w-80"
    :model-value="modelValue">
    <!-- Render selected tags -->
    <div class="flex items-center flex-wrap gap-2 px-3">
      <tags-input-item
        v-for="item in modelValue"
        :key="item.value"
        :value="item.label">
        <tags-input-item-text>
          {{ item.label }}
        </tags-input-item-text>
        <tags-input-item-delete @click="removeOption(item)" />
      </tags-input-item>
    </div>

    <combobox-root
      v-model:open="open"
      class="w-full"
      :model-value="modelValue">
      <!-- Input Box -->
      <combobox-anchor as-child>
        <combobox-input
          v-model="searchTerm"
          as-child>
          <div class="flex items-center pl-8 relative">
            <!-- Icon Slot -->
            <div
              class="absolute left-0 inset-y-0 flex items-center pl-3"
              :class="modelValue.length > 0 ? 'mt-2' : ''">
              <slot name="icon">
                <icon-search class="h-4 text-gray-400 w-4" />
              </slot>
            </div>
            <tags-input-input
              ref="inputRef"
              autofocus
              class="px-3 w-full"
              :class="modelValue.length > 0 ? 'mt-2' : ''"
              :disabled="isDisabled"
              :placeholder="placeholder"
              @keydown.enter.prevent />
            <!-- Loading Spinner -->
            <spinner-icon
              v-if="loading"
              class="absolute right-0 inset-y-0 animate-spin flex items-center h-4 mr-2 pr-3 w-4" />
          </div>
        </combobox-input>
      </combobox-anchor>

      <!-- Dropdown -->
      <combobox-portal>
        <combobox-content>
          <command-list
            class="bg-popover border data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 mt-2 outline-none rounded-md shadow-md text-popover-foreground w-[--reka-popper-anchor-width] z-[100]"
            position="popper">
            <command-empty v-if="!options.length">
              No options available
            </command-empty>
            <command-group v-else>
              <command-item
                v-for="option in options"
                :key="option.value"
                :value="option"
                @select.prevent="handleSelect(option)">
                <slot
                  name="option"
                  :option="option">
                  {{ option.label }}
                </slot>
              </command-item>
            </command-group>
          </command-list>
        </combobox-content>
      </combobox-portal>
    </combobox-root>
  </tags-input>
</template>
