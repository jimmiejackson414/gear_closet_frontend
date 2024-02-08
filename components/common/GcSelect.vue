<script lang='ts' setup>
  import { ChevronDownIcon, XCircleIcon } from 'lucide-vue-next';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    clearable?: boolean;
    customClasses?: string;
    disabled?: boolean;
    error?: string | null;
    label?: string;
    loading?: boolean;
    modelValue?: string | string[] | number | null;
    options: SelectOption[] | Option[] | null;
    placeholder?: string,
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    clearable: false,
    customClasses: '',
    disabled: false,
    error: null,
    label: undefined,
    loading: false,
    modelValue: undefined,
    placeholder: 'Select an option',
    required: false,
    size: 'md',
  });

  const emit = defineEmits(['update:modelValue']);

  const displayPlaceholder = computed(() => !props.modelValue);
  const selectedOption = computed(() => {
    return props.options?.find(option => option.value === props.modelValue)?.label;
  });

  const computedClasses = computed(() => {
    const classes = [];

    // determine padding based on size prop
    if (props.size === 'sm') { classes.push('p-2 text-base'); }
    else if (props.size === 'md') { classes.push('p-2.5 text-base'); }
    else if (props.size === 'lg') { classes.push('p-4 sm:text-md'); }

    return classes;
  });
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      class="font-bold text-grey text-sm">
      {{ label }}
    </label>
    <headless-listbox
      v-slot="{ open }"
      as="div"
      class="relative"
      :disabled="disabled || loading"
      :model-value="modelValue"
      :multiple="false"
      @update:model-value="(value: any) => emit('update:modelValue', value)">
      <headless-listbox-button
        class="appearance-none bg-white border focus:border-primary border-1 border-gray-300 flex items-center gap-3 peer rounded-lg text-dark-grey w-full focus:outline-none focus:ring-0"
        :class="[
          computedClasses,
          ( disabled || loading ) ? 'border-grey cursor-auto' : 'border-gray-300 cursor-pointer', customClasses,
          { 'border-danger !bg-danger-light' : required && !!error },
        ]">
        <p
          v-if="displayPlaceholder"
          :class="( disabled || loading ) ? 'text-gray-200' : 'text-gray-400'">
          {{ placeholder }}
        </p>
        <template v-else-if="$slots.selected">
          <slot
            name="selected"
            :selected-option="selectedOption" />
        </template>
        <p
          v-else
          class="text-base"
          :class="( disabled || loading ) ? 'text-dark-grey' : 'text-dark-grey'">
          {{ selectedOption }}
        </p>
        <div
          class="flex ml-auto"
          :class="{ 'pointer-events-none': ( disabled || loading ) }">
          <x-circle-icon
            v-show="clearable && modelValue && !loading"
            class="cursor-pointer h-[22px] mr-2 text-gray-400 w-[22px]"
            :class="disabled ? 'text-grey' : 'text-gray-400'"
            @click="emit('update:modelValue', undefined)" />
          <gc-spinner
            v-show="loading"
            class="h-[22px] mr-2 w-[22px]"
            color="primary" />
          <chevron-down-icon
            class="duration-150 ease-in-out font-bold h-[22px] transition-transform"
            :class="[ open ? 'rotate-180' : 'rotate-0', ( disabled || loading ) ? 'text-dark-grey' : 'text-light-primary' ]" />
        </div>
      </headless-listbox-button>
      <zoom-transition>
        <headless-listbox-options class="absolute top-[50px] inset-0 bg-white border-grey drop-shadow-[1px_4px_6px_rgba(0,0,0,0.1)] focus-visible:outline-none h-fit max-h-[270px] overflow-y-scroll rounded-lg w-max z-30">
          <span v-if="!options?.length">
            <headless-listbox-option>
              <li class="cursor-default flex px-4 py-2 text-dark-grey">
                <p class="text-base w-full">
                  No options available
                </p>
              </li>
            </headless-listbox-option>
          </span>
          <span v-else>
            <headless-listbox-option
              v-for="option in options"
              :key="option.value"
              as="template"
              :value="option">
              <li class="cursor-pointer duration-150 ease-in-out flex px-4 py-2 transition-all hover:bg-gray-100">
                <template v-if="$slots.option">
                  <slot
                    name="option"
                    :option="option" />
                </template>
                <p
                  v-else
                  class="text-base w-full">
                  {{ option.label }}
                </p>
              </li>
            </headless-listbox-option>
          </span>
        </headless-listbox-options>
      </zoom-transition>
    </headless-listbox>
  </div>
</template>
