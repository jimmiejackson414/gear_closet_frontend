import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FriendsPage from '@/pages/friends.vue';
import { friends } from '@/tests/unit/mocks/dashboard.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import { FriendRequestStatus } from '@/types';
import { testMountGlobals } from './helpers';

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

const emptyClient = () => createSupabaseMock({
  from: () => createThenableQuery({ data: [], error: null }),
  rpc: () => createThenableQuery({ data: [], error: null }),
});

const emptyStateVisible = (wrapper: Awaited<ReturnType<typeof mountSuspended>>, testId: string) => {
  const empty = wrapper.find(`[data-testid="${testId}"]`);
  return empty.exists() && empty.isVisible();
};

describe('Friends page', () => {
  beforeEach(() => {
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ emails: [] });
    supabaseClient.current = emptyClient();
  });

  it('shows invite and tabs instead of a page-level find-friends search', async () => {
    const wrapper = await mountSuspended(FriendsPage, {
      global: testMountGlobals(),
    });

    expect(wrapper.get('[data-testid="friends-invite"]')
      .text())
      .toContain('Invite');
    expect(wrapper.text())
      .toContain('Crew');
    expect(wrapper.text())
      .toContain('Requests');
    expect(wrapper.text())
      .toContain('Sent');
    expect(wrapper.find('[data-testid="friend-search-input"]')
      .exists())
      .toBe(false);
    expect(wrapper.find('[data-testid="friends-request-banner"]')
      .exists())
      .toBe(false);
    expect(wrapper.text())
      .not
      .toContain("You don't have any pending requests");
    expect(wrapper.text())
      .toContain("You haven't connected with any friends quite yet.");
    expect(emptyStateVisible(wrapper, 'friends-requests-empty'))
      .toBe(false);
    expect(emptyStateVisible(wrapper, 'friends-sent-empty'))
      .toBe(false);
  });

  it('explains empty requests and points sent invites at Invite', async () => {
    const wrapper = await mountSuspended(FriendsPage, {
      global: testMountGlobals(),
    });
    const vm = wrapper.vm as unknown as { activeTab: 'crew' | 'requests' | 'sent' };

    vm.activeTab = 'requests';
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-testid="friends-requests-empty"]')
      .text())
      .toContain("You don't have any incoming requests.");
    expect(emptyStateVisible(wrapper, 'friends-sent-empty'))
      .toBe(false);
    expect(emptyStateVisible(wrapper, 'friends-crew-empty'))
      .toBe(false);

    vm.activeTab = 'sent';
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-testid="friends-sent-empty"]')
      .text())
      .toContain("You haven't sent any invites yet.");
    expect(wrapper.get('[data-testid="friends-sent-empty"]')
      .text())
      .toContain('Use Invite to send a friend request or email');
    expect(emptyStateVisible(wrapper, 'friends-requests-empty'))
      .toBe(false);
  });

  it('filters crew locally and banners incoming requests', async () => {
    const incoming = {
      created_at: '2024-04-25T19:33:50.250318+00:00',
      id: 42,
      recipient: friends[0]!.friend,
      recipient_id: '61b66be5-d199-48d5-898a-c521dd6b59cc',
      request_responded_at: null,
      request_sent_at: '2024-04-25T19:33:50.250318+00:00',
      sender: friends[0]!.friend,
      sender_id: friends[0]!.friend.id,
      status: FriendRequestStatus.PENDING,
      updated_at: '2024-04-25T19:33:50.250318+00:00',
    };
    supabaseClient.current = createSupabaseMock({
      from: (table) => {
        if (table === 'friends') {
          return createThenableQuery({ data: friends, error: null });
        }
        if (table === 'friend_invitations') {
          return createThenableQuery({ data: [incoming], error: null });
        }
        return createThenableQuery({ data: [], error: null });
      },
    });

    const wrapper = await mountSuspended(FriendsPage, {
      global: testMountGlobals(),
    });

    const filter = wrapper.get('[data-testid="friends-crew-filter"]');
    expect(filter.attributes('placeholder'))
      .toContain('Filter your crew');
    expect(wrapper.get('[data-testid="friends-request-banner"]')
      .text())
      .toMatch(/wants to connect/i);
    expect(wrapper.text())
      .toContain('Remove');
  });

  it('opens the invite dialog with an email field', async () => {
    const wrapper = await mountSuspended(FriendsPage, {
      attachTo: document.body,
      global: testMountGlobals(),
    });

    await wrapper.get('[data-testid="friends-invite"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    await vi.waitFor(() => {
      expect(document.body.textContent)
        .toContain('Invite friends');
      expect(document.body.querySelector('[data-testid="invite-email-input"]'))
        .toBeTruthy();
    });
  });
});
