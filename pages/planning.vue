<script lang='ts' setup>
  import { SettingsIcon } from 'lucide-vue-next';
  import { decrypt } from '~/helpers/encryption';
  import { TripDetailType } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';
  import type { Database, Tables, Trip } from '@/types';
  import type { SelectOption } from '~/components/common/GcSelect.vue';

  export interface PlanningPageData {
    trips: Tables<'trips'>[];
    pack?: ExtendedPack;
    trip_details: Tables<'trip_details'>[];
    todos: Tables<'todos'>[];
    shopping_items: Tables<'shopping_list_items'>[];
    friends: Tables<'trip_friends'>[];
    poll?: Tables<'polls'>;
    errors?: string[];
  }

  const $store = useAppStore();
  const $route = useRoute();
  let data = reactive<PlanningPageData>({
    trips: [],
    pack: undefined,
    trip_details: [],
    todos: [],
    shopping_items: [],
    friends: [],
    poll: undefined,
    errors: undefined,
  });
  const selectedTrip = ref<Trip | undefined>(undefined);
  const tripOptions = computed(() => data.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);
  
  const loading = ref(false);
  /**
   * Fetches the planning page data.
   */
  const fetchPlanningPage = async () => {
    loading.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const tripId = $route.query?.trip && Number(decrypt($route.query.trip));
      const { data: pageData, error } = await supabase
        .rpc('get_planning_page_data', { p_trip_id: tripId || 0 })
        .returns<PlanningPageData>();

      if (pageData && !error) {
        data = pageData;

        // set selected trip if available
        const findSelectedTrip = pageData.trips.find(trip => trip.id === (tripId ? tripId : pageData.trips[0].id)) as Tables<'trips'>;
        selectedTrip.value = findSelectedTrip;
      }
    } catch (err: any) {
      $store.notifyNegative(err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await fetchPlanningPage();
    $store.loading = false;
  });

  const isSettingsOpen = ref(false);
  const settingsDropdown = ref<any | null>(null);
  onClickOutside(settingsDropdown, () => isSettingsOpen.value = false);

  const newTripModalOpen = ref(false);

  definePageMeta({
    layout: 'page-layout',
  });

  useHead({
    title: 'Planning | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet planning!',
      },
    ],
  });
</script>

<template>
  <div class="pb-8">
    <!-- Settings Row -->
    <div class="flex justify-end items-center gap-6 mb-8">
      <div class="flex justify-center items-center relative">
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
            <ul class="">
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
        label="Selected Trip"
        :model-value="selectedTrip?.id"
        name="selected-trip-select"
        :options="tripOptions" />
      <gc-button
        label="New Trip"
        size="sm"
        @click="newTripModalOpen = true" />
    </div>

    <div class="grid lg:grid-cols-[65%,35%] grid-cols-1 gap-6">
      <!-- Pack Widget -->
      <pack-widget
        :data="data.pack"
        :loading="loading" />

      <!-- Poll -->
      <poll-widget
        :data="data.poll"
        :loading="loading" />

      <!-- Hike Details -->
      <hike-details-widget
        :data="data"
        :loading="loading"
        :selected-trip="selectedTrip"
        @create="e => data.trip_details.unshift(e)" />

      <!-- Friends -->
      <trip-friends-widget
        :data="data.friends"
        :loading="loading" />

      <!-- Trip Details -->
      <trip-details-widget
        :data="data.trip_details?.filter(t => t.type === TripDetailType.TRIP) || []"
        :loading="loading" />

      <!-- Todos -->
      <todos-widget
        :data="data.todos"
        :loading="loading" />

      <div />

      <!-- Shopping List -->
      <shopping-list-widget
        :data="data.shopping_items"
        :loading="loading" />
    </div>

    <!-- Modals -->
    <!-- 1. Create Trip Dialog -->
    <!-- 2. Walkthrough -->
    <!-- 3. Create Poll Dialog -->
    <!-- 4. Alert Dialog -->
  </div>
</template>
