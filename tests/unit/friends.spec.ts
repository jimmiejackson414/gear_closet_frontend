import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FriendRequestItem from '@/components/friends/FriendRequestItem.vue';
import FriendSearchItem from '@/components/friends/FriendSearchItem.vue';
import FriendItem from '@/components/friends/FriendItem.vue';
import RemoveFriendDialog from '@/components/friends/RemoveFriendDialog.vue';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { friends } from '@/tests/unit/mocks/dashboard.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import { FriendRequestStatus } from '@/types';
import type { ExtendedFriend, ExtendedFriendInvite } from '@/types/helpers';
import { NotificationKind } from '@/utils/notifications';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/utils/helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/helpers')>();
  const buildImageSrc = vi.fn((url: string) => url);
  const initials = vi.fn((user) => (user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}` : 'GC'));
  const friendlyUsername = vi.fn((user) => {
    if (!user) return 'a friend';
    return user.trail_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'a friend';
  });

  return {
    ...actual,
    buildImageSrc,
    initials,
    friendlyUsername,
  };
});

const CURRENT_USER_ID = '61b66be5-d199-48d5-898a-c521dd6b59cc';
const SENDER_ID = friends[0]!.friend.id;

const supabaseUser = vi.hoisted(() => ({
  value: { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' } as { sub: string } | null,
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

const inviteFixture = (): ExtendedFriendInvite => ({
  id: 42,
  created_at: '2024-04-25T19:33:50.250318+00:00',
  updated_at: '2024-04-25T19:33:50.250318+00:00',
  sender_id: SENDER_ID,
  recipient_id: CURRENT_USER_ID,
  status: FriendRequestStatus.PENDING,
  request_sent_at: '2024-04-25T19:33:50.250318+00:00',
  request_responded_at: null,
  sender: friends[0]!.friend,
  recipient: {
    id: CURRENT_USER_ID,
    email: 'me@example.com',
    first_name: 'Me',
    last_name: 'User',
    trail_name: null,
    image: null,
    role: 'USER',
    measuring_system: 'IMPERIAL',
    needs_free_resource_selection: false,
    onboard_date: null,
    address_1: null,
    address_2: null,
    city: null,
    state: null,
    country: null,
    created_at: null,
    updated_at: null,
    deactivated_at: null,
    location: null,
    fts: null,
    slug: 'me-user',
  },
});

describe('Friends components', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.value = { sub: CURRENT_USER_ID };
    supabaseClient.current = createSupabaseMock();
  });

  describe('FriendRequestItem', () => {
    it('accepts a request, toasts, and emits accept', async () => {
      const invite = inviteFixture();
      const acceptedInvite = {
        ...invite,
        status: FriendRequestStatus.ACCEPTED,
        request_responded_at: '2024-04-26T00:00:00.000Z',
      };
      const friendshipRow = {
        id: 99,
        profile_id: CURRENT_USER_ID,
        friend_id: SENDER_ID,
        created_at: acceptedInvite.request_responded_at,
        updated_at: acceptedInvite.request_responded_at,
        friend: invite.sender,
      } as ExtendedFriend;
      const invitationsQuery = createThenableQuery({ data: [acceptedInvite], error: null });
      const friendsQuery = createThenableQuery({
        data: [
          friendshipRow,
          {
            ...friendshipRow,
            id: 100,
            profile_id: SENDER_ID,
            friend_id: CURRENT_USER_ID,
          },
        ],
        error: null,
      });

      supabaseClient.current = createSupabaseMock({
        from: (table) => {
          if (table === 'friend_invitations') return invitationsQuery;
          if (table === 'friends') return friendsQuery;
          return createThenableQuery({ data: null, error: null });
        },
      });

      const wrapper = await mountSuspended(FriendRequestItem, {
        props: { friend: invite },
      });
      const appStore = useAppStore();
      const positiveSpy = vi.spyOn(appStore, 'notifyPositive');

      const acceptBtn = wrapper.findAllComponents({ name: 'Button' })
        .find((btn) => btn.text()
          .includes('Accept'));
      expect(acceptBtn)
        .toBeTruthy();
      await acceptBtn!.trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(positiveSpy)
        .toHaveBeenCalledWith('Friend request accepted.');
      expect(friendsQuery.insert)
        .toHaveBeenCalledWith([
          { profile_id: CURRENT_USER_ID, friend_id: SENDER_ID },
          { profile_id: SENDER_ID, friend_id: CURRENT_USER_ID },
        ]);
      expect(wrapper.emitted('accept')?.[0])
        .toEqual([friendshipRow, invite.id]);
      expect(wrapper.text())
        .toMatch(/Accepted/i);
    });

    it('declines a request, toasts, and emits decline', async () => {
      const invite = inviteFixture();
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: [{ ...invite, status: FriendRequestStatus.DECLINED }], error: null }),
      });

      const wrapper = await mountSuspended(FriendRequestItem, {
        props: { friend: invite },
      });
      const appStore = useAppStore();
      const positiveSpy = vi.spyOn(appStore, 'notifyPositive');

      const declineBtn = wrapper.findAllComponents({ name: 'Button' })
        .find((btn) => btn.text()
          .includes('Decline'));
      expect(declineBtn)
        .toBeTruthy();
      await declineBtn!.trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(positiveSpy)
        .toHaveBeenCalledWith('Friend request declined.');
      expect(wrapper.emitted('decline')?.[0])
        .toEqual([invite.id]);
      expect(wrapper.text())
        .toMatch(/Declined/i);
    });

    it('toasts on accept failure', async () => {
      const invite = inviteFixture();
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: null, error: { message: 'fail' } }),
      });

      const wrapper = await mountSuspended(FriendRequestItem, {
        props: { friend: invite },
      });
      const appStore = useAppStore();
      const negativeSpy = vi.spyOn(appStore, 'notifyNegative');

      const acceptBtn = wrapper.findAllComponents({ name: 'Button' })
        .find((btn) => btn.text()
          .includes('Accept'));
      await acceptBtn!.trigger('click');
      await flushPromises();

      expect(negativeSpy)
        .toHaveBeenCalledWith('An error occurred while accepting the friend request.');
      expect(wrapper.emitted('accept'))
        .toBeUndefined();
    });
  });

  describe('FriendSearchItem', () => {
    it('shows Invite requested when requestPending is true', async () => {
      const wrapper = await mountSuspended(FriendSearchItem, {
        props: {
          profile: friends[0]!.friend,
          requestPending: true,
        },
      });

      expect(wrapper.text())
        .toContain('Invite requested');
      expect(wrapper.text())
        .not
        .toContain('Add Friend');
    });

    it('shows Add Friend when no pending request', async () => {
      const wrapper = await mountSuspended(FriendSearchItem, {
        props: {
          profile: friends[0]!.friend,
          requestPending: false,
        },
      });

      expect(wrapper.text())
        .toContain('Add Friend');
    });

    it('inserts a friend request notification with sender_id', async () => {
      const invitationQuery = createThenableQuery({ data: [{ id: 1 }], error: null });
      const notificationQuery = createThenableQuery({ data: [{ id: 2 }], error: null });
      supabaseClient.current = createSupabaseMock({
        from: (table) => (
          table === 'friend_invitations' ? invitationQuery : notificationQuery
        ),
      });

      const userStore = useUserStore();
      userStore.$patch({
        profile: {
          first_name: 'Me',
          last_name: 'User',
        } as any,
      });

      const wrapper = await mountSuspended(FriendSearchItem, {
        props: {
          profile: friends[0]!.friend,
          requestPending: false,
        },
      });

      const addBtn = wrapper.findAllComponents({ name: 'Button' })
        .find((btn) => btn.text()
          .includes('Add Friend'));
      expect(addBtn)
        .toBeTruthy();
      await addBtn!.trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(invitationQuery.insert)
        .toHaveBeenCalledWith([
          {
            recipient_id: friends[0]!.friend.id,
            sender_id: CURRENT_USER_ID,
            status: FriendRequestStatus.PENDING,
          },
        ]);
      expect(notificationQuery.insert)
        .toHaveBeenCalledWith([
          expect.objectContaining({
            title: NotificationKind.FRIEND_REQUEST,
            profile_id: friends[0]!.friend.id,
            sender_id: CURRENT_USER_ID,
          }),
        ]);
      expect(wrapper.text())
        .toContain('Invite requested');
    });
  });

  describe('FriendItem', () => {
    it('shows a remove action', async () => {
      const wrapper = await mountSuspended(FriendItem, {
        props: { friend: friends[0]! },
      });

      expect(wrapper.text())
        .toContain('Remove');
    });
  });

  describe('RemoveFriendDialog', () => {
    it('deletes both friendship rows and emits removed', async () => {
      const friendship = friends[0]!;
      const ownRowQuery = createThenableQuery({ data: null, error: null });
      const reciprocalRowQuery = createThenableQuery({ data: null, error: null });
      let deleteCall = 0;

      supabaseClient.current = createSupabaseMock({
        from: (table) => {
          if (table !== 'friends') {
            return createThenableQuery({ data: null, error: null });
          }
          deleteCall += 1;
          return deleteCall === 1 ? ownRowQuery : reciprocalRowQuery;
        },
      });

      const wrapper = await mountSuspended(RemoveFriendDialog, {
        props: {
          friend: friendship,
          isOpen: true,
        },
      });
      const appStore = useAppStore();
      const positiveSpy = vi.spyOn(appStore, 'notifyPositive');

      const removeBtn = wrapper.findAllComponents({ name: 'Button' })
        .find((btn) => btn.text()
          .includes('Remove Friend'));
      expect(removeBtn)
        .toBeTruthy();
      await removeBtn!.trigger('click');
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(ownRowQuery.delete)
        .toHaveBeenCalled();
      expect(reciprocalRowQuery.delete)
        .toHaveBeenCalled();
      expect(positiveSpy)
        .toHaveBeenCalledWith('Friend removed.');
      expect(wrapper.emitted('removed')?.[0])
        .toEqual([friendship.id]);
      expect(wrapper.emitted('close'))
        .toBeTruthy();
    });
  });
});

async function flushPromises () {
  await Promise.resolve();
  await Promise.resolve();
}
