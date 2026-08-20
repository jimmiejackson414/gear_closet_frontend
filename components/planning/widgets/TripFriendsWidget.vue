<script lang='ts' setup>
  import { tripFriendStatusLabel, tripFriendStatusVariant } from '@/utils/tripFriends';

  const $store = usePlanningStore();
  const data = toRef($store, 'data');
  const pageLoading = toRef($store, 'pageLoading');

  const isInviteModalOpen = ref(false);

  const canInvite = computed(() =>
    !pageLoading.value && $store.isSelectedTripOwner);
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr] py-4">
      <icon-users-round class="mr-6 w-6 h-6 text-primary" />
      <p class="font-bold! text-base">
        Friends
      </p>
      <button-root
        v-if="canInvite"
        aria-label="Invite friends"
        class="justify-self-end rounded-full"
        data-testid="trip-friends-invite"
        size="icon"
        type="button"
        @click="isInviteModalOpen = true">
        <icon-plus aria-hidden="true" />
      </button-root>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.friends.length">
      <p class="mb-4 text-base">
        {{ $store.isSelectedTripOwner ? "You haven't added any friends to this trip yet!" : 'No friends on this trip yet.' }}
      </p>
      <p
        v-if="$store.isSelectedTripOwner"
        class="mb-4 text-muted-foreground text-sm">
        Invite people from your Friends list, or enter an email — they'll get an in-app invite if they have an account, or an email to join if they don't.
      </p>
      <button-root
        v-if="$store.isSelectedTripOwner"
        data-testid="trip-friends-empty-invite"
        size="sm"
        variant="outline"
        @click="isInviteModalOpen = true">
        Invite Friends
      </button-root>
    </gc-empty-state>
    <ul
      v-else
      class="flex flex-col gap-3">
      <li
        v-for="friend in data.friends"
        :key="friend.id"
        class="flex items-center gap-3">
        <gc-avatar
          :initials="initials(friend.friend_profile)"
          size="sm"
          :url="friend.friend_profile?.image" />
        <div class="flex flex-1 justify-between items-center gap-2 min-w-0">
          <typography class="font-medium truncate">
            {{ friend.friend_profile ? friendlyUsername(friend.friend_profile) : 'Unknown friend' }}
          </typography>
          <badge
            class="shrink-0"
            :variant="tripFriendStatusVariant(friend.status)">
            {{ tripFriendStatusLabel(friend.status) }}
          </badge>
        </div>
      </li>
    </ul>
  </card>

  <!-- Invite Friends Modal -->
  <lazy-invite-friends-dialog
    :is-open="isInviteModalOpen"
    @on-close="isInviteModalOpen = false" />
</template>
