<script lang='ts' setup>
  import type { ExtendedFriend } from '@/types/helpers';

  interface Props {
    friend: ExtendedFriend;
  }

  defineProps<Props>();
</script>

<template>
  <nuxt-link :to="{ name: 'p-friends-slug', params: { slug: friend.friend?.id } }">
    <card class="my-4 flex w-full max-w-[200px] flex-col items-center justify-center rounded-3xl px-8 py-4">
      <gc-avatar
        :initials="initials(friend.friend)"
        size="xl"
        :url="buildImageSrc(friend.friend.image)" />
      <div class="mt-4 flex flex-col items-center">
        <typography class="text-center font-bold">
          {{ friendlyUsername(friend.friend, { includeTrailName: true }) }}
        </typography>
      </div>
    </card>
  </nuxt-link>
</template>
