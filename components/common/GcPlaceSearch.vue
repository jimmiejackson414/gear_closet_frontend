<script lang="ts" setup>
  import { onClickOutside, useDebounceFn } from '@vueuse/core';
  import { IconMapPin } from '#components';
  import { GEOAPIFY_ATTRIBUTION, type PlaceSearchResponse, type PlaceSuggestion } from '@/types/places';

  interface Props {
    disabled?: boolean
    placeholder?: string
    variant?: 'form' | 'inline'
    name?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    name: 'place-search',
    placeholder: 'Search a place',
    variant: 'form',
  });

  const emit = defineEmits<{
    select: [PlaceSuggestion | null]
    commit: [string]
  }>();

  const model = defineModel<string | null>({ default: '' });
  const query = ref(model.value ?? '');
  const places = ref<PlaceSuggestion[]>([]);
  const open = ref(false);
  const loading = ref(false);
  const editing = ref(false);
  const pickedLabel = ref<string | null>(null);
  const rootRef = ref<HTMLElement | null>(null);
  const didFinish = ref(false);

  watch(model, (value) => {
    if (!editing.value) {
      query.value = value ?? '';
    }
  });

  const search = useDebounceFn(async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2 || props.disabled) {
      places.value = [];
      return;
    }
    loading.value = true;
    try {
      const response = await $fetch<PlaceSearchResponse>('/api/places/search', {
        query: { q: trimmed },
      });
      places.value = response.places;
      open.value = true;
    } catch {
      places.value = [];
    } finally {
      loading.value = false;
    }
  }, 300);

  const onInput = (value: string | number) => {
    const text = String(value);
    query.value = text;
    model.value = text;
    if (pickedLabel.value && text !== pickedLabel.value) {
      pickedLabel.value = null;
      emit('select', null);
    }
    search(text);
  };

  const pickPlace = (place: PlaceSuggestion) => {
    query.value = place.label;
    model.value = place.label;
    pickedLabel.value = place.label;
    places.value = [];
    open.value = false;
    editing.value = false;
    emit('select', place);
    didFinish.value = true;
  };

  const finishEditing = () => {
    if (didFinish.value) return;
    didFinish.value = true;
    open.value = false;
    if (props.variant === 'inline') {
      editing.value = false;
    }
    if (!pickedLabel.value || query.value !== pickedLabel.value) {
      emit('commit', query.value.trim());
    }
  };

  const onFocus = () => {
    if (props.disabled) return;
    didFinish.value = false;
    editing.value = true;
    if (query.value.trim().length >= 2) {
      search(query.value);
    }
  };

  const onBlur = () => {
    setTimeout(() => {
      finishEditing();
    }, 150);
  };

  onClickOutside(rootRef, () => {
    finishEditing();
  });

  const showInput = computed(() => props.variant === 'form' || editing.value);
  const displayValue = computed(() => model.value || props.placeholder);
</script>

<template>
  <div
    ref="rootRef"
    class="relative w-full"
    data-testid="place-search">
    <button
      v-if="variant === 'inline' && !showInput"
      class="w-full text-left"
      :disabled="disabled"
      type="button"
      @click="onFocus">
      <slot name="display">
        <typography
          class="font-black!"
          variant="large">
          {{ displayValue }}
        </typography>
      </slot>
    </button>
    <input-root
      v-if="showInput"
      :disabled="disabled"
      :model-value="query"
      :name="name"
      :placeholder="placeholder"
      :prepend-icon="IconMapPin"
      @blur="onBlur"
      @focus="onFocus"
      @update:model-value="onInput" />
    <ul
      v-if="open && (places.length || loading)"
      class="z-20 absolute bg-popover shadow-md mt-1 p-1 border rounded-md w-full max-h-60 overflow-auto">
      <li
        v-if="loading && !places.length"
        class="px-2 py-1.5 text-muted-foreground text-sm">
        Searching…
      </li>
      <li
        v-for="place in places"
        :key="place.placeId || `${place.lat},${place.lng}`">
        <button
          class="hover:bg-accent px-2 py-1.5 rounded-sm w-full text-sm text-left"
          type="button"
          @mousedown.prevent="pickPlace(place)">
          {{ place.label }}
        </button>
      </li>
    </ul>
    <typography
      v-if="variant === 'form'"
      class="mt-1"
      variant="muted">
      {{ GEOAPIFY_ATTRIBUTION }}
    </typography>
  </div>
</template>
