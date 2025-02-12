<script lang='ts' setup>
  import { type Database, type Tables, type TablesInsert, TripFriendStatus } from '@/types';
  import type { ExtendedTripFriend, SelectOption } from '@/types/helpers';

  type FriendSearchResult = Tables<'friends'> & {
    profile: Tables<'profiles'>;
  };

  interface Props {
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits<{
    (event: 'onClose'): void;
  }>();

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const $userStore = useUserStore();

  /**
   * Performs search for existing friends.
   */
  const searching = ref(false);
  const searchResults = ref<SelectOption[]>([]);
  const friendObjects = ref<Tables<'profiles'>[]>([]);
  const searchForFriends = async (searchTerm: string) => {
    try {
      searching.value = true;
      searchResults.value = [];
      const supabase = useSupabaseClient<Database>();
      const { data: friends, error } = await supabase
        .rpc('search_friends_with_profile', { search_term: searchTerm })
        .returns<FriendSearchResult[]>()
        .limit(10);

      if (friends?.length && !error) {
        // @ts-ignore
        friendObjects.value = friends.map(f => f.profile as Tables<'profiles'>);
        searchResults.value = friends.map(f => ({
          image: f.profile.image,
          label: friendlyUsername(f.profile as Tables<'profiles'>),
          profile_id: f.profile_id,
          value: f.id,
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
  const friendsToInvite = shallowRef<Tables<'profiles'>[]>([]);
  const inviteFriends = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();

      // invite friends
      const existingFriendsPayload = friendsToInvite.value.map((f: Tables<'profiles'>) => ({
        invited_by_id: user.value?.id as string,
        profile_id: f.id,
        status: TripFriendStatus.PENDING,
        trip_id: Number($store.selectedTripId),
      }));

      const { data: invitedFriends, error } = await supabase.from('trip_friends')
        .insert(existingFriendsPayload)
        .select();

      if (error) throw error;

      const invitedFriendIds = invitedFriends?.map(f => f.profile_id) || [];
      const { data: newFriends, error: newFriendsError } = await supabase.from('trip_friends')
        .select(`
          *,
          friend_profile:profiles!trip_friends_profile_id_fkey(*),
          friend_trip_packs:trip_packs(*)
        `)
        .in('id', invitedFriendIds)
        .returns<ExtendedTripFriend[]>();

      if (newFriendsError) throw newFriendsError;

      // send each friend a notification
      const notificationsPayload = friendsToInvite.value.map(f => ({
        content: `${friendlyUsername($userStore.profile)} invited you to a trip!`,
        profile_id: f.id,
        read_on_date: null,
        sender_id: user.value?.id,
        title: "You've been invited to a trip!",
      })) as TablesInsert<'notifications'>;

      await supabase.from('notifications')
        .insert(notificationsPayload);

      if (invitedFriends?.length && !error) {
        $appStore.notifyPositive('Successfully invited friends to trip!');
        $store.data.friends.push(...newFriends);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error inviting friends to the trip.');
    } finally {
      submitting.value = false;
      handleClose();
    }
  };

  const setFriendsPayload = (event: SelectOption[]) => {
    // Map the incoming event to actual friend objects
    const newFriends = event.map((f) => {
      return friendObjects.value.find((friend) => friend.id === f.profile_id) as Tables<'profiles'>;
    })
      .filter(Boolean) as Tables<'profiles'>[];

    // Add new friends to friendsToInvite, avoiding duplicates
    newFriends.forEach((newFriend) => {
      const alreadyExists = friendsToInvite.value.some((friend) => friend.id === newFriend.id);
      if (!alreadyExists) {
        friendsToInvite.value.push(newFriend);
      }
    });
  };

  const handleClose = () => {
    friendsToInvite.value = [];
    emits('onClose');
  };

  watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) friendsToInvite.value = [];
  });
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
      <div class="grid grid-cols-1 gap-6 justify-center items-center w-full">
        <div class="flex flex-col gap-2 w-full lg:w-1/2 lg:mx-auto">
          <label-root>
            Search for friends
          </label-root>
          <multiselect
            :loading="searching"
            multiple
            :options="searchResults"
            placeholder="Search"
            @clear-search="searchResults = []"
            @search="searchForFriends"
            @select="setFriendsPayload">
            <template #option="{ option }">
              <div class="flex items-center">
                <gc-avatar
                  class="mr-2"
                  size="xs"
                  :url="buildImageSrc(option!.image)" />
                <span>{{ option!.label }}</span>
              </div>
            </template>
          </multiselect>
        </div>
        <separator
          class="mx-auto w-full lg:w-14"
          label="or" />
        <nuxt-link
          class="mx-auto"
          :to="{ name: 'friends' }">
          <button-root
            variant="outline"
            @click="handleClose">
            Find new friends
          </button-root>
        </nuxt-link>
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
