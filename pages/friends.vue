<script lang='ts' setup>
  import { IconSearch } from '#components';

  definePageMeta({ layout: 'page-layout' });

  const {
    closeInvite,
    crewFilter,
    currentFriends,
    fetchFriendPage,
    filteredCrew,
    friendEmails,
    friendProfileIds,
    handleAcceptRequest,
    handleDeclineRequest,
    handleInvitesSent,
    handleRemoveFriend,
    inviteOpen,
    offPlatformEmails,
    openInvite,
    ownEmail,
    pendingEmails,
    pendingProfileIds,
    requestBannerText,
    requests,
    resendingEmail,
    resendInvite,
    sentCount,
    sentInvites,
    sharedTripCountFor,
  } = useFriendsPage();

  const activeTab = ref<'crew' | 'requests' | 'sent'>('crew');

  await fetchFriendPage();

  useHead({
    meta: [
      {
        content: 'Invite friends and manage your crew.',
        name: 'description',
      },
    ],
    title: 'Friends',
  });
</script>

<template>
  <div class="mx-auto pb-8 w-full min-w-0 max-w-full lg:max-w-5xl">
    <div class="flex justify-end mb-4">
      <button-root
        aria-label="Invite friends"
        class="rounded-full"
        data-testid="friends-invite"
        type="button"
        @click="openInvite">
        <icon-plus
          aria-hidden="true"
          class="size-4" />
        Invite
      </button-root>
    </div>

    <div
      v-if="requests.length && activeTab === 'crew'"
      class="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 bg-muted mb-4 px-4 py-3 rounded-md"
      data-testid="friends-request-banner"
      role="status">
      <typography class="mb-0 text-sm">
        {{ requestBannerText }}
      </typography>
      <button-root
        class="shrink-0"
        size="sm"
        variant="outline"
        @click="activeTab = 'requests'">
        View requests
      </button-root>
    </div>

    <tabs
      v-model="activeTab"
      class="w-full min-w-0">
      <tabs-list class="grid grid-cols-3 w-full min-w-0">
        <tabs-trigger
          class="px-1.5 sm:px-3 min-w-0"
          data-testid="friends-tab-crew"
          value="crew">
          Crew {{ currentFriends.length }}
        </tabs-trigger>
        <tabs-trigger
          class="px-1.5 sm:px-3 min-w-0"
          data-testid="friends-tab-requests"
          value="requests">
          Requests {{ requests.length }}
        </tabs-trigger>
        <tabs-trigger
          class="px-1.5 sm:px-3 min-w-0"
          data-testid="friends-tab-sent"
          value="sent">
          Sent {{ sentCount }}
        </tabs-trigger>
      </tabs-list>

      <div
        v-if="activeTab === 'crew'"
        class="mt-2"
        role="tabpanel"
        tabindex="0">
        <div
          v-if="currentFriends.length"
          class="flex flex-col gap-4 mt-4">
          <input-root
            v-model="crewFilter"
            class="w-full max-w-md"
            data-testid="friends-crew-filter"
            name="crew-filter"
            placeholder="Filter your crew"
            :prepend-icon="IconSearch" />
          <ul
            v-if="filteredCrew.length"
            class="flex flex-col divide-y">
            <li
              v-for="friend in filteredCrew"
              :key="friend.id">
              <friend-item
                :friend="friend"
                :shared-trip-count="sharedTripCountFor(friend.friend_id)"
                @removed="handleRemoveFriend" />
            </li>
          </ul>
          <typography
            v-else
            class="text-muted-foreground">
            No friends match that filter.
          </typography>
        </div>
        <gc-empty-state
          v-else
          data-testid="friends-crew-empty">
          <typography class="mb-4">
            You haven't connected with any friends quite yet.
          </typography>
          <typography class="mb-4 text-sm">
            Invite someone from Gear Closet or by email.
          </typography>
          <button-root
            size="sm"
            variant="outline"
            @click="openInvite">
            Invite
          </button-root>
        </gc-empty-state>
      </div>

      <div
        v-else-if="activeTab === 'requests'"
        class="mt-2"
        role="tabpanel"
        tabindex="0">
        <ul
          v-if="requests.length"
          class="flex flex-col mt-2 divide-y">
          <li
            v-for="request in requests"
            :key="request.id">
            <friend-request-item
              :friend="request"
              @accept="handleAcceptRequest"
              @decline="handleDeclineRequest" />
          </li>
        </ul>
        <gc-empty-state
          v-else
          data-testid="friends-requests-empty">
          <typography class="mb-4">
            You don't have any incoming requests.
          </typography>
          <typography class="text-sm">
            When someone wants to connect, they'll show up here.
          </typography>
        </gc-empty-state>
      </div>

      <div
        v-else
        class="mt-2"
        role="tabpanel"
        tabindex="0">
        <ul
          v-if="sentCount"
          class="flex flex-col mt-2 divide-y">
          <li
            v-for="invite in sentInvites"
            :key="`invite-${invite.id}`">
            <friend-row
              :image="invite.recipient.image"
              :initials="initials(invite.recipient)"
              subtitle="On Gear Closet"
              :title="friendlyUsername(invite.recipient, { includeTrailName: true })">
              <typography class="text-muted-foreground text-sm">
                Pending
              </typography>
              <button-root
                v-if="invite.recipient.email"
                data-testid="friend-invite-resend"
                :disabled="resendingEmail === invite.recipient.email.trim().toLowerCase()"
                :loading="resendingEmail === invite.recipient.email.trim().toLowerCase()"
                size="sm"
                type="button"
                variant="outline"
                @click="resendInvite(invite.recipient.email)">
                Resend
              </button-root>
            </friend-row>
          </li>
          <li
            v-for="email in offPlatformEmails"
            :key="`email-${email.email}`">
            <friend-row
              mail
              subtitle="Email"
              :title="email.email">
              <typography class="text-muted-foreground text-sm">
                Waiting
              </typography>
              <button-root
                data-testid="friend-invite-resend"
                :disabled="resendingEmail === email.email"
                :loading="resendingEmail === email.email"
                size="sm"
                type="button"
                variant="outline"
                @click="resendInvite(email.email)">
                Resend
              </button-root>
            </friend-row>
          </li>
        </ul>
        <gc-empty-state
          v-else
          data-testid="friends-sent-empty">
          <typography class="mb-4">
            You haven't sent any invites yet.
          </typography>
          <typography class="mb-4 text-sm">
            Use Invite to send a friend request or email and get started.
          </typography>
          <button-root
            size="sm"
            variant="outline"
            @click="openInvite">
            Invite
          </button-root>
        </gc-empty-state>
      </div>
    </tabs>

    <friend-invite-dialog
      :friend-emails="[...friendEmails]"
      :friend-profile-ids="friendProfileIds"
      :is-open="inviteOpen"
      :own-email="ownEmail"
      :pending-emails="[...pendingEmails]"
      :pending-profile-ids="pendingProfileIds"
      @on-close="closeInvite"
      @sent="handleInvitesSent" />
  </div>
</template>
