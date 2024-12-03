<script setup lang="ts">
  import { CheckIcon, ChevronDown, XIcon } from 'lucide-vue-next';
  import { computed, ref, watch } from 'vue';
  import {
    Badge,
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui';
  interface Option {
    label: string
    value: string
  }
  interface Props {
    options: Option[]
    placeholder?: string
    maxCount?: number
    modelValue: string[]
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:modelValue', newValues: string[]): void
  }>();
  const placeholder = props.placeholder ?? 'Select options';
  const maxCount = props.maxCount ?? 3;
  const selectedValues = ref<string[]>(props.modelValue);
  const isPopoverOpen = ref(false);
  const search = ref('');
  watch(selectedValues, newValues => {
    emit('update:modelValue', newValues);
  });
  const togglePopover = () => {
    isPopoverOpen.value = !isPopoverOpen.value;
  };
  const toggleOption = (value: string) => {
    if (selectedValues.value.includes(value)) {
      selectedValues.value = selectedValues.value.filter(val => val !== value);
    } else {
      selectedValues.value.push(value);
    }
  };
  const removeOption = (value: string) => {
    selectedValues.value = selectedValues.value.filter(val => val !== value);
  };
  const getOptionLabel = (value: string): string => {
    const option = props.options.find(opt => opt.value === value);
    return option ? option.label : '';
  };
  const filteredOptions = computed(() => {
    if (!search.value) return props.options;
    return props.options.filter(option =>
      option.label.toLowerCase()
        .includes(search.value.toLowerCase()),
    );
  });
  const visibleSelectedValues = computed(() => {
    return selectedValues.value.slice(0, maxCount);
  });
  const remainingCount = computed(() => {
    return selectedValues.value.length - maxCount;
  });
</script>

<template>
  <div class="relative">
    <popover v-model="isPopoverOpen">
      <popover-trigger
        as="div"
        class="flex w-full">
        <button
          class="bg-inherit hover:bg-inherit border flex justify-between items-center p-2 rounded-lg w-full"
          variant="multiSelect"
          @click="togglePopover">
          <div
            v-if="selectedValues.length > 0"
            class="flex items-center flex-wrap gap-2">
            <badge
              v-for="(value, index) in visibleSelectedValues"
              :key="index"
              class="bg-primary text-white"
              @click.stop="removeOption(value)">
              {{ getOptionLabel(value) }}
              <x-icon class="cursor-pointer h-4 ml-2 w-4" />
            </badge>
            <span
              v-if="remainingCount > 0"
              class="text-muted-foreground text-sm">
              +{{ remainingCount }} more
            </span>
          </div>
          <div
            v-else
            class="text-muted-foreground">
            {{ placeholder }}
          </div>
          <chevron-down class="h-4 ml-2 opacity-50 text-muted-foreground" />
        </button>
      </popover-trigger>
      <popover-content>
        <command>
          <command-input
            v-model="search"
            placeholder="Search..." />
          <command-list>
            <command-empty>No results found.</command-empty>
            <command-group>
              <command-item
                v-for="option in filteredOptions"
                :key="option.value"
                :value="option.value"
                @click="toggleOption(option.value)">
                <div class="flex items-center mr-2">
                  <check-icon
                    v-if="selectedValues.includes(option.value)"
                    class="h-4 w-4" />
                </div>
                {{ option.label }}
              </command-item>
            </command-group>
          </command-list>
        </command>
      </popover-content>
    </popover>
  </div>
</template>