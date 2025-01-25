<script lang='ts' setup>
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
      // TODO: Fix query. Currently returns two results when searching for "Bill", but first record has null profile and shouldn't be returned anyways
      const supabase = useSupabaseClient<Database>();
      // const orFilters = `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
      // console.log({ orFilters });
      const { data: friends, error } = await supabase
        .from('friends')
        // .select('*, profile:profiles!profile_id(*)')
        .select('*, profile:profiles!friends_profile_id_fkey(*)')
        .neq('profile_id', $store.selectedTrip?.profile_id)
        // .or(`profiles.first_name.ilike.%${searchTerm}%,profiles.last_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`)
        // .or(orFilters, { referencedTable: 'profiles' })
        .or(
          `profiles.first_name.ilike.%${searchTerm}%,profiles.last_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`,
        )
        .returns<FriendSearchResult[]>()
        .limit(10);

      if (friends?.length && !error) {
        // @ts-ignore
        friendObjects.value = friends.map(f => f.profile as Tables<'profiles'>);
        searchResults.value = friends.map(f => ({
          label: friendlyUsername(f.profile as Tables<'profiles'>),
          value: f.id,
          image: f.profile.image,
        }));
      }
    } catch (err) {
      console.log({ err });
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
      const notificationsPayload = friendsToInvite.value.map(f => ({
        title: "You've been invited to a trip!",
        content: `${friendlyUsername($userStore.profile)} invited you to a trip!`,
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
      return friendObjects.value.find((friend) => friend.id === f.value) as Tables<'profiles'>;
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
      <div class="grid grid-cols-[auto_1fr_auto] gap-6 items-center w-full">
        <div class="flex flex-col gap-2 w-fit">
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
        <separator
          class="mt-[22px]"
          label="or" />
        <nuxt-link
          class="mt-[22px]"
          :to="{ name: 'friends' }">
          <button-root
            variant="outline"
            @click="handleClose">
            <!-- <icon-plus-circle class="!size-max text-accent-alt dark:text-card-foreground" /> -->
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
