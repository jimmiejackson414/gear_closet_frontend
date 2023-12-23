<script lang='ts' setup>
  import { SettingsIcon } from 'lucide-vue-next';
  import { decrypt } from '~/helpers/encryption';
  import { ResourceType } from '@/types';
  import type { Database, Friend, ShoppingListItem, Todo, Trip, TripDetail } from '@/types';
  import type { ExtendedPack, ExtendedPoll } from '@/types/helpers';
  import type { SelectOption } from '@/components/common/GcSelect.vue';

  interface PlanningPageData {
    trips: Trip[];
    pack: ExtendedPack | null;
    tripDetails: TripDetail[];
    todos: Todo[];
    shoppingItems: ShoppingListItem[];
    friends: Friend[];
    poll: ExtendedPoll | null;
    errors: string[] | null;
  }

  const $store = useAppStore();
  const $route = useRoute();
  const data = ref<PlanningPageData>({
    trips: [],
    pack: null,
    tripDetails: [],
    todos: [],
    shoppingItems: [],
    friends: [],
    poll: null,
    errors: null,
  });
  const selectedTrip = ref<string | number | undefined>(undefined);
  // @ts-ignore
  const tripOptions = computed(() => data.value.trips.map(t => ({ label: t.name, value: t.id })) as SelectOption[]); // TODO: Fix TS Error
  
  const fetchPlanningPage = async () => {
    const supabase = useSupabaseClient<Database>();

    try {
      const user = useSupabaseUser();

      // run trips query
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: true })
        .eq('profile_id', user.value!.id);
      console.log({ tripsData });

      if (!tripsData || error) { throw new Error('An error occurred while loading your trips.'); }
      data.value.trips = tripsData;

      const tripId = $route.query?.trip ? decrypt($route.query.trip) : tripsData[0]?.id;
      console.log({ tripId });
      
      const findSelectedTrip = tripsData.find(trip => trip.id === tripId) as Trip;
      selectedTrip.value = findSelectedTrip.id as number;

      // run packs query
      const { data: tripPacks, error: packError } = await supabase
        .from('trip_packs')
        .select(`
            pack:pack_id(*,
              categories(*,
                category_items(*,
                  item:item_id(*)
                )
              )
            )
          `)
        .match({ trip_id: tripId, profile_id: user.value!.id });
      console.log({ tripPacks, packError });

      if (packError) { throw new Error('An error occurred while loading your packs.'); }
      // @ts-ignore
      if (tripPacks.length) { data.pack = tripPacks[0].pack; } // TODO: Fix TS Error

      // run trip details query
      const { data: tripDetails, error: tripDetailsError } = await supabase
        .from('trip_details')
        .select('*')
        .order('created_at', { ascending: true })
        .eq('trip_id', tripId);
      console.log({ tripDetails });

      if (tripDetailsError) { throw new Error('An error occurred while loading your trip details.'); }
      data.value.tripDetails = tripDetails;

      // run todos query
      const { data: todos, error: todosError } = await supabase
        .from('todos')
        .select('*')
        .or(`and(resource_type.eq.${ResourceType.USER},profile_id.eq.${user.value?.id}),resource_type.eq.GROUP`)
        .order('created_at', { ascending: true })
        .eq('trip_id', tripId);
      console.log({ todos });

      if (todosError) { throw new Error('An error occurred while loading your todos.'); }
      data.value.todos = todos;

      // run shopping items query
      const { data: shoppingItems, error: shoppingItemsError } = await supabase
        .from('shopping_list_items')
        .select('*')
        .or(`and(resource_type.eq.${ResourceType.USER},profile_id.eq.${user.value?.id}),resource_type.eq.GROUP`)
        .order('created_at', { ascending: true })
        .eq('trip_id', tripId);
      console.log({ shoppingItems });

      if (shoppingItemsError) { throw new Error('An error occurred while loading your shopping items.'); }
      data.value.shoppingItems = shoppingItems;

      // run friends query
      const { data: friends, error: friendsError } = await supabase
        .from('trip_friends')
        .select(`
          *,
          trip:trip_id!inner(*),
          profile:profile_id!inner(*)
        `)
        .order('created_at', { ascending: true })
        .filter('profile.id', 'neq', user.value!.id)
        .eq('profile_id', user.value!.id);
      console.log({ friends });

      if (friendsError) { throw new Error('An error occurred while loading your friends.'); }
      
      // add trips that user has been invited to
      // for (const friend of friends) {
      //   if (!result.trips.find(trip => trip?.id === friend.trip.id)) {
      //     data.trips.push(friend.trip);
      //   }
      // }

      // add additional details to friends
      // if (friends?.length) {
      //   const updatedFriends = [];
      //   for (const u of friends) {
      //     const { data } = await supabase
      //       .from('trip_packs')
      //       .select(`
      //         pack:pack_id(*)
      //       `)
      //       .match({ trip_id: tripId, user_id: u.user.id })
      //       .single();

      //     updatedFriends.push({ ...u, pack: data ? data.pack : null });
      //   }
      //   data.friends = updatedFriends;
      // }

      // run poll query
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .select(
          `
            *,
            question:questions!inner(*,
              answers!answers_question_id_fkey(*)
            ),
            profile_answers(*)
          `,
        )
        .eq('trip_id', tripId)
        .maybeSingle();
      console.log({ poll });

      if (pollError) { throw new Error('An error occurred while loading your poll.'); }
      // @ts-ignore
      data.poll = { ...poll, question: poll?.question }; // TODO: Fix TS Error
    } catch (err: any) {
      console.log(`catch`, err);
      $store.notifyNegative(err);
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
  <div class="py-6">
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
        :model-value="selectedTrip"
        name="selected-trip-select"
        :options="tripOptions" />
      <gc-button
        label="New Trip"
        size="sm"
        @click="newTripModalOpen = true" />
    </div>

    <div class="grid lg:grid-cols-[65%,35%] grid-cols-1 gap-6">
      <!-- Pack Widget -->
      <pack-widget />

      <!-- Poll -->
      <poll-widget />

      <!-- Hike Details -->
      <hike-details-widget />

      <!-- Friends -->
      <trip-friends-widget />

      <!-- Trip Details -->
      <trip-details-widget />

      <!-- Todos -->
      <todos-widget />

      <div />

      <!-- Shopping List -->
      <shopping-list-widget />
    </div>

    <!-- Modals -->
    <!-- 1. Create Trip Dialog -->
    <!-- 2. Walkthrough -->
    <!-- 3. Create Poll Dialog -->
    <!-- 4. Alert Dialog -->
  </div>
</template>
