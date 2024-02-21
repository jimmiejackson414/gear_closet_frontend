<script lang='ts' setup>
  import { ChevronDownIcon, XCircleIcon } from 'lucide-vue-next';
  import { usePopper } from '@/composables/usePopper';
  import type { SelectOption } from '@/types/helpers';
  import type { ModifierArguments } from '@popperjs/core';

  interface Props {
    clearable?: boolean;
    customClasses?: string;
    disabled?: boolean;
    error?: string | null;
    hideBorder?: boolean;
    label?: string;
    loading?: boolean;
    modelValue?: string | string[] | number | null;
    options: SelectOption[] | Option[] | null;
    placeholder?: string,
    required?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    clearable: false,
    customClasses: '',
    disabled: false,
    error: null,
    hideBorder: false,
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
    if (props.size === 'xs') { classes.push('p-1.5 text-xs gap-1'); }
    else if (props.size === 'sm') { classes.push('p-2 text-base gap-3'); }
    else if (props.size === 'md') { classes.push('p-2.5 text-base gap-3'); }
    else if (props.size === 'lg') { classes.push('p-4 sm:text-md gap-3'); }

    // determine border based on hideBorder prop
    if (props.hideBorder) { classes.push('border-0'); }
    else { classes.push('border border-gray-300'); }

    return classes;
  });

  let [trigger, container] = usePopper({
    placement: 'bottom-end',
    strategy: 'fixed',
    modifiers: [
      {  name: 'offset',  options: { offset: [0, 10] } },
      {  name: 'afterWrite', fn: ({ state }: ModifierArguments<{}>) => {
        if (state.elements.popper) {
          state.elements.popper.style.opacity = '1';
        }
      },
      },
    ],
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
        ref="trigger"
        class="appearance-none bg-white flex items-center peer rounded-lg text-dark-grey w-full focus:border-primary focus:outline-none focus:ring-0"
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
          class="flex items-center ml-auto"
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
            class="duration-150 ease-in-out font-bold h-auto transition-transform"
            :class="[ open ? 'rotate-180' : 'rotate-0', ( disabled || loading ) ? 'text-dark-grey' : 'text-light-primary' ]" />
        </div>
      </headless-listbox-button>
      <teleport to="body">
        <zoom-transition>
          <headless-listbox-options
            ref="container"
            class="absolute right-0 bg-white border-grey drop-shadow-[1px_4px_6px_rgba(0,0,0,0.1)] duration-200 focus-visible:outline-none h-fit max-h-[270px] opacity-0 origin-top-right overflow-y-scroll rounded-lg transition-opacity w-max z-30">
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
      </teleport>
    </headless-listbox>
  </div>
</template>
