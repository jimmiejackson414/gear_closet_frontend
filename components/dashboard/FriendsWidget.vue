<script lang='ts' setup>
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
  <card
    class="h-full px-8 py-4 rounded-3xl"
    data-testid="friends-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center mb-4 py-4">
        <icon-users class="h-6 mr-6 text-primary dark:text-primary-foreground w-6" />
        <nuxt-link
          class="font-bold! duration-150 ease-in-out text-base hover:text-primary"
          :to="{ name: 'friends' }">
          Friends ({{ data.length }})
        </nuxt-link>
      </div>
      <ul class="-space-x-3 flex">
        <template v-if="computedUsers.length">
          <li
            v-for="user in computedUsers"
            :key="user.id">
            <gc-avatar
              border
              :initials="initials(user)"
              :url="buildImageSrc(user.image)" />
          </li>
          <nuxt-link
            v-if="data.length > 5"
            class="bg-muted-foreground hover:bg-muted-foreground/75 border-2 border-white flex justify-center items-center shrink-0 font-medium h-12 min-w-12 rounded-full text-white text-xs w-12 z-10"
            data-testid="friends-widget-more"
            :to="{ name: 'friends' }">
            {{ `+${data.length - 5}` }}
          </nuxt-link>
        </template>
        <template v-else>
          <div class="flex justify-center items-center flex-col">
            <typography
              class="mb-4 text-center"
              variant="p">
              You haven't connected with any friends yet!
            </typography>
            <nuxt-link :to="{ name: 'friends' }">
              <button-root size="sm">
                Get Started
              </button-root>
            </nuxt-link>
          </div>
        </template>
      </ul>
    </div>
  </card>
</template>
