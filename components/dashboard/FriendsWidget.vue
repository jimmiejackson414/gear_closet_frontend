<script lang='ts' setup>
  import { UsersIcon } from 'lucide-vue-next';
  import type { ExtendedFriend } from '@/types/helpers';

  interface Props {
    data: ExtendedFriend[];
    loading: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: false,
  });

  const computedUsers = computed(() => {
    return props.data.map((user) => user.friend)
      .slice(0, 5);
  });
</script>

<template>
  <div class="!bg-white card card-aside">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center mb-4 py-4">
        <users-icon class="h-6 mr-6 text-primary w-6" />
        <nuxt-link
          class="!font-bold duration-150 ease-in-out text-base hover:text-primary"
          :to="{ name: 'friends' }">
          Friends ({{ data.length }})
        </nuxt-link>
      </div>
      <div class="-space-x-3 flex">
        <div v-if="computedUsers.length">
          <gc-avatar
            v-for="user in computedUsers"
            :key="user.id"
            border
            :initials="initials(user)"
            :url="buildImageSrc(user.image)" />
          <nuxt-link
            v-if="computedUsers.length > 5"
            class="bg-dark-grey hover:bg-dark-grey/75 border-2 border-white flex justify-center items-center flex-shrink-0 font-medium h-12 min-w-12 rounded-full text-white text-xs w-12 z-10"
            :to="{ name: 'friends' }">
            {{ `+${computedUsers.length - 5}` }}
          </nuxt-link>
        </div>
        <div
          v-else
          class="flex justify-center items-center flex-col">
          <p class="mb-4 text-base text-center">
            You haven't connected with any friends yet!
          </p>
          <gc-button
            label="Get Started"
            size="sm"
            :to="{ name: 'friends' }" />
        </div>
      </div>
    </div>
  </div>
</template>
