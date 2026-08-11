<script lang="ts" setup>
  import { type Database, type Tables, type TablesInsert, TripFriendStatus } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  type FriendSearchResult = Tables<'friends'> & {
    profile: Tables<'profiles'>;
  };

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
   * Performs search for existing friends.
   */
  // const searchQuery = ref('');
  const searching = ref(false);
  const searchResults = ref<SelectOption[]>([]);
  const friendObjects = ref<Tables<'profiles'>[]>([]);
  const searchForFriends = async (searchTerm: string) => {
    try {
      searching.value = true;
      const supabase = useSupabaseClient<Database>();
      // Nested `profile:profiles!profile_id(*)` select depth blows Volar (cascade: missing auto-imports).
      const { data: friendsData, error } = await (supabase
        .from('friends')
        .select('*, profile:profiles!profile_id(*)')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`, { referencedTable: 'profiles' })
        .neq('profile_id', $store.selectedTrip?.profile_id ?? null)
        .limit(10) as any) as { data: FriendSearchResult[] | null; error: unknown };

      if (friendsData?.length && !error) {
        friendObjects.value = friendsData.map(f => f.profile);
        searchResults.value = friendsData.map(f => ({
          label: friendlyUsername(f.profile),
          value: f.id,
          image: f.profile.image,
        }));
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error searching for friends.');
    } finally {
      searching.value = false;
    }
  };

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
        invited_by_id: user.value?.id as string,
      }));
      const { data: invitedFriends, error } = await supabase.from('trip_friends')
        .insert(existingFriendsPayload)
        .select();

      // send each friend a notification
      // Pinia profile state is a deep supabase join type; erase before use.
      const inviter = ($userStore as any).profile as Tables<'profiles'> | null;
      const notificationsPayload = friendsToInvite.value.map((f: Tables<'profiles'>) => ({
        title: "You've been invited to a trip!",
        content: `${friendlyUsername(inviter)} invited you to a trip!`,
        read_on_date: null,
        profile_id: f.id,
        sender_id: user.value?.id,
      })) as TablesInsert<'notifications'>;

      await supabase.from('notifications')
        .insert(notificationsPayload);

      if (invitedFriends?.length && !error) {
        $appStore.notifyPositive('Successfully invited friends to trip!');
        $store.data.friends.push(...invitedFriends);
      }
    } catch (err) {
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
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>
          Invite Friends
        </dialog-title>
        <dialog-description>
          Invite existing friends to your trip and get started planning!
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
          @search="searchForFriends"
          @select="setFriendsPayload">
          <template #option="{ option }">
            <div class="flex items-center">
              <gc-avatar
                class="mr-2"
                size="xs"
                :src="buildImageSrc(option.image)" />
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
