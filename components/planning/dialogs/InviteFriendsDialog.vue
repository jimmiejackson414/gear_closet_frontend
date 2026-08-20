<script lang="ts" setup>
  import { TripFriendStatus, type Database, type Tables, type TablesInsert } from '@/types';
  import { NotificationKind } from '@/utils/notifications';
  import type { SelectOption } from '@/types/ui';

  interface Props {
    isOpen: boolean;
  }

  defineProps<Props>();
  const emits = defineEmits<{
    (event: 'onClose'): void;
  }>();

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const $userStore = useUserStore();

  /**
   * Escape LIKE wildcards so user input is matched literally.
   */
  const escapeIlikeTerm = (term: string) => term.replace(/[%_]/g, '\\$&');

  /**
   * Performs search for existing friends.
   */
  /** Friend results carry an avatar, rendered by the multiselect's option slot. */
  type FriendSelectOption = SelectOption & { image: string | null };

  const searching = ref(false);
  const searchResults = ref<FriendSelectOption[]>([]);
  const friendObjects = shallowRef<Tables<'profiles'>[]>([]);
  const searchForFriends = async (searchTerm: string) => {
    if (!searchTerm?.trim()) {
      searchResults.value = [];
      return;
    }

    try {
      searching.value = true;
      const supabase = useSupabaseClient<Database>();
      const escaped = escapeIlikeTerm(searchTerm.trim());
      const { data: friendsData, error } = await supabase
        .from('friends')
        .select('*, profile:profiles!profile_id(*)')
        .or(`first_name.ilike.%${escaped}%,last_name.ilike.%${escaped}%,email.ilike.%${escaped}%`, { referencedTable: 'profiles' })
        .neq('profile_id', $store.selectedTrip?.profile_id ?? null)
        .limit(10);

      if (error) {
        $appStore.notifyNegative('There was an error searching for friends.');
        return;
      }

      // The embedded profile is nullable, so drop any row it failed to resolve for.
      const profiles = (friendsData ?? [])
        .map(f => f.profile)
        .filter((p): p is NonNullable<typeof p> => p !== null);

      friendObjects.value = profiles;
      searchResults.value = profiles.map(p => ({
        label: friendlyUsername(p),
        value: p.id,
        image: p.image,
      }));
    } catch {
      $appStore.notifyNegative('There was an error searching for friends.');
    } finally {
      searching.value = false;
    }
  };

  const debouncedSearchForFriends = useDebounceFn(searchForFriends, 300);

  /**
   * Invites friends to the trip
   */
  const submitting = ref(false);
  const inviteFriends = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();

      // invite friends
      const existingFriendsPayload = friendsToInvite.value.map((f: Tables<'profiles'>) => ({
        trip_id: Number($store.selectedTripId),
        profile_id: f.id,
        status: TripFriendStatus.PENDING,
        invited_by_id: user.value?.sub as string,
      }));
      const { data: invitedFriends, error } = await supabase.from('trip_friends')
        .insert(existingFriendsPayload)
        .select();

      // send each friend a notification
      const notificationsPayload = friendsToInvite.value.map((f: Tables<'profiles'>) => ({
        title: NotificationKind.TRIP_INVITE,
        content: `${friendlyUsername($userStore.profile)} invited you to a trip!`,
        read_on_date: null,
        profile_id: f.id,
        sender_id: user.value?.sub,
      })) as TablesInsert<'notifications'>;

      await supabase.from('notifications')
        .insert(notificationsPayload);

      if (invitedFriends?.length && !error) {
        $appStore.notifyPositive('Successfully invited friends to trip!');
        const profilesById = new Map(friendsToInvite.value.map(profile => [profile.id, profile]));
        $store.data.friends.push(...invitedFriends.map(friend => ({
          ...friend,
          friend_profile: profilesById.get(friend.profile_id) ?? null,
        })));
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error inviting friends to the trip.');
      }
    } catch {
      $appStore.notifyNegative('There was an error inviting friends to the trip.');
    } finally {
      submitting.value = false;
      handleClose();
    }
  };

  const friendsToInvite = shallowRef<Tables<'profiles'>[]>([]);
  const setFriendsPayload = (event: SelectOption[]) => {
    friendsToInvite.value = event.map((f: SelectOption) => {
      return friendObjects.value.find((friend: Tables<'profiles'>) => friend.id === f.value) as Tables<'profiles'>;
    })
      .filter(Boolean) as Tables<'profiles'>[];
  };

  const handleClose = () => {
    friendsToInvite.value = [];
    emits('onClose');
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>
          Invite Friends
        </dialog-title>
        <dialog-description>
          Search people you already added as friends. To invite someone new, send a friend request on the Friends page first — email invites are coming soon.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-2 mt-4 w-full lg:max-w-sm">
        <label-root>
          Search for friends
        </label-root>
        <multiselect
          :loading="searching"
          :options="searchResults"
          placeholder="Abe Lincoln"
          @search="debouncedSearchForFriends"
          @select="setFriendsPayload">
          <template #option="{ option }">
            <div class="flex items-center">
              <gc-avatar
                class="mr-2"
                size="xs"
                :url="option.image" />
              <span>{{ option.label }}</span>
            </div>
          </template>
        </multiselect>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="inviteFriends">
          Invite
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
