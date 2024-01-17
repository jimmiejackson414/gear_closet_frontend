<script lang='ts' setup>
  import { MountainIcon, MoveRightIcon, PencilIcon, PlusIcon } from 'lucide-vue-next';
  import { TripDetailType, type Database, type TripDetail, type UpdateTripDetail, type UpdateTrip } from '@/types';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip, selectedTripId } = storeToRefs($store);

  const hikeDetails = computed(() => {
    return data.value?.trip_details.filter((detail) => {
      return detail.type === TripDetailType.HIKE;
    }) || [];
  });

  const isEditDialogOpen = ref(false);
  const activeDetail = ref<TripDetail | null>(null);
  const detailHasUrl = ref(false);

  const updateDetailHasUrl = (value: boolean) => {
    if (value) {
      activeDetail.value!.url = activeDetail.value?.url ? prependProtocol(activeDetail.value?.url) : '';
    } else {
      activeDetail.value!.url = null;
    }
    detailHasUrl.value = value;
  };

  watch(activeDetail, (newVal) => {
    detailHasUrl.value = Boolean(newVal?.url);
  });

  const toggleEditDialog = (detail: TripDetail) => {
    activeDetail.value = { ...detail };
    isEditDialogOpen.value = !isEditDialogOpen.value;
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
          type: TripDetailType.HIKE,
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
   * Updates a detail.
   */
  const submitting = ref(false);
  const updateDetail = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const payload: UpdateTripDetail = { ...activeDetail.value, url: detailHasUrl.value ? prependProtocol(activeDetail.value?.url as string) : null };

      const { data: updatedDetail, error } = await supabase.from('trip_details')
        .update(payload)
        .eq('id', activeDetail.value?.id as number)
        .select();

      if (updatedDetail?.length && !error) {
        const index = data.value.trip_details.findIndex((t) => t.id === activeDetail.value?.id);
        data.value.trip_details[index] = updatedDetail[0];
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the detail.');
    } finally {
      submitting.value = false;
      isEditDialogOpen.value = false;
    }
  };

  /**
   * Deletes a detail.
   */
  const deleteDetail = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from('trip_details')
        .delete()
        .eq('id', activeDetail.value?.id as number);

      if (!error) {
        const index = data.value.trip_details.findIndex((t) => t.id === activeDetail.value?.id);
        data.value.trip_details.splice(index, 1);
        isEditDialogOpen.value = false;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the detail.');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Updates a trip
   * @param payload
   */
  const updateTrip = async (payload: UpdateTrip) => {
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
  <div class="bg-white px-8 py-4 rounded-4xl shadow-light">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <mountain-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Hike Details
      </p>
      <gc-button
        v-if="!pageLoading && hikeDetails.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        @click="createNewDetail" />
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !hikeDetails.length">
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
        <move-right-icon class="h-6 text-grey w-6" />
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
              :icon="PencilIcon"
              round
              size="sm"
              @click="toggleEditDialog(detail)" />
          </div>
        </li>
      </ul>
    </div>
    <gc-modal
      :is-open="isEditDialogOpen"
      title="Edit Hike Detail"
      @handle-cancel="isEditDialogOpen = false">
      <template #default>
        <div class="flex flex-col gap-6">
          <gc-input
            class="w-full"
            label="Title"
            :model-value="activeDetail?.title"
            name="title"
            @update:model-value="e => activeDetail!.title = e" />
          <gc-input
            class="w-full"
            label="Value"
            :model-value="activeDetail?.value"
            name="value"
            @update:model-value="e => activeDetail!.value = e" />
          <gc-checkbox
            id="has-url"
            :checked="detailHasUrl"
            label="Link to URL?"
            @update="updateDetailHasUrl" />
          <gc-input
            v-if="detailHasUrl"
            class="w-full"
            label="URL"
            :model-value="activeDetail?.url"
            name="url"
            @update:model-value="e => activeDetail!.url = e" />
        </div>
      </template>
      <template #actions>
        <gc-button
          :disabled="submitting"
          label="Delete"
          outlined
          size="sm"
          variant="danger"
          @click="deleteDetail" />
        <div class="flex items-center gap-4">
          <gc-button
            :disabled="submitting"
            label="Cancel"
            size="sm"
            variant="secondary"
            @click="isEditDialogOpen = false" />
          <gc-button
            :disabled="submitting"
            label="Update"
            size="sm"
            @click="updateDetail" />
        </div>
      </template>
    </gc-modal>
  </div>
</template>
