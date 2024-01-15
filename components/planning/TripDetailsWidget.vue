<script lang='ts' setup>
  import dayjs from 'dayjs';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { FootprintsIcon, MoveRightIcon, PencilIcon, PlusIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';
  import { TripDetailType } from '@/types';
  import { prependProtocol } from '~/helpers/functions';
  import type { Database, TripDetail, UpdateTrip, UpdateTripDetail } from '@/types';
  import '@vuepic/vue-datepicker/dist/main.css';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTripId, selectedTrip } = storeToRefs($store);

  const tripDetails = computed(() => {
    return data.value?.trip_details.filter((detail) => {
      return detail.type === TripDetailType.TRIP;
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
  const createDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          trip_id: selectedTripId?.value as number,
          title: 'New detail',
          type: TripDetailType.TRIP,
          value: 'New trip detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        data.value.trip_details.push(newDetail[0]);
      }
    } catch (err) {
      console.log({ err });
      $appStore.notifyNegative('There was an error creating a new detail.');
    }
  };

  /**
   *  Updates a detail.
   * @param detail 
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
        const index = data.value.trip_details.findIndex((detail) => detail.id === activeDetail.value?.id);
        data.value.trip_details[index] = updatedDetail[0];
        isEditDialogOpen.value = false;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the detail.');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Deletes a detail.
   */
  const deleteDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: deletedDetail, error } = await supabase.from('trip_details')
        .delete()
        .eq('id', activeDetail.value?.id as number)
        .select();

      if (deletedDetail?.length && !error) {
        const index = data.value.trip_details.findIndex((detail) => detail.id === activeDetail.value?.id);
        data.value.trip_details.splice(index, 1);
        isEditDialogOpen.value = false;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the detail.');
    }
  };

  /**
   * Update a trip
   * @param payload
   */
  const updateTrip = async (payload: UpdateTrip) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTrip, error } = await supabase.from('trips')
        .update(payload)
        .eq('id', selectedTripId?.value as number)
        .select();

      if (updatedTrip?.length && selectedTripId && !error) {
        selectedTripId.value = updatedTrip[0].id;

        // Find the index of the corresponding trip in data.value.trips and update it
        const tripIndex = data.value.trips.findIndex(trip => trip.id === updatedTrip[0].id);
        if (tripIndex !== -1) {
          data.value.trips.splice(tripIndex, 1, updatedTrip[0]);
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the trip.');
    }
  };

  const datePicker = ref(null);
  const editingTripDates = ref(false);
  const dateRange = computed(() => [selectedTrip?.value?.starting_date || '', selectedTrip?.value?.ending_date || '']);
  const format = (dates: Date[]) => {
    const date1 = dayjs(dates[0])
      .format('MMM D, YYYY');
    const date2 = dates[1] ? dayjs(dates[1])
      .format('MMM D, YYYY') : '';
    return `${date1} to ${date2}`;
  };

  const formattedDate = (date: string | undefined | null) => {
    if (!date) return '';
    return dayjs(date)
      .format('MMM D, YYYY');
  };

  onClickOutside(datePicker, () => editingTripDates.value = false);
</script>

<template>
  <div class="bg-white px-8 py-4 rounded-4xl shadow-light">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <footprints-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Trip Details
      </p>
      <gc-button
        v-if="!pageLoading && tripDetails.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        @click="createDetail" />
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !tripDetails?.length">
      <p class="mb-4 text-base">
        You haven't added any trip details yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm"
        @click="createDetail" />
    </gc-empty-state>
    <div v-else>
      <div class="flex flex-col mb-6">
        <gc-inline-edit
          :model-value="selectedTrip?.name"
          name="trip_name"
          placeholder="Trip Name"
          size="sm"
          @handle-update="updateTrip({ name: $event })">
          <h5 class="!font-black text-base-lg">
            {{ selectedTrip?.name }}
          </h5>
        </gc-inline-edit>
        <div>
          <div
            v-if="!editingTripDates"
            class="flex items-center gap-4 group"
            @click="editingTripDates = !editingTripDates">
            <p class="cursor-pointer text-base text-grey">
              {{ selectedTrip?.starting_date ? formattedDate(selectedTrip?.starting_date) : 'Start Date' }}
            </p>
            <move-right-icon class="h-6 text-grey w-6" />
            <p class="cursor-pointer text-base text-grey">
              {{ selectedTrip?.ending_date ? formattedDate(selectedTrip?.ending_date) : 'End Date' }}
            </p>
            <gc-button
              class="group-hover:opacity-100 opacity-0"
              ghost
              :icon="PencilIcon"
              round
              size="sm" />
          </div>
          <vue-date-picker
            v-else
            ref="datePicker"
            :action-row="{ showNow: false, showPreview: false, showCancel: false, showSelect: true }"
            :auto-apply="true"
            calendar-cell-class-name="gc-dp-cell"
            class="gc-dp"
            :format="format"
            :hide-navigation="['time']"
            input-class-name="gc-dp-input"
            :model-value="dateRange"
            placeholder="Start and End Dates"
            :preview-format="format"
            range
            @update:model-value="
              updateTrip({ starting_date: $event[0], ending_date: $event[1] }),
              editingTripDates = false;
            " />
        </div>
      </div>
      <ul>
        <li
          v-for="detail in tripDetails"
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
      title="Edit Trip Detail"
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
