import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { notifications, profile } from '@/tests/unit/mocks/app.mock';
import { createSupabaseMock, createThenableQuery } from '@/tests/unit/mocks/supabase.mock';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const supabaseUser = vi.hoisted(() => ({
  value: { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' } as { sub: string } | null,
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

const fetchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);
mockNuxtImport('$fetch', () => fetchMock);

describe('stores/user', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    supabaseClient.current = createSupabaseMock();
  });

  afterEach(async () => {
    const userStore = useUserStore();
    await userStore.unsubscribeFromNotifications();
    vi.clearAllMocks();
    fetchMock.mockReset();
  });

  describe('fetchProfile', () => {
    it('sets profile null and toasts when there is no user (no write-through)', async () => {
      supabaseUser.value = null;
      const userStore = useUserStore();
      const appStore = useAppStore();
      const notifySpy = vi.spyOn(appStore, 'notifyNegative');

      userStore.profile = { ...profile } as any;

      await userStore.fetchProfile();

      expect(userStore.profile)
        .toBeNull();
      expect(notifySpy)
        .toHaveBeenCalled();
    });

    it('sets profile null and toasts on query failure without throwing', async () => {
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: null, error: { message: 'boom' } }),
      });
      const userStore = useUserStore();
      const appStore = useAppStore();
      const notifySpy = vi.spyOn(appStore, 'notifyNegative');

      await expect(userStore.fetchProfile())
        .resolves
        .toBeUndefined();
      expect(userStore.profile)
        .toBeNull();
      expect(notifySpy)
        .toHaveBeenCalledWith('An error occurred while loading your account.');
    });

    it('loads profile and normalizes missing subscriptions to []', async () => {
      const { subscriptions: _s, ...profileWithoutRelations } = profile as any;
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({
          data: { ...profileWithoutRelations, subscriptions: null },
          error: null,
        }),
      });
      const userStore = useUserStore();

      await userStore.fetchProfile();

      expect(userStore.profile?.id)
        .toBe(profile.id);
      expect(userStore.profile?.subscriptions)
        .toEqual([]);
    });

    it('does not clear notifications when refreshing profile', async () => {
      const { subscriptions: _s, ...profileWithoutRelations } = profile as any;
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({
          data: { ...profileWithoutRelations, subscriptions: profile.subscriptions },
          error: null,
        }),
      });
      const userStore = useUserStore();
      userStore.profile = { ...profile } as any;
      userStore.notifications = [...notifications];

      await userStore.fetchProfile();

      expect(userStore.notifications)
        .toEqual(notifications);
    });
  });

  describe('fetchNotifications', () => {
    it('loads notifications into the store', async () => {
      fetchMock.mockResolvedValue(notifications);
      const userStore = useUserStore();

      await userStore.fetchNotifications();

      expect(fetchMock)
        .toHaveBeenCalledWith('/api/notifications');
      expect(userStore.notifications)
        .toEqual(notifications);
    });

    it('no-ops when there is no user', async () => {
      supabaseUser.value = null;
      const userStore = useUserStore();

      await userStore.fetchNotifications();

      expect(fetchMock)
        .not
        .toHaveBeenCalled();
    });
  });

  describe('plan getters', () => {
    it('treats a missing subscription row as Free and not paid', () => {
      const userStore = useUserStore();
      userStore.profile = { ...profile, subscriptions: [] } as any;

      expect(userStore.currentPlanIdentifier)
        .toBe('FREE');
      expect(userStore.isPaidMember)
        .toBe(false);
    });

    it('does not crash when subscriptions is undefined', () => {
      const userStore = useUserStore();
      userStore.profile = { ...profile, subscriptions: undefined } as any;

      expect(userStore.currentPlanIdentifier)
        .toBe('FREE');
      expect(userStore.isPaidMember)
        .toBe(false);
    });

    it('treats Annual as paid', () => {
      const userStore = useUserStore();
      const existing = profile.subscriptions[0];
      if (!existing) {
        throw new Error('mock profile is missing a subscription');
      }

      userStore.profile = {
        ...profile,
        subscriptions: [{
          ...existing,
          prices: { ...existing.prices, identifier: 'ANNUAL' },
        }],
      } as any;

      expect(userStore.currentPlanIdentifier)
        .toBe('ANNUAL');
      expect(userStore.isPaidMember)
        .toBe(true);
    });

    it('treats Lifetime as paid', () => {
      const userStore = useUserStore();
      const existing = profile.subscriptions[0];
      if (!existing) {
        throw new Error('mock profile is missing a subscription');
      }

      userStore.profile = {
        ...profile,
        subscriptions: [{
          ...existing,
          prices: { ...existing.prices, identifier: 'LIFE' },
        }],
      } as any;

      expect(userStore.currentPlanIdentifier)
        .toBe('LIFE');
      expect(userStore.isPaidMember)
        .toBe(true);
    });
  });

  describe('fetchNotification', () => {
    it('pushes when notification id is missing', async () => {
      const incoming = {
        created_at: new Date()
          .toISOString(),
        id: 99,
        profile_id: profile.id,
        read_on_date: null,
        sender: null,
        sender_id: null,
        title: 'New',
      };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: incoming, error: null }),
      });
      const userStore = useUserStore();
      userStore.notifications = [...notifications];
      const before = userStore.notifications.length;

      await userStore.fetchNotification(99);

      expect(userStore.notifications)
        .toHaveLength(before + 1);
      expect(userStore.notifications.some(n => n.id === 99 && n.title === 'New'))
        .toBe(true);
    });

    it('replaces when notification id already exists', async () => {
      const existing = notifications[0];
      expect(existing)
        .toBeTruthy();
      const updated = { ...existing, title: 'Updated title' };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: updated, error: null }),
      });
      const userStore = useUserStore();
      userStore.notifications = [{ ...existing! }];

      await userStore.fetchNotification(existing!.id);

      expect(userStore.notifications)
        .toHaveLength(1);
      expect(userStore.notifications[0]?.title)
        .toBe('Updated title');
    });

    it('still fetches when profile is null', async () => {
      const incoming = {
        created_at: new Date()
          .toISOString(),
        id: 1,
        profile_id: profile.id,
        read_on_date: null,
        sender: null,
        sender_id: null,
        title: 'Hello',
      };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: incoming, error: null }),
      });
      const userStore = useUserStore();
      userStore.profile = null;

      await userStore.fetchNotification(1);

      expect(userStore.notifications)
        .toHaveLength(1);
    });
  });

  describe('subscribeToNotifications / unsubscribeFromNotifications', () => {
    it('removes a prior channel before resubscribing', async () => {
      const client = createSupabaseMock();
      supabaseClient.current = client;
      const userStore = useUserStore();

      await userStore.subscribeToNotifications();
      expect(client.channel)
        .toHaveBeenCalledTimes(1);
      expect(client._channels)
        .toHaveLength(1);

      await userStore.subscribeToNotifications();
      expect(client.removeChannel)
        .toHaveBeenCalledTimes(1);
      expect(client.removeChannel)
        .toHaveBeenCalledWith(client._channels[0]);
      expect(client.channel)
        .toHaveBeenCalledTimes(2);
    });

    it('clears the channel on unsubscribe', async () => {
      const client = createSupabaseMock();
      supabaseClient.current = client;
      const userStore = useUserStore();

      await userStore.subscribeToNotifications();
      await userStore.unsubscribeFromNotifications();

      expect(client.removeChannel)
        .toHaveBeenCalled();

      // Second unsubscribe is a no-op (no channel left).
      client.removeChannel.mockClear();
      await userStore.unsubscribeFromNotifications();
      expect(client.removeChannel)
        .not
        .toHaveBeenCalled();
    });
  });
});
