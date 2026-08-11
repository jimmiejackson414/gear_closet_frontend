<script lang='ts' setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import dayjs from 'dayjs';
  import { IconPencil, IconPlus } from '#components';
  import { usePlanningStore } from '@/stores/planning';
  import { type Database, type Tables, type TablesUpdate, TripDetailsType } from '@/types';
  import '@vuepic/vue-datepicker/dist/main.css';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const activeDetail = ref<Tables<'trip_details'> | undefined>(undefined);
  const isModifyDetailDialogOpen = ref(false);

  const tripDetails = computed(() => {
    return $store.data?.trip_details.filter((detail) => detail.type === TripDetailsType.TRIP) || [];
  });

  /**
   * Creates a new detail for the selected trip.
   */
  const createDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          trip_id: Number($store.selectedTripId),
          title: 'New detail',
          type: TripDetailsType.TRIP,
          value: 'New trip detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        $store.data.trip_details.push(newDetail[0]);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new detail.');
    }
  };

  /**
   * Update a trip
   * @param payload
   */
  const updateTrip = async (payload: TablesUpdate<'trips'>) => {
    console.log(`updateTrip`);
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTrip, error } = await supabase.from('trips')
        .update(payload)
        .eq('id', Number($store.selectedTripId))
        .select();
      console.log({ updatedTrip, error });

      if (updatedTrip?.length && $store.selectedTripId && !error) {
        $store.selectedTripId = String(updatedTrip[0].id);

        // Find the index of the corresponding trip in data.value.trips and update it
        const tripIndex = $store.data.trips.findIndex(trip => trip.id === updatedTrip[0].id);
        if (tripIndex !== -1) {
          $store.data.trips.splice(tripIndex, 1, updatedTrip[0]);
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the trip.');
    }
  };

  const datePicker = ref(null);
  const editingTripDates = ref(false);
  const dateRange = computed(() => [$store.selectedTrip?.starting_date || '', $store.selectedTrip?.ending_date || '']);
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
  <card class="px-8 py-4 rounded-3xl">
    <div class="grid grid-cols-[auto_auto_1fr] justify-start items-center">
      <icon-footprints class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold! text-base">
        Trip Details
      </p>
      <button-root
        v-if="!$store.pageLoading && tripDetails.length"
        class="justify-self-end rounded-full"
        size="icon"
        @click="createDetail">
        <icon-plus />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state v-else-if="!$store.pageLoading && !tripDetails?.length">
      <p class="mb-4 text-base">
        You haven't added any trip details yet!
      </p>
      <button-root
        size="sm"
        variant="outline"
        @click="createDetail">
        Get Started
      </button-root>
    </gc-empty-state>
    <div v-else>
      <div class="flex flex-col mb-6">
        <gc-inline-edit
          :model-value="$store.selectedTrip?.name"
          name="trip_name"
          placeholder="Trip Name"
          size="sm"
          @update:model-value="updateTrip({ name: $event as string | null })">
          <typography
            class="font-black!"
            variant="large">
            {{ $store.selectedTrip?.name }}
          </typography>
        </gc-inline-edit>
        <div>
          <div
            v-if="!editingTripDates"
            class="flex items-center gap-4 group"
            @click="editingTripDates = !editingTripDates">
            <typography class="cursor-pointer text-grey">
              {{ $store.selectedTrip?.starting_date ? formattedDate($store.selectedTrip?.starting_date) : 'Start Date' }}
            </typography>
            <icon-move-right class="h-6 text-grey w-6" />
            <typography class="cursor-pointer text-grey">
              {{ $store.selectedTrip?.ending_date ? formattedDate($store.selectedTrip?.ending_date) : 'End Date' }}
            </typography>
            <button-root
              class="group-hover:opacity-100 opacity-0 rounded-full"
              size="sm"
              variant="ghost">
              <icon-pencil />
            </button-root>
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
          class="mb-0">
          <div class="flex items-center gap-4 group space-between">
            <div class="flex justify-between items-center flex-1">
              <typography class="font-bold! text-grey">
                {{ detail.title }}
              </typography>
              <a
                v-if="detail.url"
                class="text-hyperlink"
                :href="detail.url"
                rel="noopener noreferrer"
                target="_blank">
                {{ detail.value }}
              </a>
              <typography
                v-else
                class="text-muted-foreground">
                {{ detail.value }}
              </typography>
            </div>
            <button-root
              class="group-hover:opacity-100 opacity-0 rounded-full"
              size="sm"
              variant="ghost"
              @click="[activeDetail = detail, isModifyDetailDialogOpen = true]">
              <icon-pencil />
            </button-root>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modify Detail Dialog -->
    <lazy-modify-detail-dialog
      :active-detail="( activeDetail as Tables<'trip_details'> )"
      :is-open="isModifyDetailDialogOpen"
      @on-close="isModifyDetailDialogOpen = false" />
  </card>
</template>
