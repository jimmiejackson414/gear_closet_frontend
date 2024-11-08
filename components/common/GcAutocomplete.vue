<script lang='ts' setup>
  import { XIcon } from 'lucide-vue-next';
  import type { SelectOption } from '@/types/helpers';
  // import type { Icon } from 'lucide-vue-next';

  export interface Props {
    disabled?: boolean;
    loading?: boolean;
    nullable?: boolean;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    options: SelectOption[];
    // prependIcon?: Icon;
    required?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
    modelValue: null,
    nullable: true,
    size: 'md',
    placeholder: 'Select an option',
    prependIcon: undefined,
    required: false,
  });

  const emit = defineEmits(['select', 'search']);
  const query = ref('');

  // watch query and emit value
  watch(query, (value) => {
    if (value) emit('search', query);
  });

  const computedClasses = computed(() => {
    const classes = [];

    // determine padding based on size prop
    if (props.size === 'sm') { classes.push('p-2 text-base h-8'); }
    else if (props.size === 'md') { classes.push('p-2.5 text-base h-10'); }
    else if (props.size === 'lg') { classes.push('p-4 sm:text-md h-12'); }

    if (props.prependIcon) { classes.push('ps-9'); }

    if (props.loading) { classes.push('pe-9'); }

    return classes;
  });
</script>

<template>
  <div class="flex items-center w-full">
    <div class="relative w-full">
      <label
        class="sr-only"
        for="simple-search">Search</label>
      <div class="relative">
        <!-- <div
          v-if="prependIcon"
          class="absolute inset-y-0 flex items-center pointer-events-none ps-3 start-0">
          <component
            :is="prependIcon"
            class="h-4 text-gray-500 w-4" />
        </div> -->
        <input
          id="simple-search"
          v-model="query"
          class="bg-white block border focus:border-primary border-gray-300 py-2.5 rounded-lg text-dark-grey w-full placeholder:!text-gray-400"
          :class="computedClasses"
          :placeholder="placeholder"
          :required="required"
          type="text">
        <div
          v-if="loading"
          class="-translate-y-1/2 absolute top-1/2 right-2 transform">
          <gc-spinner
            size="sm"
            variant="primary" />
        </div>
        <button
          v-else-if="query && nullable"
          class="-translate-y-1/2 absolute top-1/2 right-2 transform"
          @click="query = ''">
          <x-icon class="h-4 text-gray-500 w-4" />
        </button>
      </div>
      <fade-transition>
        <div
          v-show="query"
          class="absolute bg-white divide-gray-100 divide-y mt-2 rounded-lg shadow w-full z-10">
          <ul class="py-2 text-gray-700 text-sm">
            <li
              v-if="loading"
              class="p-2">
              Searching...
            </li>
            <li
              v-else-if="!options.length"
              class="p-2">
              No results found.
            </li>
            <li
              v-for="option in options"
              v-else
              :key="option.value"
              class="inline-flex px-4 py-2 w-full hover:bg-gray-100"
              @click="emit('select', option)">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </fade-transition>
    </div>
  </div>
</template>
