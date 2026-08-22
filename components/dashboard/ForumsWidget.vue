<script lang='ts' setup>
  import { FORUMS_UPGRADE_PATH, forumsAppPath } from '@/utils/forums';
  import type { ForumCategory, ForumPost } from '@/types/forum';

  interface Props {
    data?: {
      latest_posts: ForumPost[];
      categories: ForumCategory[];
    };
    loading: boolean;
    error?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => ({
      latest_posts: [],
      categories: [],
    }),
    error: false,
  });

  const $store = useUserStore();

  const categoryTo = (category: ForumCategory) =>
    ($store.isPaidMember
      ? forumsAppPath({ category: category.slug, categoryId: category.id })
      : FORUMS_UPGRADE_PATH);
</script>

<template>
  <card class="p-4 px-8 rounded-3xl">
    <div class="flex justify-start items-center py-4">
      <icon-messages-square class="mr-6 w-6 h-6 text-primary dark:text-primary-foreground" />
      <p class="font-bold! text-base">
        Latest From The Community
      </p>
      <icon-lock
        v-if="!$store.isPaidMember"
        v-tippy="{ content: 'Upgrade to access the forums', placement: 'top', offset: [0, 10] }"
        class="ml-2 w-4 h-4 text-gray-400" />
      <nuxt-link
        v-else
        class="ml-auto"
        :to="forumsAppPath()">
        <button-root
          size="sm"
          variant="outline">
          Open forums
        </button-root>
      </nuxt-link>
    </div>
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else-if="error">
      <typography class="text-center">
        Error occurred fetching forum posts.
      </typography>
    </div>
    <div v-else-if="data.latest_posts.length">
      <div
        v-if="!$store.isPaidMember"
        class="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 bg-muted/50 mb-6 p-4 rounded-2xl">
        <typography variant="small">
          Preview only — upgrade to open threads and post in the Gear Closet forums.
        </typography>
        <nuxt-link :to="FORUMS_UPGRADE_PATH">
          <button-root
            size="sm"
            variant="outline">
            Upgrade in Profile
          </button-root>
        </nuxt-link>
      </div>
      <div class="gap-8 lg:gap-0 grid grid-cols-1 lg:grid-cols-2">
        <div class="pr-8 border-gray-200 border-r">
          <forum-post
            v-for="post in data.latest_posts"
            :key="post.id"
            :has-forum-access="$store.isPaidMember"
            :post="post" />
        </div>
        <div class="gap-4 grid grid-cols-2 pl-8">
          <nuxt-link
            v-for="category in data.categories"
            :key="category.id"
            :aria-label="$store.isPaidMember ? `Open ${category.name} on the forums` : `Upgrade to open ${category.name}`"
            class="items-center gap-4 grid grid-cols-[auto_1fr] hover:bg-gray-100 p-4 border border-gray-200 rounded-2xl transition duration-150 ease-out"
            :to="categoryTo(category)">
            <span
              class="rounded-full w-3 h-3"
              :style="{ backgroundColor: `#${category.color}` }" />
            <div class="flex flex-col justify-center">
              <typography class="font-bold!">
                {{ category.name }}
              </typography>
              <typography class="text-muted-foreground">
                {{ category.topic_count }} topics
              </typography>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col items-center gap-3 py-4 text-center">
      <template v-if="!$store.isPaidMember">
        <typography>
          Forum previews will show here once the community has posts. Upgrade to join the conversation.
        </typography>
        <nuxt-link :to="FORUMS_UPGRADE_PATH">
          <button-root
            size="sm"
            variant="outline">
            Upgrade in Profile
          </button-root>
        </nuxt-link>
      </template>
      <template v-else>
        <typography>
          The community is warming up — be the first to start a discussion on the forums.
        </typography>
        <nuxt-link :to="forumsAppPath()">
          <button-root
            size="sm"
            variant="outline">
            Open forums
          </button-root>
        </nuxt-link>
      </template>
    </div>
  </card>
</template>
