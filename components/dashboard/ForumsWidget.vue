<script lang='ts' setup>
  import { MessagesSquareIcon } from 'lucide-vue-next';
  import type { ForumLatestPosts, ForumPost } from '@/types/helpers';
  import { SubscriptionLevel } from '@/types';
  import { LockIcon } from 'lucide-vue-next';

  interface ForumResponse {
    body: ForumLatestPosts;
  }
  
  const loading = ref(false);
  const posts = ref<ForumPost[] | undefined>(undefined);

  // fetch latest posts from forums api
  const fetchForums = async () => {
    loading.value = true;
    try {
      const { data, error } = await useFetch('/api/forumPosts');

      if (error.value || !data.value?.data.latest_posts.length) {
        throw new Error('Error fetching forum posts');
      }

      posts.value = data.value.data.latest_posts;
    } catch (err) {
      posts.value = undefined;
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => fetchForums());

  const $store = useUserStore();
  const hasForumAccess = computed(() => {
    return $store.profile?.subscription_level === SubscriptionLevel.ANNUAL || $store.profile?.subscription_level === SubscriptionLevel.MONTHLY || $store.profile?.subscription_level === SubscriptionLevel.LIFE;
  });
</script>

<template>
  <div class="bg-white p-4 rounded-4xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <messages-square-icon class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Latest From The Community
      </p>
      <lock-icon
        v-if="!hasForumAccess"
        v-tippy="{ content: 'Upgrade to access the forums', placement: 'top', offset: [0, 10]}"
        class="h-4 ml-2 text-gray-400 w-4" />
    </div>
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" /> 
    <div v-else>
      <ul
        v-if="posts"
        class="divide-light-grey divide-y">
        <forum-post
          v-for="post in posts"
          :key="post.id"
          :has-forum-access="hasForumAccess"
          :post="post" />
      </ul>
      <div v-else>
        <p class="text-base text-center">
          Error occurred fetching latest forum posts.
        </p>
      </div>
    </div>
  </div>
</template>
