<script lang='ts' setup>
  import type { ExtendedFriend } from '@/types/helpers';

  interface Props {
    friend: ExtendedFriend;
  }

  defineProps<Props>();
</script>

<template>
  <nuxt-link
    class="bg-white duration-200 ease-snap max-w-[200px] my-4 px-8 py-4 rounded-4xl shadow-light hover:shadow-xl transition w-full"
    :to="{ name: 'p-friends-slug', params: { slug: friend.friend.id } }">
    <div class="flex justify-center items-center flex-col">
      <gc-avatar
        :initials="initials(friend.friend)"
        size="xl"
        :url="buildImageSrc(friend.friend.image)" />
      <div class="flex items-center flex-col mt-4">
        <p class="font-bold text-center text-dark-grey">
          {{ friendlyUsername(friend.friend, { includeTrailName: true }) }}
        </p>
      </div>
    </div>
  </nuxt-link>
</template>
