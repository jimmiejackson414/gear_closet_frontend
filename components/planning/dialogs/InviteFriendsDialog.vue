<script lang="ts" setup>
  import { TripFriendStatus, type Database, type Tables, type TablesInsert } from '@/types';
  import { NotificationKind } from '@/utils/notifications';
  import {
    parseInviteEmail,
    toFriendSelectOptions,
    tripFriendEmailSet,
    tripFriendStatusByProfileId,
    tripFriendStatusLabel,
    tripFriendStatusVariant,
    type FriendSelectOption,
  } from '@/utils/tripFriends';
  import type { SelectOption } from '@/types/ui';

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

  const escapeIlikeTerm = (term: string) => term.replace(/[%_]/g, '\\$&');

  const searching = ref(false);
  const searchResults = ref<FriendSelectOption[]>([]);
  const friendObjects = shallowRef<Tables<'profiles'>[]>([]);
  const friendsToInvite = shallowRef<Tables<'profiles'>[]>([]);
  const emailsToInvite = ref<string[]>([]);
  const emailInput = ref('');
  const pickerKey = ref(0);
  const submitting = ref(false);

  const onTripByProfileId = computed(() => tripFriendStatusByProfileId($store.data.friends));
  const onTripEmails = computed(() => tripFriendEmailSet($store.data.friends));

  const canSubmit = computed(() =>
    friendsToInvite.value.length > 0 || emailsToInvite.value.length > 0);

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

      const profiles = (friendsData ?? [])
        .map(f => f.profile)
        .filter((p): p is NonNullable<typeof p> => p !== null);

      friendObjects.value = profiles;
      searchResults.value = toFriendSelectOptions(
        profiles,
        onTripByProfileId.value,
        friendlyUsername,
      );
    } catch {
      $appStore.notifyNegative('There was an error searching for friends.');
    } finally {
      searching.value = false;
    }
  };

  const debouncedSearchForFriends = useDebounceFn(searchForFriends, 300);

  const setFriendsPayload = (event: SelectOption[]) => {
    friendsToInvite.value = event
      .filter(option => !option.disabled)
      .map((f: SelectOption) => {
        return friendObjects.value.find((friend: Tables<'profiles'>) => friend.id === f.value);
      })
      .filter((profile): profile is Tables<'profiles'> => Boolean(profile));
  };

  const addEmail = () => {
    const parsed = parseInviteEmail(emailInput.value, emailsToInvite.value, onTripEmails.value);
    if (parsed.error) {
      $appStore.notifyNegative(parsed.error);
      return;
    }
    emailInput.value = '';
    if (!parsed.email || parsed.duplicate) return;
    emailsToInvite.value = [...emailsToInvite.value, parsed.email];
  };

  const removeEmail = (email: string) => {
    emailsToInvite.value = emailsToInvite.value.filter(item => item !== email);
  };

  const resetForm = () => {
    friendsToInvite.value = [];
    emailsToInvite.value = [];
    searchResults.value = [];
    friendObjects.value = [];
    emailInput.value = '';
    pickerKey.value += 1;
  };

  const handleClose = () => {
    resetForm();
    emits('onClose');
  };

  const inviteFriends = async () => {
    if (!canSubmit.value) return;

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      let invitedFriendsOk = false;

      if (friendsToInvite.value.length) {
        const existingFriendsPayload = friendsToInvite.value.map((f: Tables<'profiles'>) => ({
          trip_id: Number($store.selectedTripId),
          profile_id: f.id,
          status: TripFriendStatus.PENDING,
          invited_by_id: user.value?.sub as string,
        }));
        const { data: invitedFriends, error } = await supabase.from('trip_friends')
          .insert(existingFriendsPayload)
          .select();

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
          invitedFriendsOk = true;
          const profilesById = new Map(friendsToInvite.value.map(profile => [profile.id, profile]));
          $store.data.friends.push(...invitedFriends.map(friend => ({
            ...friend,
            friend_profile: profilesById.get(friend.profile_id) ?? null,
          })));
        } else if (error) {
          $appStore.notifyNegative(error.message || 'There was an error inviting friends to the trip.');
          return;
        }
      }

      if (invitedFriendsOk) {
        $appStore.notifyPositive('Successfully invited friends to trip!');
      }

      // Email delivery is wired in #42 / #43. Keep the field ready without sending yet.
      if (emailsToInvite.value.length) {
        $appStore.notifyInfo('Email invites will send in a follow-up. No email was sent.');
      }
    } catch {
      $appStore.notifyNegative('There was an error inviting friends to the trip.');
    } finally {
      submitting.value = false;
      handleClose();
    }
  };

  watch(() => props.isOpen, (open) => {
    if (!open) resetForm();
  });
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>
          Invite to trip
        </dialog-title>
        <dialog-description>
          Friends on your list get an in-app invite. Anyone else can be invited by email — they'll get a link even if they don't have an account yet.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-6 mt-4 w-full">
        <div class="flex flex-col gap-2 w-full lg:max-w-sm">
          <label-root>
            Friends
          </label-root>
          <multiselect
            :key="pickerKey"
            :loading="searching"
            :options="searchResults"
            placeholder="Abe Lincoln"
            @search="debouncedSearchForFriends"
            @select="setFriendsPayload">
            <template #option="{ option }">
              <div
                class="flex items-center w-full"
                :class="{ 'opacity-50': option.disabled }">
                <gc-avatar
                  class="mr-2"
                  size="xs"
                  :url="option.image" />
                <span class="min-w-0 truncate">
                  {{ option.label }}
                </span>
                <badge
                  v-if="option.status"
                  class="ml-auto shrink-0"
                  :variant="tripFriendStatusVariant(option.status)">
                  {{ tripFriendStatusLabel(option.status) }}
                </badge>
              </div>
            </template>
          </multiselect>
        </div>
        <div class="flex flex-col gap-2 w-full lg:max-w-sm">
          <label-root for="invite-email">
            Email
          </label-root>
          <div class="flex items-center gap-2">
            <input-root
              id="invite-email"
              v-model="emailInput"
              data-testid="invite-email-input"
              :disabled="submitting"
              placeholder="friend@example.com"
              type="email"
              @keydown.enter.prevent="addEmail" />
            <button-root
              data-testid="invite-email-add"
              :disabled="submitting"
              type="button"
              variant="outline"
              @click="addEmail">
              Add
            </button-root>
          </div>
          <ul
            v-if="emailsToInvite.length"
            class="flex flex-wrap gap-2">
            <li
              v-for="email in emailsToInvite"
              :key="email">
              <badge
                class="gap-1 pr-1"
                variant="secondary">
                {{ email }}
                <button
                  aria-label="Remove email"
                  class="rounded-full"
                  type="button"
                  @click="removeEmail(email)">
                  <icon-x class="h-3 w-3" />
                </button>
              </badge>
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
          data-testid="invite-submit"
          :disabled="submitting || !canSubmit"
          :loading="submitting"
          @click="inviteFriends">
          Invite
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
