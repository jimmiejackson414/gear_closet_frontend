<script lang='ts' setup>
  import dayjs from 'dayjs';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { BackpackIcon, CalendarIcon, MapPinIcon, SettingsIcon, TextIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';
  import type { Database, InsertTrip, Tables, TripDetail } from '@/types';
  import type { SelectOption } from '@/types/helpers';
  import '@vuepic/vue-datepicker/dist/main.css';

  definePageMeta({ layout: 'page-layout' });

  const $route = useRoute();
  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const $cookie = useCookie('selectedTripId');
  const { data, pageLoading, selectedTripId } = storeToRefs($store);

  const tripOptions = computed(() => data.value.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  let identifier = 0;
  watch($cookie, (newValue) => {
    if (newValue && !$route.query?.trip) {
      identifier = Number(decrypt(newValue)) || 0;
      $store.fetchPlanningPage(identifier);
    }
  }, { immediate: true });

  onMounted(async () => {
    identifier = $route.query?.trip ? Number(decrypt($route.query.trip)) || 0 : identifier;
    await $store.fetchPlanningPage(identifier);
  });

  const isCreateTripDialogOpen = ref(false);
  const submitting = ref(false);
  const newTrip = reactive({
    name: '',
    description: '',
    starting_point: '',
    ending_point: '',
  });

  /**
   * Creates a new trip.
   */
  const dateRange = ref([]);
  const createTrip = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const payload: InsertTrip = {
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
        isCreateTripDialogOpen.value = false;
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

  /**
   * Leaves the current trip.
   */
  const leaveTrip = async () => {
    // TODO: implement
  };

  const datePicker = ref(null);
  const format = (dates: Date[]) => {
    const date1 = dayjs(dates[0])
      .format('MMM D, YYYY');
    const date2 = dates[1] ? dayjs(dates[1])
      .format('MMM D, YYYY') : '';
    return `${date1} to ${date2}`;
  };

  const handleSelectTrip = async (trip: { label: string, value: number }) => {
    const cookie = useCookie('selectedTripId');
    cookie.value = encrypt(trip.value);
  };

  useHead({
    title: 'Planning | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet planning page!',
      },
    ],
  });
</script>

<template>
  <div class="pb-8">
    <!-- Settings Row -->
    <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
      <div class="flex justify-center items-center gap-4">
        <div class="flex">
          <headless-menu
            as="div"
            class="inline-block relative text-left">
            <div>
              <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-4 py-2 rounded-md text-gray-500 hover:text-dark-grey text-sm w-full">
                <settings-icon class="h-6 w-6" />
              </headless-menu-button>
            </div>
            <zoom-transition>
              <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 focus:outline-none">
                <headless-menu-item
                  class="border-b border-gray-300"
                  disabled>
                  <p class="!text-xs block font-bold px-4 py-2 rounded-t-lg text-eyebrow text-grey">
                    Settings
                  </p>
                </headless-menu-item>
                <headless-menu-item @click="leaveTrip">
                  <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                    Leave Trip
                  </p>
                </headless-menu-item>
              </headless-menu-items>
            </zoom-transition>
          </headless-menu>
        </div>
        <gc-select
          :disabled="pageLoading"
          label="Selected Trip"
          :model-value="selectedTripId"
          name="selected-trip-select"
          :options="tripOptions"
          @update:model-value="handleSelectTrip" />
      </div>

      <gc-button
        label="New Trip"
        size="sm"
        @click="isCreateTripDialogOpen = true" />
    </div>

    <div class="grid lg:grid-cols-[65%,35%] grid-cols-1 gap-6">
      <div class="flex flex-col space-y-6">
        <!-- Pack Widget -->
        <pack-widget />

        <!-- Hike Details -->
        <hike-details-widget @create="(detail: TripDetail) => data.trip_details.push(detail)" />

        <!-- Trip Details -->
        <trip-details-widget @create="(detail: TripDetail) => data.trip_details.push(detail)" />
      </div>

      <div class="flex flex-col space-y-6">
        <!-- Friends -->
        <trip-friends-widget />

        <!-- Todos -->
        <todos-widget />

        <!-- Shopping List -->
        <shopping-list-widget />

        <!-- Poll -->
        <poll-widget />
      </div>
    </div>

    <!-- Modals -->
    <!-- 1. Create Trip Dialog -->
    <gc-modal
      :is-open="isCreateTripDialogOpen"
      title="Create a New Trip"
      @handle-cancel="isCreateTripDialogOpen = false">
      <template #default>
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
            @click="isCreateTripDialogOpen = false" />
          <gc-button
            :disabled="submitting"
            label="Create"
            size="sm"
            @click="createTrip" />
        </div>
      </template>
    </gc-modal>
    <!-- 2. Walkthrough -->
    <!-- 3. Create Poll Dialog -->
    <!-- 4. Alert Dialog -->
  </div>
</template>
