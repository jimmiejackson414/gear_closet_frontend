<script lang='ts' setup>
  import type { Database, Tables } from '@/types';
  import type { ExtendedFriend, ExtendedTripFriend, ForumCategory, ForumPost } from '@/types/helpers';

  definePageMeta({ layout: 'dashboard-layout' });

  interface DashboardData {
    friends: ExtendedFriend[];
    trips: Tables<'trips'>[];
    trip_friends: ExtendedTripFriend[];
  }

  export interface ForumResponse {
    latest_posts: ForumPost[];
    categories: ForumCategory[];
  }

  const $store = useAppStore();
  const loading = ref(true);
  const data: DashboardData = reactive({
    friends: [],
    trips: [],
    trip_friends: [],
  });

  const forumData = reactive<ForumResponse>({
    categories: [],
    latest_posts: [],
  });

  const fetchForumPosts = () => $fetch('/api/forumPosts');
  const { data: fData, error: fError } = await useAsyncData<ForumResponse>('forumPosts', fetchForumPosts);

  const fetchDashboard = async () => {
    const supabase = useSupabaseClient<Database>();
    loading.value = true;

    try {
      const user = useSupabaseUser();

      // fetch dashboard data from supabase
      const { data: pageData, error } = await supabase
        .rpc('get_dashboard_data', {
          p_user_id: user.value!.id,
        })
        .returns<DashboardData>();

      if (!pageData || error) {
        $store.notifyNegative('An error occurred while loading your account.');
        loading.value = false;
        return;
      }

      data.friends = pageData.friends;
      data.trips = pageData.trips;
      data.trip_friends = pageData.trip_friends;

      // fetch forum data from forums api
      await fetchForumPosts();
      if (fError.value || !fData.value) throw new Error('Error fetching forum posts');

      forumData.latest_posts = fData.value.latest_posts.map(post => {
        const category = fData.value!.categories.find(category => category.id === post.category_id);
        return {
          ...post,
          categoryColor: category ? category.color : 'bg-info',
        };
      });
      forumData.categories = fData.value?.categories || [];
    } catch (err: any) {
      //
    } finally {
      loading.value = false;
    }
  };

  await fetchDashboard();

  useHead({
    title: 'Dashboard',
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
      <card class="bg-charlie-brown col-span-12 md:col-span-9 grow px-6 py-8 rounded-3xl shadow-light">
        <gc-navbar page-title="Dashboard" />
        <div class="grid grid-cols-12 gap-y-4 md:gap-8 mt-8">
          <div class="col-span-12 md:col-span-8">
            <upcoming-trips-widget
              :data="data.trips"
              :loading="loading" />
          </div>
          <div class="col-span-12 md:col-span-4">
            <friends-widget
              :data="data.friends"
              :loading="loading" />
          </div>
        </div>
      </card>
      <div class="col-span-12 md:col-span-3">
        <invitations-widget
          :data="data.trip_friends"
          :loading="loading" />
      </div>
      <div class="col-span-12">
        <forums-widget
          :data="forumData"
          data-testid="forums-widget"
          :loading="loading" />
      </div>
    </div>
  </div>
</template>
