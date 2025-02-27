<script lang='ts' setup>
  import dayjs from 'dayjs';
  import type { ForumPost } from '@/types/helpers';

  interface Props {
    hasForumAccess: boolean;
    post: ForumPost;
  }

  const props = defineProps<Props>();

  const $config = useRuntimeConfig();
  const avatarSrc = computed(() => {
    return `${$config.public.forumsUrl}/${props.post.avatar_template.replace('{size}', '50')}`;
  });
</script>

<template>
  <a
    class="flex items-center gap-4 rounded-2xl bg-white p-2"
    :class="{ ' cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100': hasForumAccess }"
    :href="hasForumAccess ? `${$config.public.forumsUrl}/t/${post.topic_slug}` : undefined"
    target="_blank">
    <span
      class="size-3 rounded-full"
      :style="{ backgroundColor: `#${post.categoryColor}` }" />
    <img
      class="size-12 rounded-full"
      :src="avatarSrc">
    <div class="flex grow flex-col">
      <div class="flex items-center gap-4">
        <typography class="!font-bold">
          {{ truncate(post.topic_title, 25) }}
        </typography>
        <typography
          class="text-right text-gray-400"
          variant="small">
          {{ dayjs(post.created_at).format('MMM DD, YYYY') }}
        </typography>
      </div>
      <p class="text-base">
        {{ truncate(post.raw, 50) }}
      </p>
    </div>
    <div class="flex flex-col justify-end">
      <typography class="text-right text-sm text-muted-foreground">
        {{ post.reply_count }} read{{ post.reply_count !== 1 ? 's' : '' }}
      </typography>
      <typography class="text-right text-sm text-muted-foreground">
        {{ post.username }}
      </typography>
    </div>
  </a>
</template>
