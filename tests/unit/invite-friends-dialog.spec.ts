import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InviteFriendsDialog from '@/components/planning/dialogs/InviteFriendsDialog.vue';
import { tripFriends, trips } from '@/tests/unit/mocks/planning.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import { testMountGlobals } from './helpers';
import type { VueWrapper } from '@vue/test-utils';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const extraProfile = {
  ...tripFriends[0]!.friend_profile!,
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

const planningState = {
  data: {
    friends: tripFriends,
    pending_invites: [],
    shopping_items: [],
    todos: [],
    trip_details: [],
    trips,
  },
  pageLoading: false,
  selectedTripId: String(trips[0]!.id),
};

describe('InviteFriendsDialog', () => {
  let wrapper: VueWrapper<unknown> | undefined;

  beforeEach(() => {
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    supabaseClient.current = createSupabaseMock({
      from: (table) => {
        if (table === 'friends') {
          return createThenableQuery({
            data: [
              { profile: tripFriends[0]!.friend_profile, profile_id: tripFriends[0]!.profile_id },
              { profile: extraProfile, profile_id: extraProfile.id },
            ],
            error: null,
          });
        }
        return createThenableQuery({ data: [], error: null });
      },
      rpc: () => Promise.resolve({
        data: {
          friends: tripFriends,
          pending_invites: [],
          shopping_items: [],
          todos: [],
          trip_details: [],
          trips,
        },
        error: null,
      }),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  it('renders friend search and an email field', async () => {
    wrapper = await mountSuspended(InviteFriendsDialog, {
      attachTo: document.body,
      global: testMountGlobals({ planning: planningState }),
      props: {
        isOpen: true,
        tripId: trips[0]!.id,
        tripName: trips[0]!.name,
      },
    });

    expect(document.body.textContent)
      .toContain('Invite to My first trip');
    expect(document.body.textContent)
      .toContain('in-app invite');
    expect(document.body.querySelector('input[type="email"]'))
      .toBeTruthy();
    expect((document.body.querySelector('[data-testid="invite-submit"]') as HTMLButtonElement).disabled)
      .toBe(true);
  });

  it('marks friends already on the trip as disabled', async () => {
    wrapper = await mountSuspended(InviteFriendsDialog, {
      attachTo: document.body,
      global: testMountGlobals({ planning: planningState }),
      props: {
        isOpen: true,
        tripId: trips[0]!.id,
        tripName: trips[0]!.name,
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
      expect(options.some(option => option.disabled && option.status === 'PENDING'))
        .toBe(true);
      expect(options.some(option => option.value === extraProfile.id && !option.disabled))
        .toBe(true);
    });
  });

  it('posts emails to the server invite API and shows generic success copy', async () => {
    wrapper = await mountSuspended(InviteFriendsDialog, {
      attachTo: document.body,
      global: testMountGlobals({ planning: planningState }),
      props: {
        isOpen: true,
        tripId: trips[0]!.id,
        tripName: trips[0]!.name,
      },
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
        .toHaveBeenCalledWith('/api/trips/2/invites', {
          body: { emails: ['pat@example.com'] },
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

  it('posts to the trip passed in as a prop, not the store selectedTripId', async () => {
    wrapper = await mountSuspended(InviteFriendsDialog, {
      attachTo: document.body,
      global: testMountGlobals({
        planning: {
          ...planningState,
          selectedTripId: String(trips[0]!.id),
        },
      }),
      props: {
        isOpen: true,
        tripId: trips[1]!.id,
        tripName: trips[1]!.name,
      },
    });

    expect(document.body.textContent)
      .toContain('Invite to Appalachian Trail');

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
        .toHaveBeenCalledWith(`/api/trips/${trips[1]!.id}/invites`, {
          body: { emails: ['pat@example.com'] },
          method: 'POST',
        });
    });
    expect(fetchMock)
      .not
      .toHaveBeenCalledWith(`/api/trips/${trips[0]!.id}/invites`, expect.anything());
  });
});
