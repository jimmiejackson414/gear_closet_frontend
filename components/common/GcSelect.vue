<script lang='ts' setup>
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
  import { ChevronDownIcon, XCircleIcon } from 'lucide-vue-next';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    clearable?: boolean;
    customClasses?: string;
    disabled?: boolean;
    error?: string | null;
    loading?: boolean;
    modelValue?: string | string[] | number | null;
    options: SelectOption[] | null;
    placeholder?: string,
    required?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    clearable: false,
    customClasses: '',
    disabled: false,
    error: null,
    loading: false,
    modelValue: undefined,
    placeholder: 'Select an option',
    required: false,
  });

  const emit = defineEmits(['update:modelValue']);

  const displayPlaceholder = computed(() => !props.modelValue);
  const label = computed(() => {
    return props.options?.find(option => option.value === props.modelValue)?.label;
  });
</script>

<template>
  <listbox
    v-slot="{ open }"
    as="div"
    class="relative"
    :disabled="disabled || loading"
    :model-value="modelValue"
    :multiple="false"
    @update:model-value="(value: any) => emit('update:modelValue', value)">
    <listbox-button
      class="appearance-none bg-white border focus:border-primary border-1 border-gray-300 flex items-center gap-3 peer px-2.5 py-2 rounded-lg text-dark-grey text-sm w-full focus:outline-none focus:ring-0"
      :class="[
        ( disabled || loading ) ? 'border-grey cursor-auto' : 'border-gray-300 cursor-pointer', customClasses,
        { 'border-danger !bg-danger-light' : required && !!error },
      ]">
      <p
        v-if="displayPlaceholder"
        :class="( disabled || loading ) ? 'text-dark-grey' : 'text-grey'">
        {{ placeholder }}
      </p>
      <p
        v-else
        class="text-base"
        :class="( disabled || loading ) ? 'text-dark-grey' : 'text-grey'">
        {{ label }}
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
    </listbox-button>
    <fade-transition>
      <listbox-options class="absolute top-[50px] inset-0 bg-white border-grey drop-shadow-[1px_4px_6px_rgba(0,0,0,0.1)] focus-visible:outline-none h-fit max-h-[270px] overflow-y-scroll rounded-lg w-full z-30">
        <span v-if="!options?.length">
          <listbox-option>
            <li class="cursor-default flex px-4 text-dark-grey">
              <p class="text-base w-full">
                No options available
              </p>
            </li>
          </listbox-option>
        </span>
        <span v-else>
          <listbox-option
            v-for="option in options"
            :key="option.value"
            as="template"
            :value="option">
            <li class="cursor-pointer duration-150 ease-in-out flex px-4 py-2 transition-all hover:bg-gray-100">
              <p class="text-base w-full">
                {{ option.label }}
              </p>
            </li>
          </listbox-option>
        </span>
      </listbox-options>
    </fade-transition>
  </listbox>
</template>
