<script lang='ts' setup>
  import { IconSearch } from '#components';
  import { type Database, type Tables, TripFriendStatus } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const { data, pageLoading, selectedTripId, selectedTrip } = storeToRefs($store);

  const isInviteModalOpen = ref(false);
  const selectedFriend = ref<SelectOption | undefined>(undefined);
  const friendsToInvite = shallowRef<Tables<'profiles'>[]>([]);

  const emailsToInvite = ref<string[]>([]);

  /**
   * Performs search for existing friends.
   */
  const searchQuery = ref('');
  const searching = ref(false);
  const searchResults = ref<SelectOption[]>([]);
  const searchForFriends = debounce(async (searchTerm: string) => {
    try {
      searching.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: friends, error } = await supabase
        .from('friends')
        .select('*, profile:profiles!profile_id(*)')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`, { referencedTable: 'profiles' })
        .neq('profile_id', selectedTrip.value?.profile_id)
        .limit(10);

      if (friends?.length && !error) {
        searchResults.value = friends.map(f => ({
          label: friendlyUsername(f.profile[0] as Tables<'profiles'>),
          value: f.id,
        }));
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error searching for friends.');
    } finally {
      searching.value = false;
    }
  }, 500);

  /**
   * Invites friends to the trip
   */
  const submitting = ref(false);
  const inviteFriends = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const existingFriendsPayload = friendsToInvite.value.map((f: Tables<'profiles'>) => ({
        trip_id: Number(selectedTripId.value),
        profile_id: f.id,
        status: TripFriendStatus.PENDING,
        invited_by_id: user.value?.id,
      }));
      const { data: invitedFriends, error } = await supabase.from('trip_friends')
        .insert(existingFriendsPayload)
        .select();

      if (invitedFriends?.length && !error) {
        $appStore.notifyPositive('Successfully invited friends to trip!');
        data.value.friends.push(...invitedFriends);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error inviting friends to the trip.');
    } finally {
      submitting.value = false;
      isInviteModalOpen.value = false;
    }
  };
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="flex justify-start items-center py-4">
      <icon-users-round class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Friends
      </p>
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
    <div v-else>
      Display friends
    </div>
  </card>

  <!-- Invite Friends Modal -->
  <gc-modal
    :is-open="isInviteModalOpen"
    title="Invite Friends"
    @handle-cancel="isInviteModalOpen = false">
    <template #content>
      <p class="text-base text-gray">
        Invite existing friends to your trip and get started planning!
      </p>
      <div class="flex flex-col">
        <gc-autocomplete
          :disabled="searching || submitting"
          :loading="searching"
          :model-value="searchQuery"
          :nullable="true"
          :options="searchResults"
          placeholder="Search for a friend"
          :prepend-icon="IconSearch"
          @search="searchForFriends($event)"
          @select="selectedFriend = $event" />

        <p class="font-bold mt-6 text-eyebrow">
          Friends to invite:
        </p>

        <p
          v-if="!friendsToInvite.length && !emailsToInvite.length"
          class="text-base text-gray">
          You haven't added any friends to invite yet!
        </p>
        <ul
          v-else
          class="mt-2">
          <li
            v-for="friend in friendsToInvite"
            :key="friend.id"
            class="flex items-center gap-4">
            <gc-avatar
              :initials="initials(friend)"
              :url="buildImageSrc(friend.image)" />
            {{ friendlyUsername(friend as Tables<'profiles'>) }}
          </li>
          <li
            v-for="email in emailsToInvite"
            :key="email"
            class="flex items-center gap-4">
            {{ email }}
          </li>
        </ul>
      </div>
    </template>
    <template #actions>
      <button-root
        :disabled="submitting"
        size="sm"
        variant="secondary"
        @click="[isInviteModalOpen = false, friendsToInvite = []]">
        Cancel
      </button-root>
      <button-root
        :disabled="submitting || (!friendsToInvite.length && !emailsToInvite.length)"
        :loading="submitting"
        size="sm"
        @click="inviteFriends">
        Invite
      </button-root>
    </template>
  </gc-modal>
</template>
