<script lang='ts' setup>
  import { decrypt } from '~/helpers/encryption';
  import { ResourceType } from '@/types';
  import type { Database, Friend, Pack, Poll, ShoppingListItem, Todo, Trip, TripDetail } from '@/types';

  interface PlanningPageData {
    trips: Trip[];
    pack: Pack | null;
    tripDetails: TripDetail[];
    todos: Todo[];
    shoppingItems: ShoppingListItem[];
    friends: Friend[];
    poll: Poll | null;
    errors: string[] | null;
  }

  const $store = useAppStore();
  const $route = useRoute();
  const loading = ref(false);
  const data = reactive<PlanningPageData>({
    trips: [],
    pack: null,
    tripDetails: [],
    todos: [],
    shoppingItems: [],
    friends: [],
    poll: null,
    errors: null,
  });
  
  const fetchPlanningPage = async () => {
    const supabase = useSupabaseClient<Database>();
    loading.value = true;

    try {
      const user = useSupabaseUser();
      console.log({ user });

      // run trips query
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: true })
        .eq('profile_id', user.value!.id);

      if (!tripsData || error) { throw new Error('An error occurred while loading your trips.'); }

      const tripId = $route.query?.trip ? decrypt($route.query.trip) : tripsData[0]?.id;
      console.log({ tripId });

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

      // if (packError) { throw new Error('An error occurred while loading your packs.'); }
      // if (tripPacks.length) { data.pack = tripPacks[0].pack; }

      // run trip details query
      // const { data: tripDetails, error: tripDetailsError } = await supabase
      //   .from('trip_details')
      //   .select('*')
      //   .order('created_at', { ascending: true })
      //   .eq('trip_id', tripId);
      // console.log({ tripDetails });

      // if (tripDetailsError) { throw new Error('An error occurred while loading your trip details.'); }
      // data.tripDetails = tripDetails;

      // run todos query
      // const { data: todos, error: todosError } = await supabase
      //   .from('todos')
      //   .select('*')
      //   .or(`and(resource_type.eq.${ResourceType.USER},user_id.eq.${user.value?.id}),resource_type.eq.GROUP`)
      //   .order('created_at', { ascending: true })
      //   .eq('trip_id', tripId);
      // console.log({ todos });

      // if (todosError) { throw new Error('An error occurred while loading your todos.'); }
      // data.todos = todos;

      // run shopping items query
      // const { data: shoppingItems, error: shoppingItemsError } = await supabase
      //   .from('shopping_list_items')
      //   .select('*')
      //   .or(`and(resource_type.eq.${ResourceType.USER},user_id.eq.${user.value?.id}),resource_type.eq.GROUP`)
      //   .order('created_at', { ascending: true })
      //   .eq('trip_id', tripId);
      // console.log({ shoppingItems });

      // if (shoppingItemsError) { throw new Error('An error occurred while loading your shopping items.'); }
      // data.shoppingItems = shoppingItems;

      // run friends query
      // const { data: friends, error: friendsError } = await supabase
      //   .from('trip_friends')
      //   .select(`
      //     *,
      //     trip:trip_id!inner(*),
      //     user:user_id!inner(*)
      //   `)
      //   .order('created_at', { ascending: true })
      //   .filter('user.id', 'neq', user.value!.id)
      //   .eq('user_id', user.value!.id);
      // console.log({ friends });

      // if (friendsError) { throw new Error('An error occurred while loading your friends.'); }
      
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
      // const { data: poll, error: pollError } = await supabase
      //   .from('polls')
      //   .select(
      //     `
      //       *,
      //       question:questions!inner(*,
      //         answers!answers_question_id_fkey(*)
      //       ),
      //       user_answers(*)
      //     `,
      //   )
      //   .eq('trip_id', tripId)
      //   .maybeSingle();
      // console.log({ poll });

      // if (pollError) { throw new Error('An error occurred while loading your poll.'); }
      // data.poll = { ...poll, question: poll?.question[0] };
    } catch (err: any) {
      console.log(`catch`, err);
      $store.notifyNegative(err);
      loading.value = false;
    } finally {
      loading.value = false;
    }
  };

  await fetchPlanningPage();

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
  <div>
    Planning Page
  </div>
</template>
