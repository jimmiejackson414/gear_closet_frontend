<script lang='ts' setup>
  import { ArrowDownUpIcon, SearchIcon, UsersRoundIcon } from 'lucide-vue-next';
  import type { SelectOption } from '@/types/helpers';
  import { TripFriendStatus, type Database, type Profile, type InsertTripFriend } from '@/types';

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const { data, pageLoading, selectedTripId, selectedTrip } = storeToRefs($store);

  const isInviteModalOpen = ref(false);
  const selectedFriend = ref<SelectOption | undefined>(undefined);
  const friendsToInvite = ref<Profile[]>([]);

  const inviteByEmail = ref(false);
  const newEmail = ref<string | undefined>(undefined);
  const emailsToInvite = ref<string[]>([]);

  /**
   * Performs search for existing friends.
   */
  const searching = ref(false);
  const searchResults = ref<SelectOption[]>([]);
  const searchForFriends = debounce(async (searchTerm: string) => {
    try {
      searching.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: friends, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .neq('id', selectedTrip.value?.profile_id)
        .limit(10);

      if (friends?.length && !error) {
        searchResults.value = friends.map(f => ({
          label: friendlyUsername(f),
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
      const existingFriendsPayload = (friendsToInvite.value as Profile[]).map(f => ({
        trip_id: selectedTripId.value,
        profile_id: f.id,
        status: TripFriendStatus.PENDING,
        invited_by_id: user.value?.id,
      })) as InsertTripFriend[];
      
      const newFriendsPayload = emailsToInvite.value.map((email: string) => {
        const token = generateUniqueToken();
        // sendInvitationEmail(email, token); // TODO: Implement this
        return {
          trip_id: selectedTripId.value,
          status: TripFriendStatus.PENDING,
          invited_by_id: user.value?.id,
          invite_token: token,
        };
      }) as InsertTripFriend[];
      const { data: invitedFriends, error } = await supabase.from('trip_invites')
        .insert([...existingFriendsPayload, ...newFriendsPayload])
        .select();

      if (invitedFriends?.length && !error) {
        $appStore.notifyPositive('Successfully invited friends to trip!');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error inviting friends to the trip.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div class="card card-aside">
    <div class="flex justify-start items-center py-4">
      <users-round-icon class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Friends
      </p>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.friends.length">
      <p class="mb-4 text-base">
        You haven't added any friends to this trip yet!
      </p>
      <gc-button
        label="Invite Friends"
        outlined
        size="sm"
        @click="isInviteModalOpen = true" />
    </gc-empty-state>
    <div v-else>
      Display friends
    </div>
  </div>

  <!-- Invite Friends Modal -->
  <gc-modal
    :is-open="isInviteModalOpen"
    title="Invite Friends"
    @handle-cancel="isInviteModalOpen = false">
    <template #default>
      <p class="text-base text-gray">
        Invite existing friends to your trip, or invite new friends to join Gear Closet!
      </p>
      <div class="flex flex-col">
        <gc-autocomplete
          v-if="!inviteByEmail"
          :disabled="searching || submitting"
          :loading="searching"
          :model-value="selectedFriend"
          :nullable="true"
          :options="searchResults"
          placeholder="Search for a friend"
          :prepend-icon="SearchIcon"
          @update:model-value="searchForFriends($event)" />
        <div
          v-else
          class="relative">
          <input
            v-model="newEmail"
            class="appearance-none bg-transparent block border-1 focus:border-primary border-gray-300 p-2.5 pe-16 peer py-2.5 rounded-lg text-base text-dark-grey w-full focus:outline-none focus:ring-0 placeholder:!text-gray-400"
            :class="{ 'bg-gray-100 pointer-events-none': searching || submitting }"
            :disabled="searching || submitting"
            placeholder="Enter an email address"
            type="email"
            @keydown.enter="[emailsToInvite.push(newEmail as string), newEmail = '']">
          <gc-button
            class="-translate-y-1/2 absolute top-1/2 right-2 transform"
            label="Add"
            outlined
            size="sm"
            variant="positive"
            @click="[emailsToInvite.push(newEmail as string), newEmail = '']" />
        </div>
        <gc-button
          class="mt-2 self-start"
          ghost
          size="sm"
          @click="inviteByEmail = !inviteByEmail">
          <arrow-down-up-icon class="h-4 mr-2 w-4" />
          {{ inviteByEmail ? 'Search for a friend' : 'Invite by email' }}
        </gc-button>
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
            <gc-avatar :profile="(friend as Profile)" />
            {{ friendlyUsername(friend as Profile) }}
          </li>
          <li
            v-for="email in emailsToInvite"
            :key="email"
            class="flex items-center gap-4">
            <gc-avatar />
            {{ email }}
          </li>
        </ul>
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="[isInviteModalOpen = false, friendsToInvite = []]" />
      <gc-button
        :disabled="submitting || (!friendsToInvite.length && !emailsToInvite.length)"
        label="Invite"
        :loading="submitting"
        size="sm"
        @click="inviteFriends" />
    </template>
  </gc-modal>
</template>
