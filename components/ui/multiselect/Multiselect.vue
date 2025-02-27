<script setup lang="ts">
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from '@/components/ui/command';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';
  import { cn } from '@/lib/utils';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    disabled?: boolean;
    loading?: boolean;
    multiple?: boolean;
    options: SelectOption[];
    placeholder?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
    multiple: false,
    placeholder: 'Begin searching...',
  });

  const emit = defineEmits<{
    (e: 'clear-search'): void;
    (e: 'search', query: string): void;
    (e: 'select', options: SelectOption[]): void;
  }>();

  const searchTerm = ref('');
  const debouncedSearch = debounce((term: string) => {
    searchTerm.value = term;
    emit('search', searchTerm.value);
  }, 500);

  const open = ref(false);
  const selectedValues = ref<SelectOption[]>([]);

  // Filtered options: Search + Selected always on top
  const filteredOptions = computed(() => {
    const lowercasedSearch = searchTerm.value.toLowerCase();
    const selected = selectedValues.value;
    const filtered = props.options.filter(
      (option) =>
        !selected.some((selectedOption) => selectedOption.value === option.value) &&
        option.label.toLowerCase()
          .includes(lowercasedSearch),
    );
    return [...selected, ...filtered];
  });

  // Handle selection
  const toggleSelection = (option: SelectOption) => {
    if (props.multiple) {
      if (selectedValues.value.includes(option)) {
        selectedValues.value = selectedValues.value.filter((v) => v.value !== option.value);
      } else {
        selectedValues.value.push(option);
      }
    } else {
      selectedValues.value = selectedValues.value.includes(option) ? [] : [option];
      open.value = false;
    }
    emit('select', selectedValues.value);
  };

  const clearSearch = () => {
    searchTerm.value = '';
    emit('clear-search');
  };

  watch(searchTerm, (newSearch) => {
    if (!newSearch) emit('clear-search');
  });
</script>

<template>
  <popover v-model:open="open">
    <!-- Trigger -->
    <popover-trigger
      as-child
      class="flex items-center">
      <button-root
        :class="cn('flex items-center justify-between w-full px-3 py-2 rounded-md', {
          'text-muted-foreground': placeholder && selectedValues.length === 0,
        })"
        :disabled="disabled"
        role="combobox"
        variant="outline">
        {{ selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder }}
        <icon-chevrons-up-down class="ml-2 size-4 shrink-0 opacity-50" />
      </button-root>
    </popover-trigger>

    <!-- Popover Content -->
    <popover-content class="p-0">
      <command>
        <command-input
          class="h-9"
          :clearable="searchTerm.length > 0"
          placeholder="Search options..."
          @clear="clearSearch"
          @input="debouncedSearch($event.target.value)">
          <template #prepend-icon>
            <spinner-icon
              v-if="loading"
              class="mr-2 size-4 shrink-0 animate-spin" />
            <icon-search
              v-else
              class="mr-2 size-4 shrink-0 opacity-50" />
          </template>
        </command-input>
        <command-empty v-if="loading">
          Searching...
        </command-empty>
        <command-empty v-else-if="!searchTerm && !loading">
          No options available.
        </command-empty>
        <command-empty v-else-if="!options.length && searchTerm && !loading">
          Your search for {{ searchTerm }} returned no results.
        </command-empty>
        <command-list class="relative w-[--radix-popper-anchor-width] border bg-popover">
          <command-group>
            <command-item
              v-for="option in filteredOptions"
              :key="option!.value"
              :value="option!.value"
              @select="toggleSelection(option as SelectOption)">
              <icon-check
                :class="cn(
                  'mr-2 h-4 w-4',
                  selectedValues.includes(option as SelectOption) ? 'opacity-100' : 'opacity-0',
                )" />
              <slot
                name="option"
                :option="option">
                {{ option!.label }}
              </slot>
            </command-item>
          </command-group>
        </command-list>
      </command>
    </popover-content>
  </popover>
</template>