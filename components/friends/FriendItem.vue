<script lang='ts' setup>
  import type { ExtendedFriend } from '@/types/helpers';

  interface Props {
    friend: ExtendedFriend;
  }

  defineProps<Props>();
</script>

<template>
  <nuxt-link :to="{ name: 'p-friends-slug', params: { slug: friend.friend?.id } }">
    <card class="flex justify-center items-center flex-col max-w-[200px] my-4 px-8 py-4 rounded-3xl w-full">
      <gc-avatar
        :initials="initials(friend.friend)"
        size="xl"
        :url="buildImageSrc(friend.friend.image)" />
      <div class="flex items-center flex-col mt-4">
        <typography class="font-bold text-center">
          {{ friendlyUsername(friend.friend, { includeTrailName: true }) }}
        </typography>
      </div>
    </card>
  </nuxt-link>
</template>
