<script lang='ts' setup>
  import dayjs from 'dayjs';
  import type { ForumPost } from '@/types/helpers';

  interface Props {
    post: ForumPost;
    hasForumAccess: boolean;
  }

  const props = defineProps<Props>();

  const avatarSrc = computed(() => {
    const config = useRuntimeConfig();
    return `${config.public.forumsUrl}/${props.post.avatar_template.replace('{size}', '50')}`;
  });
</script>

<template>
  <a
    class="bg-white flex items-center gap-4 p-2 rounded-2xl"
    :class="{' hover:bg-gray-100 duration-150 ease-snap transition cursor-pointer': hasForumAccess }"
    :href="hasForumAccess ? `${$config.public.forumsUrl}/t/${post.topic_slug}` : undefined"
    target="_blank">
    <span
      class="h-3 rounded-full w-3"
      :style="{ backgroundColor: `#${post.categoryColor}`}" />
    <img
      class="h-12 rounded-full w-12"
      :src="avatarSrc">
    <div class="flex grow flex-col">
      <div class="flex items-center gap-4">
        <p class="!font-bold text-dark-grey">
          {{ truncate(post.topic_title, 25) }}
        </p>
        <p class="text-gray-400 text-right text-sm">
          {{ dayjs(post.created_at).format('MMM DD, YYYY') }}
        </p>
      </div>
      <p class="text-base">
        {{ truncate(post.raw, 50) }}
      </p>
    </div>
    <div class="flex justify-end flex-col">
      <p class="text-grey text-right text-sm">
        {{ post.reply_count }} read{{ post.reply_count !== 1 ? 's' : '' }}
      </p>
      <p class="text-grey text-right text-sm">
        {{ post.username }}
      </p>
    </div>
  </a>
</template>
