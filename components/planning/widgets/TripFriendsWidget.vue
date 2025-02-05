<script lang='ts' setup>
  import type { ExtendedTripFriend } from '@/types/helpers';
  const $store = usePlanningStore();

  const isInviteModalOpen = ref(false);
  const infoContent = computed(() => {
    const selectedTrip = $store.data.trips.find((trip) => trip.id === Number($store.selectedTripId));
    return `These are friends that have been specifically invited to your ${selectedTrip ? `${selectedTrip.name} trip` : 'trip'}.`;
  });

  const getTooltip = (friend: ExtendedTripFriend) => {
    if (!friend.profile.trip_pack?.pack) {
      return `${friendlyUsername(friend.profile)} hasn't selected a pack yet`;
    }
    return `${friendlyUsername(friend.profile)} currently has this pack set to private`;
  };
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <icon-users-round class="h-6 mr-6 text-primary w-6" />
      <div class="flex items-center gap-3">
        <p class="!font-bold text-base">
          Friends
        </p>
        <icon-info
          v-tippy="{ content: infoContent }"
          class="cursor-pointer h-4 text-muted-foreground w-4" />
      </div>
      <button-root
        v-if="!$store.pageLoading && $store.data?.friends.length"
        class="justify-self-end rounded-full"
        size="icon"
        variant="outline"
        @click="isInviteModalOpen = true">
        <icon-plus />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state v-else-if="!$store.pageLoading && !$store.data.friends.length">
      <p class="mb-4 text-base">
        You haven't invited any friends to this trip yet!
      </p>
      <button-root
        size="sm"
        variant="outline"
        @click="isInviteModalOpen = true">
        Invite Friends
      </button-root>
    </gc-empty-state>
    <div v-else>
      <ul class="flex space-x-3">
        <li
          v-for="friend in $store.data.friends"
          :key="friend.id">
          <template v-if="friend.profile.trip_pack?.pack && !friend.profile.trip_pack.pack.private">
            <nuxt-link :to="{ name: 'p-packs-slug', params: { slug: friend.profile.trip_pack.pack.slug } }">
              <gc-avatar
                v-tippy="{ content: friendlyUsername(friend.profile) }"
                border
                :initials="initials(friend.profile)"
                :url="buildImageSrc(friend.profile.image)" />
            </nuxt-link>
          </template>
          <template v-else>
            <gc-avatar
              v-tippy="{ content: getTooltip(friend) }"
              border
              :initials="initials(friend.profile)"
              :url="buildImageSrc(friend.profile.image)" />
          </template>
        </li>
      </ul>
    </div>
  </card>

  <!-- Invite Friends Modal -->
  <lazy-invite-friends-dialog
    :is-open="isInviteModalOpen"
    @on-close="isInviteModalOpen = false" />
</template>
