<script lang='ts' setup>
  import { MessagesSquareIcon } from 'lucide-vue-next';
  import type { ForumCategory, ForumPost } from '@/types/helpers';
  import { SubscriptionLevel } from '@/types';
  import { LockIcon } from 'lucide-vue-next';

  interface ForumResponse {
    latest_posts: ForumPost[];
    categories: ForumCategory[];
  }
  
  const loading = ref(false);
  const posts = ref<ForumPost[]>([]);
  const categories = ref<ForumCategory[]>([]);

  // fetch latest posts from forums api
  const fetchForums = async () => {
    loading.value = true;
    try {
      const { data, error } = await useFetch<ForumResponse>('/api/forumPosts');

      if (error.value) {
        throw new Error('Error fetching forum posts');
      }

      if (data.value) {
        posts.value = data.value.latest_posts.map(post => {
          const category = data.value!.categories.find(category => category.id === post.category_id);
          return {
            ...post,
            categoryColor: category ? category.color : 'bg-info',
          };
        });
        categories.value = data.value?.categories || [];
      }
    } catch (err) {
      posts.value = [];
      categories.value = [];
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
      <div
        v-if="posts.length"
        class="grid lg:grid-cols-2 grid-cols-1 gap-8 lg:gap-0">
        <div class="border-gray-200 border-r pr-8">
          <forum-post
            v-for="post in posts"
            :key="post.id"
            :has-forum-access="hasForumAccess"
            :post="post" />
        </div>
        <div class="grid grid-cols-2 gap-4 pl-8">
          <div
            v-for="category in categories"
            :key="category.id"
            class="border border-gray-200 grid grid-cols-[auto,1fr] gap-4 items-center p-4 rounded-2xl">
            <span
              class="h-3 rounded-full w-3"
              :style="{ backgroundColor: `#${category.color}` }" />
            <div class="flex justify-center flex-col">
              <p class="!font-bold">
                {{ category.name }}
              </p>
              <p class="text-grey">
                {{ category.topic_count }} topics
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-base text-center">
          Error occurred fetching forum posts.
        </p>
      </div>
    </div>
  </div>
</template>
