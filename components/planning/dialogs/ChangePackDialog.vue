<script lang='ts' setup>
  import { IconBackpack } from '#components';
  import type { Database } from '@/types';
  import type { SelectOption } from '@/types/ui';

  interface Props {
    isOpen: boolean;
    state?: 'insert' | 'update';
  }

  const props = defineProps<Props>();
  const emits = defineEmits<{
    (event: 'onClose'): void;
  }>();

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const selectedPackId = ref<number | undefined>(undefined);

  // watch data.pack and set selectedPackId.value to the pack id
  watch(() => $store.data.pack, (newValue) => {
    if (newValue) {
      selectedPackId.value = newValue.id;
    }
  }, { immediate: true });

  /**
   * Fetches packs for the current user.
   */
  const fetchingPacks = ref(false);
  const packOptions = ref<SelectOption[]>([]);
  const fetchPacks = async () => {
    fetchingPacks.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: packs, error } = await supabase
        .from('packs')
        .select('*')
        .eq('profile_id', user.value?.sub as string);

      if (packs?.length && !error) {
        packOptions.value = packs.map(p => ({
          label: p.name as string,
          value: p.id as number,
        }));
      }
    } catch {
      $appStore.notifyNegative('There was an error fetching packs.');
    } finally {
      fetchingPacks.value = false;
    }
  };

  watch(() => props.isOpen, async (newValue: boolean) => {
    if (newValue) await fetchPacks();
  });

  /**
   * Adds a pack to the trip.
   */
  const submitting = ref(false);
  const addPackToTrip = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: createdTripPack, error } = await supabase.from('trip_packs')
        .insert([{
          pack_id: selectedPackId.value,
          profile_id: user.value?.sub,
          trip_id: Number($store.selectedTripId),
        }])
        .select();

      if (error || !createdTripPack) {
        throw new Error('There was an error adding the pack to the trip.');
      } else {
        $appStore.notifyPositive('Pack added to trip!');
        await $store.fetchPlanningPage(Number($store.selectedTripId));
        emits('onClose');
      }
    } catch {
      $appStore.notifyNegative('There was an error adding the pack to the trip.');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Updates a trip pack.
   */
  const updateTripPack = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: updatedTripPack, error } = await supabase.from('trip_packs')
        .update({ pack_id: selectedPackId.value })
        .eq('trip_id', Number($store.selectedTripId))
        .eq('profile_id', user.value?.sub as string)
        .select();

      if (error || !updatedTripPack.length) {
        throw new Error('There was an error updating the trip pack.');
      } else {
        $appStore.notifyPositive('Trip pack updated!');
        emits('onClose');
        await $store.fetchPlanningPage(Number($store.selectedTripId));
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the trip pack.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>
          {{ state === 'insert' ? 'Add a Pack' : 'Change Pack' }}
        </dialog-title>
        <dialog-description>
          {{ !fetchingPacks && !packOptions.length ? 'You haven\'t created any packs yet!' : 'Choose one of your existing packs to add to this trip, or create a new pack!' }}
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col items-center gap-8 mx-auto mt-4 w-full lg:max-w-sm">
        <select-root
          :model-value="String(selectedPackId)"
          @update:model-value="selectedPackId = Number($event)">
          <select-trigger :prepend-icon="IconBackpack">
            <select-value placeholder="Select a pack" />
          </select-trigger>
          <select-content>
            <select-group v-if="packOptions.length">
              <select-item
                v-for="pack in packOptions"
                :key="pack.value"
                :value="String(pack.value)">
                {{ pack.label }}
              </select-item>
            </select-group>
            <select-group v-else>
              <select-item
                disabled
                hide-checkmark
                value="0">
                No packs found
              </select-item>
            </select-group>
          </select-content>
        </select-root>
        <separator label="or" />
        <button-root
          as-child
          variant="outline">
          <nuxt-link :to="{ name: 'closet' }">
            Create a new pack
          </nuxt-link>
        </button-root>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="emits('onClose')">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="state === 'insert' ? addPackToTrip() : updateTripPack()">
          {{ state === 'insert' ? 'Add Pack' : 'Change Pack' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
