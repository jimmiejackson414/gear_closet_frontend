<script lang='ts' setup>
  import type { Database, Tables } from '@/types';
  import type { ForumCategory, ForumPost } from '@/types/forum';
  import type { DashboardTripInvite, ExtendedFriend } from '@/types/planning';

  definePageMeta({ layout: 'dashboard-layout' });

  interface DashboardData {
    friends: ExtendedFriend[];
    trips: Tables<'trips'>[];
    trip_friends: DashboardTripInvite[];
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

  const fetchForumPosts = (): Promise<ForumResponse> =>
    $fetch<ForumResponse>('/api/forumPosts');

  const forumAsync = useAsyncData('forumPosts', fetchForumPosts);
  const { data: fData, error: fError, pending: forumPending } = forumAsync;

  const forumFetchError = computed(() => Boolean(fError.value));

  const syncForumData = () => {
    if (fError.value || !fData.value) {
      forumData.latest_posts = [];
      forumData.categories = [];
      return;
    }

    forumData.latest_posts = fData.value.latest_posts.map((post) => {
      const category = fData.value!.categories.find(c => c.id === post.category_id);
      return {
        ...post,
        categoryColor: category ? category.color : '94a3b8',
      };
    });
    forumData.categories = fData.value.categories || [];
  };

  watch([fData, fError], syncForumData, { immediate: true });

  const fetchDashboard = async () => {
    const supabase = useSupabaseClient<Database>();
    loading.value = true;

    try {
      const { data: pageData, error } = await supabase
        .rpc('get_dashboard_data');

      if (!pageData || error) {
        $store.notifyNegative('An error occurred while loading your account.');
        return;
      }

      const typedPageData = pageData as unknown as DashboardData;
      data.friends = typedPageData.friends ?? [];
      data.trips = typedPageData.trips ?? [];
      data.trip_friends = typedPageData.trip_friends ?? [];
    } catch (err) {
      console.error({ err });
      $store.notifyNegative('An error occurred while loading your dashboard.');
    } finally {
      loading.value = false;
    }
  };

  await Promise.all([
    Promise.resolve(forumAsync)
      .catch(() => undefined),
    fetchDashboard(),
  ]);

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
      <card class="bg-charlie-brown col-span-12 md:col-span-9 grow px-6 py-8 rounded-3xl shadow-xs">
        <gc-navbar page-title="Dashboard" />
        <div class="grid grid-cols-12 gap-8 mt-8">
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
          :loading="loading"
          @update:data="data.trip_friends = $event" />
      </div>
      <div class="col-span-12">
        <forums-widget
          :data="forumData"
          data-testid="forums-widget"
          :error="forumFetchError"
          :loading="forumPending" />
      </div>
    </div>
  </div>
</template>
