<script lang='ts' setup>
  import dayjs from 'dayjs';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { BackpackIcon, CalendarIcon, MapPinIcon, TextIcon } from 'lucide-vue-next';
  import type { Database, TablesInsert } from '@/types';
  import '@vuepic/vue-datepicker/dist/main.css';

  const $store = usePlanningStore();
  const { data, dialogStates, selectedTripId } = storeToRefs($store);

  const submitting = ref(false);
  const newTrip = reactive({
    name: '',
    description: '',
    starting_point: '',
    ending_point: '',
  });

  const datePicker = ref(null);
  const format = (dates: Date[]) => {
    const date1 = dayjs(dates[0])
      .format('MMM D, YYYY');
    const date2 = dates[1] ? dayjs(dates[1])
      .format('MMM D, YYYY') : '';
    return `${date1} to ${date2}`;
  };

  /**
   * Creates a new trip.
   */
  const $appStore = useAppStore();
  const dateRange = ref([]);
  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const payload: TablesInsert<'trips'> = {
        name: newTrip.name,
        description: newTrip.description,
        starting_point: newTrip.starting_point,
        ending_point: newTrip.ending_point,
        starting_date: dateRange.value[0],
        ending_date: dateRange.value[1],
        profile_id: user.value?.id as string,
      };
      const { data: createdTrip, error } = await supabase.from('trips')
        .insert([payload])
        .select();

      if (error) { $appStore.notifyNegative('There was an error creating a new trip.'); }
      else {
        $appStore.notifyPositive('Successfully created a new trip!');
        dialogStates.value.createTripDialog = false;
        if (selectedTripId?.value) {
          selectedTripId.value = createdTrip[0].id;
          data.value.trips.push(createdTrip[0]);
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new trip.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.createTripDialog"
    title="Create a New Trip"
    @handle-cancel="dialogStates.createTripDialog = false">
    <template #content>
      <div class="flex flex-col gap-6">
        <!-- Name -->
        <gc-input
          v-model="newTrip.name"
          class="w-full"
          :disabled="submitting"
          label="Trip Name*"
          name="new-trip-name"
          placeholder="Appalachian Trail"
          :prepend-icon="BackpackIcon"
          required />
        <!-- Description -->
        <gc-input
          v-model="newTrip.description"
          class="w-full"
          :disabled="submitting"
          label="Description"
          name="new-trip-description"
          placeholder="2200 miles through 14 states"
          :prepend-icon="TextIcon" />
        <!-- Starting point -->
        <gc-input
          v-model="newTrip.starting_point"
          class="w-full"
          :disabled="submitting"
          label="Origin"
          name="new-trip-origin"
          placeholder="Springer Mountain"
          :prepend-icon="MapPinIcon" />
        <!-- Ending Point -->
        <gc-input
          v-model="newTrip.ending_point"
          class="w-full"
          :disabled="submitting"
          label="Destination"
          name="new-trip-destination"
          placeholder="Mount Katahdin"
          :prepend-icon="MapPinIcon" />
        <!-- Datepicker -->
        <div class="flex flex-col gap-2">
          <label
            class="font-bold text-grey text-sm"
            for="datePicker">
            Start and End Dates
          </label>
          <vue-date-picker
            ref="datePicker"
            :action-row="{ showNow: false, showPreview: false, showCancel: false, showSelect: true }"
            :auto-apply="true"
            calendar-cell-class-name="gc-dp-cell"
            class="!w-full gc-dp"
            :format="format"
            :hide-navigation="['time']"
            input-class-name="gc-dp-input"
            :model-value="dateRange"
            name="datePicker"
            placeholder="Start and End Dates"
            :preview-format="format"
            range
            @update:model-value="dateRange = $event">
            <template #input-icon>
              <calendar-icon class="-translate-y-1/2 absolute top-1/2 left-2.5 h-5 inline-block pointer-events-none text-base text-grey w-5" />
            </template>
          </vue-date-picker>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-between items-center w-full">
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="dialogStates.createTripDialog = false" />
        <gc-button
          :disabled="submitting"
          label="Create"
          size="sm"
          @click="handleSubmit" />
      </div>
    </template>
  </gc-modal>
</template>
