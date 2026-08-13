<script lang='ts' setup>
  import type { Database, Tables } from '@/types';
  import { TripFriendStatus } from '@/types';

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const data = toRef($store, 'data');
  const pageLoading = toRef($store, 'pageLoading');

  const isInviteModalOpen = ref(false);
  const friendProfiles = ref<Record<string, Tables<'profiles'>>>({});

  const statusLabel = (status: string) => {
    switch (status) {
      case TripFriendStatus.ACCEPTED:
        return 'Accepted';
      case TripFriendStatus.DECLINED:
        return 'Declined';
      case TripFriendStatus.PENDING:
      default:
        return 'Pending';
    }
  };

  const fetchFriendProfiles = async (friends: Tables<'trip_friends'>[]) => {
    const missingIds = [...new Set(
      friends
        .map(f => f.profile_id)
        .filter(id => id && !friendProfiles.value[id]),
    )];
    if (!missingIds.length) return;

    try {
      const supabase = useSupabaseClient<Database>();
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', missingIds);

      if (error) {
        $appStore.notifyNegative(error.message || 'There was an error loading friend profiles.');
        return;
      }

      if (profiles?.length) {
        const next = { ...friendProfiles.value };
        for (const profile of profiles) {
          next[profile.id] = profile;
        }
        friendProfiles.value = next;
      }
    } catch {
      $appStore.notifyNegative('There was an error loading friend profiles.');
    }
  };

  watch(
    () => data.value.friends,
    (friends) => {
      void fetchFriendProfiles(friends ?? []);
    },
    { immediate: true, deep: true },
  );
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr] py-4">
      <icon-users-round class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold! text-base">
        Friends
      </p>
      <button-root
        v-if="!pageLoading && data.friends.length"
        class="justify-self-end rounded-full"
        size="icon"
        @click="isInviteModalOpen = true">
        <icon-plus />
      </button-root>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.friends.length">
      <p class="mb-4 text-base">
        You haven't added any friends to this trip yet!
      </p>
      <button-root
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
          :initials="initials(friendProfiles[friend.profile_id])"
          size="sm"
          :url="buildImageSrc(friendProfiles[friend.profile_id]?.image)" />
        <div class="flex flex-1 justify-between items-center gap-2 min-w-0">
          <typography class="font-medium truncate">
            {{ friendlyUsername(friendProfiles[friend.profile_id]) || 'Unknown friend' }}
          </typography>
          <badge
            class="shrink-0"
            :variant="friend.status === TripFriendStatus.ACCEPTED ? 'default' : 'secondary'">
            {{ statusLabel(friend.status) }}
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
