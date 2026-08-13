import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { profile } from '@/tests/unit/mocks/app.mock';
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

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

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

    it('loads profile and normalizes missing notifications to []', async () => {
      const { notifications: _n, ...profileWithoutNotifications } = profile as any;
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({
          data: { ...profileWithoutNotifications, notifications: null },
          error: null,
        }),
      });
      const userStore = useUserStore();

      await userStore.fetchProfile();

      expect(userStore.profile?.id)
        .toBe(profile.id);
      expect(userStore.profile?.notifications)
        .toEqual([]);
    });
  });

  describe('fetchNotification', () => {
    it('pushes when notification id is missing', async () => {
      const incoming = {
        id: 99,
        title: 'New',
        read_on_date: null,
        profile_id: profile.id,
        sender_id: null,
        created_at: new Date()
          .toISOString(),
        sender: null,
      };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: incoming, error: null }),
      });
      const userStore = useUserStore();
      userStore.profile = {
        ...profile,
        notifications: [...(profile.notifications ?? [])],
      } as any;
      const before = userStore.profile!.notifications.length;

      await userStore.fetchNotification(99);

      expect(userStore.profile!.notifications)
        .toHaveLength(before + 1);
      const notifications = userStore.profile!.notifications as Array<{ id: number; title: string }>;
      expect(notifications.some(n => n.id === 99 && n.title === 'New'))
        .toBe(true);
    });

    it('replaces when notification id already exists', async () => {
      const existing = profile.notifications[0];
      expect(existing)
        .toBeTruthy();
      const updated = { ...existing, title: 'Updated title' };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: updated, error: null }),
      });
      const userStore = useUserStore();
      userStore.profile = {
        ...profile,
        notifications: [{ ...existing }],
      } as any;

      await userStore.fetchNotification(existing!.id);

      expect(userStore.profile!.notifications)
        .toHaveLength(1);
      expect(userStore.profile!.notifications[0]?.title)
        .toBe('Updated title');
    });

    it('no-ops when profile is null', async () => {
      const from = vi.fn();
      supabaseClient.current = createSupabaseMock({ from });
      const userStore = useUserStore();
      userStore.profile = null;

      await userStore.fetchNotification(1);

      expect(from)
        .not
        .toHaveBeenCalled();
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
