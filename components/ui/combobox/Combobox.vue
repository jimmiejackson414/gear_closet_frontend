<script lang='ts' setup>
  import { Button as PopoverButton } from '@/components/ui/button';
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { cn } from '@/lib/utils';
  // import { IconChevronsUpDown } from '#build/components';

  type Option = { label: string; value: string; };
  interface Props {
    options: Option[];
    modelValue: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:modelValue']);

  const open = ref(false);
  const value = ref(props.modelValue);

  const selectedLabel = computed(() => {
    const selectedOption = props.options.find(option => option.value === value.value);
    return selectedOption ? selectedOption.label : 'Select an option';
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
      <popover-button
        :aria-expanded="open"
        class="justify-between w-full"
        role="combobox"
        variant="outline">
        {{ selectedLabel }}
        <icon-caret-sort class="h-4 ml-2 opacity-50 shrink-0 w-4" />
      </popover-button>
    </popover-trigger>
    <popover-content class="p-0 w-full">
      <command>
        <command-input
          class="h-9"
          placeholder="Search..." />
        <command-empty>No options found.</command-empty>
        <command-list>
          <command-group>
            <command-item
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="() => selectOption(option.value)">
              {{ option.label }}
              <icon-check :class="cn('ml-auto h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')" />
            </command-item>
          </command-group>
        </command-list>
      </command>
    </popover-content>
  </popover>
</template>
