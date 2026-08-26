<script lang='ts' setup>
  import dayjs from 'dayjs';
  import type { ForumPost } from '@/types/forum';

  interface Props {
    post: ForumPost;
  }

  const props = defineProps<Props>();

  const $config = useRuntimeConfig();
  const avatarSrc = computed(() => {
    return `${$config.public.forumsUrl}/${props.post.avatar_template.replace('{size}', '50')}`;
  });
</script>

<template>
  <div class="flex items-center gap-4 bg-white p-2 rounded-2xl">
    <span
      class="rounded-full w-3 h-3"
      :style="{ backgroundColor: `#${post.categoryColor}` }" />
    <img
      class="rounded-full w-12 h-12"
      :src="avatarSrc">
    <div class="flex flex-col grow">
      <div class="flex items-center gap-4">
        <typography class="font-bold! text-muted-foreground">
          {{ truncate(post.topic_title, 25) }}
        </typography>
        <typography
          class="text-right"
          variant="muted">
          {{ dayjs(post.created_at).format('MMM DD, YYYY') }}
        </typography>
      </div>
      <typography>
        {{ truncate(post.raw, 50) }}
      </typography>
    </div>
    <div class="flex flex-col justify-end">
      <typography
        class="text-right"
        variant="muted">
        {{ post.reply_count }} read{{ post.reply_count !== 1 ? 's' : '' }}
      </typography>
      <typography
        class="text-right"
        variant="muted">
        {{ post.username }}
      </typography>
    </div>
  </div>
</template>
