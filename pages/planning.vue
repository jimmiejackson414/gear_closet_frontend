<script lang='ts' setup>
  import { SettingsIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '~/stores/planning';
  import type { Tables, TripDetail } from '@/types';
  import type { SelectOption } from '@/components/common/GcSelect.vue';

  const $route = useRoute();
  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip } = storeToRefs($store);

  const tripOptions = computed(() => data.value.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  onMounted(async () => {
    pageLoading.value = true;
    await $store.fetchPlanningPage($route.query);
    pageLoading.value = false;
  });

  const isSettingsOpen = ref(false);
  const settingsDropdown = ref<any | null>(null);
  onClickOutside(settingsDropdown, () => isSettingsOpen.value = false);

  const isCreateTripDialogOpen = ref(false);
  const submitting = ref(false);
  const newTrip = reactive({
    name: '',
    description: '',
    starting_point: '',
    ending_point: '',
    start_date: '',
    end_date: '',
  });

  /**
   * Creates a new trip.
   */
  const createTrip = () => {
    try {
      submitting.value = true;
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new trip.');
    } finally {
      submitting.value = false;
    }
  };

  definePageMeta({
    layout: 'page-layout',
  });

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
        <div class="flex relative">
          <button
            class="duration-150 ease-in-out font-medium inline-flex items-center relative text-center hover:text-dark-grey text-gray-500 text-sm focus:outline-none"
            type="button"
            @click="isSettingsOpen = !isSettingsOpen">
            <settings-icon class="h-6 w-6" />
          </button>
          <fade-transition>
            <div
              v-if="isSettingsOpen"
              ref="settingsDropdown"
              class="absolute top-full right-0 bg-white border divide-gray-100 duration-300 max-w-sm mt-2 rounded-lg shadow transition-all w-max z-20">
              <p class="block font-bold px-4 py-2 rounded-t-lg text-center text-dark-grey">
                Settings
              </p>
              <ul>
                <li class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-center text-dark-grey hover:bg-gray-100">
                  Create Poll
                </li>
                <li class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-center text-dark-grey hover:bg-gray-100">
                  Leave Trip
                </li>
              </ul>
            </div>
          </fade-transition>
        </div>
        <gc-select
          :disabled="pageLoading"
          label="Selected Trip"
          :model-value="selectedTrip?.id"
          name="selected-trip-select"
          :options="tripOptions" />
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
          <label
            class="flex flex-col font-bold gap-2 mb-4 text-grey text-sm"
            for="new-trip-name">
            Trip Name
            <gc-input
              v-model="newTrip.name"
              class="font-normal text-base w-full"
              :disabled="submitting"
              name="new-trip-name"
              placeholder="Mount Everest"
              required />
          </label>
          <!-- Description -->
          <!-- Starting point -->
          <!-- Ending Point -->
          <!-- Datepicker -->
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
