<script lang='ts' setup>
  import { type Database, type Tables, TripFriendStatus } from '@/types';
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
  const { data, selectedTripId, selectedTrip } = storeToRefs($store);

  const selectedFriends = ref<string[]>([]);
  const friendsToInvite = shallowRef<Tables<'profiles'>[]>([]);
  const emailsToInvite = ref<string[]>([]);

  const handleClose = () => {
    friendsToInvite.value = [];
    emits('onClose');
  };

  /**
   * Performs search for existing friends.
   */
  // const searchQuery = ref('');
  const searching = ref(false);
  const searchResults = ref<SelectOption[]>([]);
  const searchForFriends = async (searchTerm: string) => {
    try {
      searching.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: friends, error } = await supabase
        .from('friends')
        .select('*, profile:profiles!profile_id(*)')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`, { referencedTable: 'profiles' })
        .neq('profile_id', selectedTrip.value?.profile_id)
        .returns<FriendSearchResult[]>()
        .limit(10);

      if (friends?.length && !error) {
        searchResults.value = friends.map(f => ({
          label: friendlyUsername(f.profile as Tables<'profiles'>),
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
      handleClose();
    }
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
      <div class="flex items-center flex-col gap-8 mt-4 mx-auto w-full lg:max-w-sm">
        <!-- <combobox
          :disabled="searching || submitting"
          :loading="searching"
          :model-value="searchQuery"
          multiselect
          :options="searchResults"
          placeholder="Search for a friend..."
          @update:model-value="selectedFriend = $event"
          @update:search-term="searchForFriends">
          <template #option="{ option }">
            <div class="flex items-center">
              <gc-avatar
                class="mr-2"
                size="xs"
                :src="buildImageSrc(option.image)" />
              <span>{{ option.label }}</span>
            </div>
          </template>
        </combobox> -->
        <multiselect
          :model-value="selectedFriends"
          :options="searchResults"
          title="Test"
          @update:search-term="searchForFriends" />
        <!-- <multiselect
          :disabled="searching || submitting"
          :loading="searching"
          :model-value="selectedFriends"
          :options="searchResults"
          placeholder="Search for a friend..."
          @update:model-value="selectedFriends = $event"
          @update:search-term="searchForFriends">
          <template #option="{ option }">
            <div class="flex items-center">
              <gc-avatar
                class="mr-2"
                size="xs"
                :src="buildImageSrc(option.image)" />
              <span>{{ option.label }}</span>
            </div>
          </template>
        </multiselect> -->
        <div>
          <typography
            class="!font-bold"
            variant="small">
            Friends to invite:
          </typography>
          <typography
            v-if="!friendsToInvite.length && !emailsToInvite.length"
            class="text-muted-foreground">
            You haven't added any friends to invite yet.
          </typography>
          <ul v-else>
            <li
              v-for="friend in friendsToInvite"
              :key="friend.id"
              class="flex items-center gap-4">
              <gc-avatar
                :initials="initials(friend)"
                :url="buildImageSrc(friend.image)" />
              {{ friendlyUsername(friend) }}
            </li>
            <li
              v-for="email in emailsToInvite"
              :key="email"
              class="flex items-center gap-4">
              {{ email }}
            </li>
          </ul>
        </div>
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
