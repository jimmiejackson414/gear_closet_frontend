<script lang='ts' setup>
  import type { ForumCategory, ForumPost } from '@/types/helpers';

  interface Props {
    data: {
      categories: ForumCategory[];
      latest_posts: ForumPost[];
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
  <card class="rounded-3xl p-4 px-8">
    <div class="flex items-center justify-start py-4">
      <icon-messages-square class="mr-6 size-6 text-primary dark:text-primary-foreground" />
      <p class="text-base !font-bold">
        Latest From The Community
      </p>
      <icon-lock
        v-if="!$store.isPaidMember"
        v-tippy="{ content: 'Upgrade to access the forums', placement: 'top', offset: [0, 10] }"
        class="ml-2 size-4 text-gray-400" />
    </div>
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div
        v-if="data.latest_posts.length"
        class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-0">
        <div class="border-r border-gray-200 pr-8">
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
            class="grid grid-cols-[auto,1fr] items-center gap-4 rounded-2xl border border-gray-200 p-4">
            <span
              class="size-3 rounded-full"
              :style="{ backgroundColor: `#${category.color}` }" />
            <div class="flex flex-col justify-center">
              <typography class="!font-bold">
                {{ category.name }}
              </typography>
              <typography class="text-muted-foreground">
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
