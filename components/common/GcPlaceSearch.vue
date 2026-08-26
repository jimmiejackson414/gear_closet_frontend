<script lang="ts" setup>
  import { onClickOutside, useDebounceFn } from '@vueuse/core';
  import { IconMapPin } from '#components';
  import { GEOAPIFY_ATTRIBUTION, type PlaceSearchResponse, type PlaceSuggestion } from '@/types/places';
  import { placeShortName } from '@/utils/places';

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
  const hasSearched = ref(false);
  const searchError = ref('');
  const editing = ref(false);
  const pickedLabel = ref<string | null>(null);
  const rootRef = ref<HTMLElement | null>(null);
  const inputRef = ref<{ focusInput: () => void } | null>(null);
  const didFinish = ref(false);
  let finishTimer: ReturnType<typeof setTimeout> | null = null;

  const clearFinishTimer = () => {
    if (finishTimer != null) {
      clearTimeout(finishTimer);
      finishTimer = null;
    }
  };

  onBeforeUnmount(clearFinishTimer);

  watch(model, (value) => {
    if (!editing.value) {
      query.value = value ?? '';
    }
  });

  const search = useDebounceFn(async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2 || props.disabled) {
      places.value = [];
      hasSearched.value = false;
      searchError.value = '';
      return;
    }
    loading.value = true;
    open.value = true;
    searchError.value = '';
    try {
      const response = await $fetch<PlaceSearchResponse>('/api/places/search', {
        query: { q: trimmed },
      });
      places.value = response.places;
    } catch {
      places.value = [];
      searchError.value = 'Place search is unavailable right now.';
    } finally {
      loading.value = false;
      hasSearched.value = true;
    }
  }, 300);

  const onInput = (value: string | number) => {
    const text = String(value);
    query.value = text;
    model.value = text;
    if (pickedLabel.value && text !== pickedLabel.value) {
      pickedLabel.value = null;
      if (props.variant === 'form') {
        emit('select', null);
      }
    }
    search(text);
  };

  const pickPlace = (place: PlaceSuggestion) => {
    const displayName = placeShortName(place);
    query.value = displayName;
    model.value = displayName;
    pickedLabel.value = displayName;
    places.value = [];
    open.value = false;
    editing.value = false;
    emit('select', place);
    didFinish.value = true;
  };

  const captureEditBaseline = () => {
    const baseline = (model.value ?? '').trim() || null;
    pickedLabel.value = baseline;
    query.value = model.value ?? '';
  };

  const finishEditing = () => {
    if (didFinish.value) return;
    didFinish.value = true;
    open.value = false;
    if (props.variant === 'inline') {
      editing.value = false;
    }
    const trimmed = query.value.trim();
    if (!pickedLabel.value || trimmed !== pickedLabel.value) {
      emit('commit', trimmed);
    }
  };

  const onFocus = () => {
    if (props.disabled) return;
    clearFinishTimer();
    didFinish.value = false;
    editing.value = true;
    if (props.variant === 'inline' && pickedLabel.value == null) {
      pickedLabel.value = (model.value ?? '').trim() || null;
    }
    if (query.value.trim().length >= 2) {
      search(query.value);
    }
  };

  const startInlineEdit = () => {
    if (props.disabled) return;
    clearFinishTimer();
    didFinish.value = false;
    captureEditBaseline();
    editing.value = true;
    nextTick(() => {
      inputRef.value?.focusInput();
    });
  };

  const onInputBlur = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && rootRef.value?.contains(next)) return;
    clearFinishTimer();
    finishTimer = setTimeout(() => {
      finishTimer = null;
      const active = document.activeElement;
      if (active && rootRef.value?.contains(active)) return;
      finishEditing();
    }, 150);
  };

  onClickOutside(rootRef, () => {
    finishEditing();
  });

  const showInput = computed(() => props.variant === 'form' || editing.value);
  const displayValue = computed(() => model.value || props.placeholder);
  const rootClass = computed(() => {
    if (props.variant === 'inline') {
      return showInput.value ? 'relative w-auto max-w-full min-w-48' : 'relative w-auto max-w-full';
    }
    return 'relative w-full';
  });
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    data-testid="place-search">
    <button
      v-if="variant === 'inline' && !showInput"
      class="text-left"
      data-testid="place-search-trigger"
      :disabled="disabled"
      type="button"
      @click="startInlineEdit"
      @mousedown.prevent>
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
      ref="inputRef"
      :disabled="disabled"
      :model-value="query"
      :name="name"
      :placeholder="placeholder"
      :prepend-icon="IconMapPin"
      @blur="onInputBlur"
      @focus="onFocus"
      @update:model-value="onInput" />
    <ul
      v-if="open && (places.length || loading || hasSearched)"
      class="z-20 absolute bg-popover shadow-md mt-1 p-1 border rounded-md w-full max-h-60 overflow-auto">
      <li
        v-if="loading && !places.length"
        class="px-2 py-1.5 text-muted-foreground text-sm">
        Searching…
      </li>
      <li
        v-else-if="searchError"
        class="px-2 py-1.5 text-muted-foreground text-sm">
        {{ searchError }}
      </li>
      <li
        v-else-if="!places.length"
        class="px-2 py-1.5 text-muted-foreground text-sm">
        No matching places. You can still save this name.
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
