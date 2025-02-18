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
    class="h-full rounded-3xl px-8 py-4"
    data-testid="friends-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="mb-4 flex items-center justify-start py-4">
        <icon-users class="mr-6 size-6 text-primary dark:text-primary-foreground" />
        <nuxt-link
          class="text-base !font-bold duration-150 ease-in-out hover:text-primary"
          :to="{ name: 'friends' }">
          Friends <span class="font-normal text-muted-foreground">({{ data.length }})</span>
        </nuxt-link>
      </div>
      <ul class="flex -space-x-3">
        <template v-if="computedUsers.length">
          <li
            v-for="user in computedUsers"
            :key="user.id">
            <gc-avatar
              border
              :initials="initials(user)"
              :url="buildImageSrc(user.image)" />
            <nuxt-link
              v-if="data.length > 5"
              class="z-10 flex size-12 min-w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-text text-xs font-medium text-white hover:bg-text/75"
              data-testid="friends-widget-more"
              :to="{ name: 'friends' }">
              {{ `+${data.length - 5}` }}
            </nuxt-link>
          </li>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center">
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
