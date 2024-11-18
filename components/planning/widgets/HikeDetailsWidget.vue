<script lang='ts' setup>
  import { IconPencil, IconPlus } from '#components';
  import { type Database, type Tables, type TablesUpdate, TripDetailsType } from '@/types';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, dialogStates, pageLoading, selectedTrip, selectedTripId } = storeToRefs($store);

  const hikeDetails = computed(() => {
    return data.value?.trip_details.filter((detail) => {
      return detail.type === TripDetailsType.HIKE;
    }) || [];
  });

  const toggleEditDialog = (detail: Tables<'trip_details'>) => {
    $store.activeDetail = { ...detail };
    dialogStates.value.modifyDetailDialog = !dialogStates.value.modifyDetailDialog;
  };

  /**
   * Creates a new detail for the selected trip.
   */
  const createNewDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          trip_id: selectedTripId?.value,
          title: 'New detail',
          type: TripDetailsType.HIKE,
          value: 'New hike detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        data.value.trip_details.push(newDetail[0]);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new detail.');
    }
  };

  /**
   * Updates a trip
   * @param payload
   */
  const updateTrip = async (payload: TablesUpdate<'trips'>) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTrip, error } = await supabase.from('trips')
        .update(payload)
        .eq('id', selectedTripId?.value as number)
        .select();

      // Update the trip in the store.
      if (updatedTrip?.length && selectedTripId && !error) {
        const tripToUpdate = data.value.trips.find((t) => t.id === selectedTripId.value);
        if (tripToUpdate) {
          Object.assign(tripToUpdate, updatedTrip[0]);
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the trip.');
    }
  };
</script>

<template>
  <div class="card card-main">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <icon-mountain class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Hike Details
      </p>
      <gc-button
        v-if="!pageLoading && hikeDetails.length"
        class="justify-self-end"
        data-testid="create-new-detail-btn"
        :icon="IconPlus"
        round
        size="sm"
        @click="createNewDetail" />
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state
      v-else-if="!pageLoading && !hikeDetails.length"
      data-testid="hike-details-empty-state">
      <p class="mb-4 text-base">
        You haven't created any hike details yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm"
        @click="createNewDetail" />
    </gc-empty-state>
    <div v-else>
      <div class="flex items-center gap-6">
        <gc-inline-edit
          :model-value="selectedTrip?.starting_point"
          name="starting_point"
          placeholder="Ending point"
          size="sm"
          @handle-update="updateTrip({ starting_point: $event })">
          <h5 class="!font-black text-base-lg">
            {{ selectedTrip?.starting_point }}
          </h5>
        </gc-inline-edit>
        <icon-move-right class="h-6 text-grey w-6" />
        <gc-inline-edit
          :model-value="selectedTrip?.ending_point"
          name="ending_point"
          placeholder="Ending point"
          size="sm"
          @handle-update="updateTrip({ ending_point: $event })">
          <h5 class="!font-black text-base-lg">
            {{ selectedTrip?.ending_point }}
          </h5>
        </gc-inline-edit>
      </div>
      <div class="flex items-center mb-6">
        <gc-inline-edit
          :model-value="selectedTrip?.description"
          name="description"
          placeholder="Trip description"
          size="sm"
          @handle-update="updateTrip({ description: $event })">
          <p class="cursor-pointer text-base text-grey">
            {{ selectedTrip?.description }}
          </p>
        </gc-inline-edit>
      </div>
      <ul>
        <li
          v-for="detail in hikeDetails"
          :key="detail.id"
          class="mb-5">
          <div class="flex items-center gap-4 group space-between">
            <div class="flex justify-between items-center flex-1">
              <p class="!font-bold text-base text-grey">
                {{ detail.title }}
              </p>
              <a
                v-if="detail.url"
                class="font-bold hyperlink text-base"
                :href="detail.url"
                rel="noopener noreferrer"
                target="_blank">
                {{ detail.value }}
              </a>
              <p
                v-else
                class="font-bold text-base text-grey">
                {{ detail.value }}
              </p>
            </div>
            <gc-button
              class="group-hover:opacity-100 opacity-0"
              ghost
              :icon="IconPencil"
              round
              size="sm"
              @click="toggleEditDialog(detail)" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
