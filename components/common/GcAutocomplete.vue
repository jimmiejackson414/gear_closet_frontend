<script lang='ts' setup>
  import type { Icon } from 'lucide-vue-next';
  import type { SelectOption } from '@/types/helpers';

  interface Props {
    disabled?: boolean;
    loading?: boolean;
    modelValue?: SelectOption | null;
    nullable?: boolean;
    multiple?: boolean;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    options: SelectOption[] | null;
    prependIcon?: Icon;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
    modelValue: undefined,
    nullable: true,
    multiple: false,
    size: 'md',
    placeholder: '',
    prependIcon: undefined,
  });

  const emit = defineEmits(['update:modelValue']);
  const query = ref('');

  // watch changes to the query and emit the new value
  watch(query, (val: string) => {
    emit('update:modelValue', val);
  });

  const filteredOptions = computed(() => {
    return query.value === ''
      ? props.options
      : props.options?.filter(option => option.label.toLowerCase()
        .includes(query.value.toLowerCase()));
  });

  const computedClasses = computed(() => {
    const classes = [];

    // determine padding based on size prop
    if (props.size === 'sm') { classes.push('p-2 text-base'); }
    else if (props.size === 'md') { classes.push('p-2.5 text-base'); }
    else if (props.size === 'lg') { classes.push('p-4 sm:text-md'); }

    if (props.prependIcon) { classes.push('ps-9'); }
  });
</script>

<template>
  <headless-combobox
    v-slot="{ open }"
    as="div"
    class="relative"
    :disabled="disabled || loading"
    :display-value="(option: SelectOption) => option.label"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable">
    <headless-combobox-input
      class="appearance-none bg-white border focus:border-primary border-1 border-gray-300 flex items-center gap-3 peer py-2.5 rounded-lg text-dark-grey w-full focus:outline-none focus:ring-0 placeholder:!text-gray-400"
      :class="computedClasses"
      :placeholder="placeholder"
      @change="query = $event.target.value" />
    <div class="-translate-y-1/2 absolute top-1/2 right-2 transform">
      <gc-spinner
        v-if="loading"
        size="sm"
        variant="primary" />
    </div>
    <fade-transition>
      <div v-show="open">
        <headless-combobox-options
          class="absolute top-[50px] inset-0 bg-white border-grey drop-shadow-[1px_4px_6px_rgba(0,0,0,0.1)] focus-visible:outline-none h-fit max-h-[270px] overflow-y-scroll rounded-lg w-full z-30"
          static>
          <span v-if="!options?.length">
            <headless-combobox-option>
              <div class="cursor-default flex p-4 text-dark-gray">
                <p class="text-base">
                  No results found.
                </p>
              </div>
            </headless-combobox-option>
          </span>
          <span v-else>
            <headless-combobox-option
              v-for="option in filteredOptions"
              :key="option.value"
              :value="option">
              <div class="cursor-pointer duration-150 ease-in-out flex px-4 py-2 transition-all hover:bg-gray-100">
                <p class="text-base w-full">
                  {{ option.label }}
                </p>
              </div>
            </headless-combobox-option>
          </span>
        </headless-combobox-options>
      </div>
    </fade-transition>
  </headless-combobox>
</template>
