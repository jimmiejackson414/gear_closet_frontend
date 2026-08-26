<script lang="ts" setup>
  import { type Database, type Tables } from '@/types';
  import {
    friendDirectoryStatusLabel,
    friendDirectoryStatusVariant,
    parseFriendInviteChipEmail,
  } from '@/utils/friendsPage';
  import {
    escapeIlikeTerm,
    mergeProfileSearchResults,
    parseFriendSearchEmail,
    toSafeTsQuery,
  } from '@/utils/friendsSearch';
  import { toFriendSelectOptions, type FriendSelectOption } from '@/utils/tripFriends';
  import type { SelectOption } from '@/types/ui';

  interface Props {
    isOpen: boolean;
    friendProfileIds?: string[];
    pendingProfileIds?: string[];
    friendEmails?: string[];
    pendingEmails?: string[];
    ownEmail?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    friendEmails: () => [],
    friendProfileIds: () => [],
    ownEmail: null,
    pendingEmails: () => [],
    pendingProfileIds: () => [],
  });
  const emits = defineEmits<{
    (event: 'onClose' | 'sent'): void;
  }>();

  const $appStore = useAppStore();

  const searching = ref(false);
  const searchResults = ref<FriendSelectOption[]>([]);
  const friendObjects = shallowRef<Tables<'profiles'>[]>([]);
  const friendsToInvite = shallowRef<Tables<'profiles'>[]>([]);
  const emailsToInvite = ref<string[]>([]);
  const emailInput = ref('');
  const pickerKey = ref(0);
  const submitting = ref(false);

  const statusByProfileId = computed(() => {
    const map = new Map<string, string>();
    for (const id of props.friendProfileIds) map.set(id, 'Friend');
    for (const id of props.pendingProfileIds) map.set(id, 'Pending');
    return map;
  });

  const blockedEmails = computed(() => {
    const blocked = new Map<string, string>();
    const own = props.ownEmail?.trim()
      .toLowerCase();
    if (own) blocked.set(own, "That's your email.");
    for (const email of props.friendEmails) {
      blocked.set(email.toLowerCase(), 'That person is already a friend.');
    }
    for (const email of props.pendingEmails) {
      blocked.set(email.toLowerCase(), 'An invite is already pending for that address.');
    }
    return blocked;
  });

  const canSubmit = computed(() =>
    friendsToInvite.value.length > 0 || emailsToInvite.value.length > 0);

  const searchDirectory = async (searchTerm: string) => {
    if (!searchTerm?.trim()) {
      searchResults.value = [];
      return;
    }

    try {
      searching.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const query = searchTerm.trim();
      const tsquery = toSafeTsQuery(query);
      const email = parseFriendSearchEmail(query);

      const ftsPromise = tsquery
        ? supabase
          .rpc('search_profiles', { search_query: tsquery })
          .neq('id', user.value?.sub ?? '')
          .select()
        : Promise.resolve({ data: [] as Tables<'profiles'>[] | null, error: null });

      const emailPromise = email
        ? supabase
          .from('profiles')
          .select('*')
          .ilike('email', escapeIlikeTerm(email))
          .neq('id', user.value?.sub ?? '')
          .limit(5)
        : Promise.resolve({ data: [] as Tables<'profiles'>[] | null, error: null });

      const [ftsResult, emailResult] = await Promise.all([ftsPromise, emailPromise]);

      if (ftsResult.error || emailResult.error) {
        $appStore.notifyNegative('There was an error searching for friends.');
        return;
      }

      const profiles = mergeProfileSearchResults(
        [ftsResult.data, emailResult.data],
        user.value?.sub,
      ) as Tables<'profiles'>[];

      friendObjects.value = profiles;
      searchResults.value = toFriendSelectOptions(
        profiles,
        statusByProfileId.value,
        friendlyUsername,
      );
    } catch {
      $appStore.notifyNegative('There was an error searching for friends.');
    } finally {
      searching.value = false;
    }
  };

  const setFriendsPayload = (event: SelectOption[]) => {
    friendsToInvite.value = event
      .filter(option => !option.disabled)
      .map((f: SelectOption) => {
        return friendObjects.value.find((friend: Tables<'profiles'>) => friend.id === f.value);
      })
      .filter((profile): profile is Tables<'profiles'> => Boolean(profile));
  };

  const addEmail = () => {
    const parsed = parseFriendInviteChipEmail(
      emailInput.value,
      emailsToInvite.value,
      blockedEmails.value,
    );
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

  const inviteErrorMessage = (err: unknown) => {
    const status = typeof err === 'object' && err && 'statusCode' in err
      ? Number((err as { statusCode: unknown }).statusCode)
      : 0;
    if (status === 429) return 'Too many invites. Try again later.';
    return 'Unable to send that invite.';
  };

  const inviteEmails = () => {
    const fromProfiles = friendsToInvite.value
      .map(profile => profile.email?.trim()
        .toLowerCase())
      .filter((email): email is string => Boolean(email));
    return [...new Set([...fromProfiles, ...emailsToInvite.value])];
  };

  const inviteFriends = async () => {
    if (!canSubmit.value) return;

    const emails = inviteEmails();
    if (!emails.length) {
      $appStore.notifyNegative('Unable to send that invite.');
      return;
    }

    try {
      submitting.value = true;
      for (const email of emails) {
        await $fetch('/api/friends/invites', {
          body: { email },
          method: 'POST',
        });
      }
      $appStore.notifyPositive('Invites sent.');
      emits('sent');
      handleClose();
    } catch (err) {
      $appStore.notifyNegative(inviteErrorMessage(err));
    } finally {
      submitting.value = false;
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
          Invite friends
        </dialog-title>
        <dialog-description>
          People already on Gear Closet get an in-app request. Anyone else gets the friend-request email.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-6 mt-4 w-full">
        <div class="flex flex-col gap-2 w-full lg:max-w-sm">
          <label-root>
            Find someone
          </label-root>
          <multiselect
            :key="pickerKey"
            :loading="searching"
            :options="searchResults"
            placeholder="Search by name or email"
            @search="searchDirectory"
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
                  :variant="friendDirectoryStatusVariant(option.status)">
                  {{ friendDirectoryStatusLabel(option.status) }}
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
                  <icon-x class="w-3 h-3" />
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
          Send invites
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
