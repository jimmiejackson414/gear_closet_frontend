<script lang='ts' setup>
  import { ButtonRoot } from '@/components/ui/button';
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { cn } from '@/lib/utils';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    disabled?: boolean;
    loading?: boolean;
    options: SelectOption[];
    modelValue: string;
    placeholder?: string;
  }

  const emit = defineEmits(['update:modelValue', 'update:searchTerm']);
  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
    placeholder: 'Select an option',
  });

  const open = ref(false);
  const value = ref(props.modelValue);

  const selectedLabel = computed(() => {
    const selectedOption = props.options.find(option => option.value === value.value);
    return selectedOption ? selectedOption.label : props.placeholder;
  });

  const selectOption = (optionValue: string) => {
    value.value = optionValue;
    emit('update:modelValue', optionValue);
    open.value = false;
  };
</script>

<template>
  <popover v-model:open="open">
    <popover-trigger as-child>
      <button-root
        :aria-expanded="open"
        class="justify-between w-full"
        :disabled="disabled"
        role="combobox"
        variant="outline">
        {{ selectedLabel }}
        <spinner-icon
          v-if="loading"
          class="animate-spin h-4 mr-2 w-4" />
        <icon-chevrons-up-down
          v-else
          :class="cn('h-4 ml-2 opacity-50 transform', open ? 'rotate-180' : 'rotate-0')" />
      </button-root>
    </popover-trigger>
    <popover-content class="p-0 w-[--reka-popover-trigger-width]">
      <command :ignore-filter="true">
        <command-input
          class="h-9"
          placeholder="Search..."
          @update:model-value="emit('update:searchTerm', $event)" />
        <command-empty>No options found.</command-empty>
        <command-list>
          <command-group>
            <command-item
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="() => selectOption(option.value as string)">
              <slot
                name="option"
                :option="option">
                {{ option.label }}
              </slot>
              <icon-check :class="cn('ml-auto h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')" />
            </command-item>
          </command-group>
        </command-list>
      </command>
    </popover-content>
  </popover>
</template>
