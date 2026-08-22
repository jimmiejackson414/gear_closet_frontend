<script lang='ts' setup>
  import dayjs from 'dayjs';
  import { forumsAppPath } from '@/utils/forums';
  import type { ForumPost } from '@/types/forum';

  interface Props {
    post: ForumPost;
    hasForumAccess: boolean;
  }

  const props = defineProps<Props>();

  const $config = useRuntimeConfig();
  const NuxtLink = resolveComponent('NuxtLink');
  const avatarSrc = computed(() => {
    return `${$config.public.forumsUrl}/${props.post.avatar_template.replace('{size}', '50')}`;
  });
</script>

<template>
  <component
    :is="hasForumAccess ? NuxtLink : 'div'"
    class="flex items-center gap-4 bg-white p-2 rounded-2xl"
    :class="{ 'hover:bg-gray-100 duration-150 ease-out transition cursor-pointer': hasForumAccess }"
    :to="hasForumAccess ? forumsAppPath({ topic: post.topic_slug }) : undefined">
    <span
      class="rounded-full w-3 h-3"
      :style="{ backgroundColor: `#${post.categoryColor}` }" />
    <img
      class="rounded-full w-12 h-12"
      :src="avatarSrc">
    <div class="flex flex-col grow">
      <div class="flex items-center gap-4">
        <p class="font-bold! text-muted-foreground">
          {{ truncate(post.topic_title, 25) }}
        </p>
        <p class="text-gray-400 text-sm text-right">
          {{ dayjs(post.created_at).format('MMM DD, YYYY') }}
        </p>
      </div>
      <p class="text-base">
        {{ truncate(post.raw, 50) }}
      </p>
    </div>
    <div class="flex flex-col justify-end">
      <p class="text-muted-foreground text-sm text-right">
        {{ post.reply_count }} read{{ post.reply_count !== 1 ? 's' : '' }}
      </p>
      <p class="text-muted-foreground text-sm text-right">
        {{ post.username }}
      </p>
    </div>
  </component>
</template>
