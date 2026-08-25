<script lang='ts' setup>
  import { tripFriendStatusLabel, tripFriendStatusVariant } from '@/utils/tripFriends';

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const data = toRef($store, 'data');
  const pageLoading = toRef($store, 'pageLoading');

  const isInviteModalOpen = ref(false);
  const resendingEmail = ref<string | null>(null);

  const canInvite = computed(() =>
    !pageLoading.value && $store.canEditSelectedTrip);

  const pendingInvites = computed(() => data.value.pending_invites ?? []);
  const hasPeople = computed(() =>
    data.value.friends.length > 0 || pendingInvites.value.length > 0);

  const canViewFriendPack = (friend: { status: string; profile_id: string }) =>
    friend.status === 'ACCEPTED' && Boolean(friend.profile_id);

  const isViewingFriendPack = (profileId: string) =>
    $store.viewedPackProfileId === profileId;

  const resendInvite = async (email: string) => {
    const tripId = Number($store.selectedTripId);
    if (!tripId || resendingEmail.value) return;

    try {
      resendingEmail.value = email;
      await $fetch(`/api/trips/${tripId}/invites`, {
        method: 'POST',
        body: { emails: [email] },
      });
      $appStore.notifyPositive('Invites sent.');
      void $store.fetchPlanningPage(tripId);
    } catch (err) {
      const status = typeof err === 'object' && err && 'statusCode' in err
        ? Number((err as { statusCode: unknown }).statusCode)
        : 0;
      $appStore.notifyNegative(
        status === 429
          ? 'Too many invites. Try again later.'
          : 'There was an error inviting friends to the trip.',
      );
    } finally {
      resendingEmail.value = null;
    }
  };
</script>

<template>
  <card class="px-4 sm:px-8 py-4 rounded-3xl">
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
    <gc-empty-state v-else-if="!hasPeople">
      <p class="mb-4 text-base">
        {{ $store.canEditSelectedTrip ? "You haven't added any friends to this trip yet!" : 'No friends on this trip yet.' }}
      </p>
      <p
        v-if="$store.canEditSelectedTrip"
        class="mb-4 text-muted-foreground text-sm">
        Invite from Friends or by email.
      </p>
      <button-root
        v-if="$store.canEditSelectedTrip"
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
        :key="`friend-${friend.id}`"
        class="flex items-center gap-3">
        <button
          v-if="canViewFriendPack(friend)"
          v-tippy="{
            content: isViewingFriendPack(friend.profile_id) ? 'Showing this pack' : 'View pack',
            placement: 'top',
          }"
          :aria-label="isViewingFriendPack(friend.profile_id)
            ? `Showing ${friend.friend_profile ? friendlyUsername(friend.friend_profile) : 'friend'}'s pack`
            : `View ${friend.friend_profile ? friendlyUsername(friend.friend_profile) : 'friend'}'s pack`"
          :aria-pressed="isViewingFriendPack(friend.profile_id)"
          class="rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0"
          :class="isViewingFriendPack(friend.profile_id) ? 'ring-2 ring-primary ring-offset-2' : ''"
          data-testid="trip-friend-pack-avatar"
          type="button"
          @click="$store.viewTripPack(friend.profile_id)">
          <gc-avatar
            :initials="initials(friend.friend_profile)"
            size="sm"
            :url="friend.friend_profile?.image" />
        </button>
        <gc-avatar
          v-else
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
      <li
        v-for="invite in pendingInvites"
        :key="`pending-${invite.id}`"
        class="flex items-center gap-3">
        <div class="flex justify-center items-center bg-muted rounded-full size-8 text-muted-foreground shrink-0">
          <icon-mail
            aria-hidden="true"
            class="size-4" />
        </div>
        <div class="flex flex-1 justify-between items-center gap-2 min-w-0">
          <typography class="font-medium truncate">
            {{ invite.email }}
          </typography>
          <div class="flex items-center gap-2 shrink-0">
            <badge variant="secondary">
              Pending
            </badge>
            <button-root
              v-if="canInvite"
              data-testid="trip-invite-resend"
              :disabled="resendingEmail === invite.email"
              :loading="resendingEmail === invite.email"
              size="sm"
              type="button"
              variant="outline"
              @click="resendInvite(invite.email)">
              Resend
            </button-root>
          </div>
        </div>
      </li>
    </ul>
  </card>

  <!-- Invite Friends Modal -->
  <lazy-invite-friends-dialog
    :is-open="isInviteModalOpen"
    @on-close="isInviteModalOpen = false" />
</template>
