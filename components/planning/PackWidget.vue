<script lang='ts' setup>
  import { BackpackIcon } from 'lucide-vue-next';
  import type { Database, Pack } from '@/types';
  import type { SelectOption } from '~/types/helpers';

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const { data, pageLoading, selectedTripId } = storeToRefs($store);

  const isAddPackModalOpen = ref(false);
  const submitting = ref(false);
  const fetchingPacks = ref(false);
  const selectedPack = ref<Pack | undefined>(undefined);
  const packOptions = ref<SelectOption[]>([]);
  /**
   * Fetches packs for the current user.
   */
  const fetchPacks = async () => {
    fetchingPacks.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: packs, error } = await supabase
        .from('packs')
        .select('*')
        .eq('profile_id', user.value?.id as string);
    
      if (packs?.length && !error) {
        packOptions.value = packs.map(p => ({
          label: p.name as string,
          value: p.id as number,
        }));
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error fetching packs.');
    } finally {
      fetchingPacks.value = false;
    }
  };

  watch(isAddPackModalOpen, async (newValue) => {
    if (newValue) {
      await fetchPacks();
    }
  });

  /**
   * Adds a pack to the trip.
   */
  const addPackToTrip = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: createdTripPack, error } = await supabase.from('trip_packs')
        .insert([{
          trip_id: selectedTripId.value,
          pack_id: selectedPack.value?.id,
          profile_id: user.value?.id,
        }])
        .select();
      console.log({ createdTripPack, error });
    } catch (err) {
      $appStore.notifyNegative('There was an error adding the pack to the trip.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div class="card card-main">
    <div class="flex justify-start items-center py-4">
      <backpack-icon class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Pack
      </p>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!data.pack && !pageLoading">
      <p class="mb-4 text-base">
        You haven't added a pack to this trip yet!
      </p>
      <gc-button
        label="Add a pack"
        outlined
        size="sm"
        @click="isAddPackModalOpen = true" />
    </gc-empty-state>
    <div v-else>
      <h5 class="text-base-lg">
        Selected Pack: 
        <span class="font-black">{{ data.pack?.name }}</span>
      </h5>
    </div>
  </div>

  <!-- Add a Pack Modal -->
  <gc-modal
    :is-open="isAddPackModalOpen"
    title="Add a Pack"
    @handle-cancel="isAddPackModalOpen = false">
    <template #default>
      <div class="flex items-center flex-col gap-4">
        <p class="text-base text-gray">
          {{ !fetchingPacks && !packOptions.length ? 'You haven\'t created any packs yet!' : 'Choose one of your existing packs to add to this trip, or create a new pack!' }}
        </p>
        <gc-select
          v-if="!fetchingPacks && packOptions.length"
          v-model:id="selectedPack"
          class="mb-4"
          :disabled="pageLoading"
          label="Selected Pack"
          name="selected-pack-select"
          :options="packOptions" />
        <gc-button
          label="Create a new pack"
          outlined
          size="sm"
          :to="{ name: 'closet' }"
          variant="positive" />
      </div>
    </template>
    <template
      v-if="!fetchingPacks && packOptions.length"
      #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="isAddPackModalOpen = false" />
      <gc-button
        :disabled="submitting"
        label="Add Pack"
        :loading="submitting"
        size="sm"
        @click="addPackToTrip" />
    </template>
  </gc-modal>
</template>
