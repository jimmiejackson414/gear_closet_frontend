<script lang='ts' setup>
  import { FORUMS_COMING_SOON, FORUMS_UPGRADE_PATH } from '@/utils/forums';
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
  const NuxtLink = resolveComponent('NuxtLink');

  const forumsComingSoonTippy = {
    content: FORUMS_COMING_SOON,
    offset: [0, 10],
    placement: 'top' as const,
    touch: false,
  };
</script>

<template>
  <card class="p-4 sm:px-8 rounded-3xl">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-4">
      <div class="flex items-center min-w-0">
        <icon-messages-square class="mr-4 sm:mr-6 w-6 h-6 text-primary dark:text-primary-foreground shrink-0" />
        <typography class="font-bold!">
          Latest From The Community
        </typography>
        <icon-lock
          v-if="!$store.isPaidMember"
          v-tippy="{ content: 'Upgrade to access the forums', placement: 'top', offset: [0, 10] }"
          class="ml-2 w-4 h-4 text-gray-400 shrink-0" />
      </div>
      <span
        v-if="$store.isPaidMember"
        v-tippy="forumsComingSoonTippy"
        class="self-center sm:self-auto shrink-0"
        data-testid="forums-open-button">
        <button-root
          disabled
          size="sm"
          type="button"
          variant="outline">
          <span class="sm:hidden">{{ FORUMS_COMING_SOON }}</span>
          <span class="hidden sm:inline">Open forums</span>
        </button-root>
      </span>
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
      <div class="gap-8 lg:gap-0 grid grid-cols-1 lg:grid-cols-2 min-w-0">
        <div class="lg:pr-8 lg:border-gray-200 lg:border-r min-w-0">
          <forum-post
            v-for="post in data.latest_posts"
            :key="post.id"
            :post="post" />
        </div>
        <div class="gap-3 sm:gap-4 grid grid-cols-2 lg:pl-8 min-w-0">
          <component
            :is="$store.isPaidMember ? 'div' : NuxtLink"
            v-for="category in data.categories"
            :key="category.id"
            v-tippy="$store.isPaidMember ? forumsComingSoonTippy : undefined"
            :aria-label="$store.isPaidMember ? FORUMS_COMING_SOON : `Upgrade to open ${category.name}`"
            class="items-center gap-3 sm:gap-4 grid grid-cols-[auto_1fr] p-3 sm:p-4 border border-gray-200 rounded-2xl min-w-0"
            :class="$store.isPaidMember
              ? 'cursor-default'
              : 'hover:bg-gray-100 transition duration-150 ease-out'"
            :to="$store.isPaidMember ? undefined : FORUMS_UPGRADE_PATH">
            <span
              class="rounded-full w-3 h-3 shrink-0"
              :style="{ backgroundColor: `#${category.color}` }" />
            <div class="flex flex-col justify-center min-w-0">
              <typography class="font-bold! truncate">
                {{ category.name }}
              </typography>
              <typography class="text-muted-foreground">
                {{ category.topic_count }} topics
              </typography>
            </div>
          </component>
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
        <span v-tippy="forumsComingSoonTippy">
          <button-root
            disabled
            size="sm"
            type="button"
            variant="outline">
            <span class="sm:hidden">{{ FORUMS_COMING_SOON }}</span>
            <span class="hidden sm:inline">Open forums</span>
          </button-root>
        </span>
      </template>
    </div>
  </card>
</template>
