import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FriendInviteDialog from '@/components/friends/FriendInviteDialog.vue';
import { friends } from '@/tests/unit/mocks/dashboard.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import { testMountGlobals } from './helpers';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const extraProfile = {
  ...friends[0]!.friend,
  email: 'other.friend@example.com',
  first_name: 'Other',
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  image: null,
  last_name: 'Friend',
  trail_name: null,
};

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

describe('FriendInviteDialog', () => {
  beforeEach(() => {
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: [], error: null }),
      rpc: () => createThenableQuery({
        data: [friends[0]!.friend, extraProfile],
        error: null,
      }),
    });
  });

  it('renders directory search and an email field', async () => {
    await mountSuspended(FriendInviteDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: { isOpen: true },
    });

    expect(document.body.textContent)
      .toContain('Invite friends');
    expect(document.body.textContent)
      .toContain('in-app request');
    expect(document.body.querySelector('input[type="email"]'))
      .toBeTruthy();
    expect((document.body.querySelector('[data-testid="invite-submit"]') as HTMLButtonElement).disabled)
      .toBe(true);
    expect((document.body.querySelector('[data-testid="invite-email-add"]') as HTMLButtonElement).disabled)
      .toBe(true);
  });

  it('enables Add only for a valid email', async () => {
    const wrapper = await mountSuspended(FriendInviteDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: { isOpen: true },
    });

    const addButton = () =>
      document.body.querySelector('[data-testid="invite-email-add"]') as HTMLButtonElement;
    const emailInput = document.body.querySelector('input[type="email"]') as HTMLInputElement;

    expect(addButton().disabled)
      .toBe(true);

    emailInput.value = 'pat@';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(addButton().disabled)
      .toBe(true);

    emailInput.value = 'pat@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(addButton().disabled)
      .toBe(false);
  });

  it('marks existing friends and pending invites as disabled', async () => {
    const wrapper = await mountSuspended(FriendInviteDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: {
        friendProfileIds: [friends[0]!.friend.id],
        isOpen: true,
        pendingProfileIds: [],
      },
    });
    const select = wrapper.findComponent({ name: 'Multiselect' });

    select.vm.$emit('search', 'Shelly');
    await vi.waitFor(() => {
      const options = select.props('options') as Array<{
        disabled?: boolean;
        status?: string;
        value?: string;
      }>;
      expect(options.some(option => option.disabled && option.status === 'Friend'))
        .toBe(true);
      expect(options.some(option => option.value === extraProfile.id && !option.disabled))
        .toBe(true);
    });
  });

  it('posts emails to the friend invite API and shows generic success copy', async () => {
    const wrapper = await mountSuspended(FriendInviteDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: { isOpen: true },
    });

    const emailInput = document.body.querySelector('input[type="email"]') as HTMLInputElement;
    emailInput.value = 'pat@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    await wrapper.vm.$nextTick();

    (document.body.querySelector('[data-testid="invite-email-add"]') as HTMLButtonElement).click();
    await wrapper.vm.$nextTick();
    await vi.waitFor(() => {
      expect(document.body.textContent)
        .toContain('pat@example.com');
    });

    (document.body.querySelector('[data-testid="invite-submit"]') as HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(fetchMock)
        .toHaveBeenCalledWith('/api/friends/invites', {
          body: { email: 'pat@example.com' },
          method: 'POST',
        });
    });

    expect(fetchMock.mock.calls[0]?.[1])
      .not
      .toHaveProperty('found');
    expect(document.body.textContent)
      .not
      .toMatch(/no account found|account exists/i);
  });
});
