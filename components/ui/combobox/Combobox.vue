<script lang='ts' setup>
  import { ButtonRoot } from '@/components/ui/button';
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { cn } from '@/lib/utils';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    disabled?: boolean;
    loading?: boolean;
    modelValue: string;
    options: SelectOption[];
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
        class="w-full justify-between"
        :disabled="disabled"
        role="combobox"
        variant="outline">
        {{ selectedLabel }}
        <spinner-icon
          v-if="loading"
          class="mr-2 size-4 animate-spin" />
        <icon-chevrons-up-down
          v-else
          :class="cn('h-4 ml-2 opacity-50 transform', open ? 'rotate-180' : 'rotate-0')" />
      </button-root>
    </popover-trigger>
    <popover-content class="w-[--radix-popover-trigger-width] p-0">
      <command @update:search-term="emit('update:searchTerm', $event)">
        <command-input
          class="h-9"
          placeholder="Search..." />
        <command-empty>No options found.</command-empty>
        <command-list>
          <command-group>
            <command-item
              v-for="option in options"
              :key="option.value"
              :value="option.label"
              @select="() => selectOption(option.value as string)">
              <icon-check
                v-if="value === option.value"
                class="mr-2 size-4" />
              <slot
                name="option"
                :option="option">
                {{ option.label }}
              </slot>
            </command-item>
          </command-group>
        </command-list>
      </command>
    </popover-content>
  </popover>
</template>
