<script lang='ts' setup>
  import { MessagesSquareIcon } from 'lucide-vue-next';
  import type { ForumLatestPosts, ForumPost } from '@/types/helpers';
  
  const loading = ref(false);
  const posts = ref<ForumPost[] | undefined>(undefined);

  // fetch latest posts from forums api
  const fetchForums = async () => {
    loading.value = true;
    const runtimeConfig = useRuntimeConfig();
    console.log(runtimeConfig.forumsApiKey);
    try {
      const { data } = await $fetch<{ data: ForumLatestPosts }>(`${runtimeConfig.public.forumsUrl}/posts.json`, {
        headers: {
          'Api-Key': runtimeConfig.public.forumsApiKey,
          'Api-Username': runtimeConfig.public.forumsApiUsername,
        },
      });
      posts.value = data.latest_posts;
    } catch (err) {
      posts.value = undefined;
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => fetchForums());
</script>

<template>
  <div class="bg-white p-4 rounded-4xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <messages-square-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Latest From The Community
      </p>
    </div>
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" /> 
    <div v-else>
      <ul
        v-if="posts"
        class="divide-grey divide-y">
        <li>
          <!-- TODO -->
          Forum Post
        </li>
      </ul>
      <div v-else>
        <p class="text-base text-center">
          Error occurred fetching latest forum posts.
        </p>
      </div>
    </div>
  </div>
</template>
