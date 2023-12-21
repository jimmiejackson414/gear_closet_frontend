<script lang='ts' setup>
  import type { Database, Friend, Trip, TripFriend } from '@/types';

  interface DashboardData {
    friends: Friend[];
    trips: Trip[];
    trip_friends: TripFriend[];
  }

  const $store = useAppStore();
  const loading = ref(false);
  const data: DashboardData = reactive({
    friends: [],
    trips: [],
    trip_friends: [],
  });

  const fetchDashboard = async () => {
    const supabase = useSupabaseClient<Database>();
    loading.value = true;

    try {
      const user = useSupabaseUser();

      const { data: pageData, error } = await supabase.from('profiles')
        .select('trip_friends(*), friends!friends_friend_id_fkey(*), trips(*)')
        .eq('id', user.value!.id)
        .single();

      if (!pageData || error) {
        $store.notifyNegative('An error occurred while loading your account.');
        loading.value = false;
        return;
      }

      data.friends = pageData.friends;
      data.trips = pageData.trips;
      data.trip_friends = pageData.trip_friends;
    } catch (err) {
      console.error({ err });
    } finally {
      loading.value = false;
    }
  };

  await fetchDashboard();

  definePageMeta({
    layout: 'dashboard-layout',
  });

  useHead({
    title: 'Dashboard | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet dashboard!',
      },
    ],
  });
</script>

<template>
  <div class="container-full mx-auto px-4 lg:px-12 py-6">
    <div class="grid grid-cols-12 gap-8">
      <div class="bg-gray-100 col-span-12 md:col-span-9 grow px-6 py-8 rounded-4xl shadow-light">
        <gc-navbar page-title="Dashboard" />
        <div class="grid grid-cols-12 gap-8 mt-8">
          <div class="col-span-12 md:col-span-8">
            <invitations-widget
              :data="data.trip_friends"
              :loading="loading" />
          </div>
          <div class="col-span-12 md:col-span-4">
            <div class="bg-white px-4 py-8 rounded-4xl shadow-light">
              <gc-skeleton
                v-if="loading"
                avatar
                :lines="3" />
              <p v-else>
                Second widget
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white col-span-12 md:col-span-3 px-4 py-8 rounded-4xl shadow-light">
        <gc-skeleton
          v-if="loading"
          :lines="2" /> 
        <p v-else>
          Side
        </p>
      </div>
    </div>
  </div>
</template>
