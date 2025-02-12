<script lang='ts' setup>
  import type { ForumCategory, ForumPost } from '@/types/helpers';

  interface Props {
    data: {
      latest_posts: ForumPost[];
      categories: ForumCategory[];
    };
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => ({
      categories: [],
      latest_posts: [],
    }),
  });

  const $store = useUserStore();
</script>

<template>
  <card class="p-4 px-8 rounded-3xl">
    <div class="flex justify-start items-center py-4">
      <icon-messages-square class="h-6 mr-6 text-primary dark:text-primary-foreground w-6" />
      <p class="!font-bold text-base">
        Latest From The Community
      </p>
      <icon-lock
        v-if="!$store.isPaidMember"
        v-tippy="{ content: 'Upgrade to access the forums', placement: 'top', offset: [0, 10] }"
        class="h-4 ml-2 text-gray-400 w-4" />
    </div>
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div
        v-if="data.latest_posts.length"
        class="grid lg:grid-cols-2 grid-cols-1 gap-8 lg:gap-0">
        <div class="border-gray-200 border-r pr-8">
          <forum-post
            v-for="post in data.latest_posts"
            :key="post.id"
            :has-forum-access="$store.isPaidMember"
            :post="post" />
        </div>
        <div class="grid grid-cols-2 gap-4 pl-8">
          <div
            v-for="category in data.categories"
            :key="category.id"
            class="border border-gray-200 grid grid-cols-[auto,1fr] gap-4 items-center p-4 rounded-2xl">
            <span
              class="h-3 rounded-full w-3"
              :style="{ backgroundColor: `#${category.color}` }" />
            <div class="flex justify-center flex-col">
              <typography class="!font-bold">
                {{ category.name }}
              </typography>
              <typography class="text-grey">
                {{ category.topic_count }} topics
              </typography>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <typography class="text-center">
          Error occurred fetching forum posts.
        </typography>
      </div>
    </div>
  </card>
</template>
