import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TripFriendsWidget from '@/components/planning/widgets/TripFriendsWidget.vue';
import { usePlanningStore } from '@/stores/planning';
import { tripFriends, trips } from '@/tests/unit/mocks/planning.mock';
import { createSupabaseMock } from '@/tests/unit/mocks/supabase.mock';
import { isDialogRootOpen, testMountGlobals } from './helpers';

const OWNER_ID = '61b66be5-d199-48d5-898a-c521dd6b59cc';

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

const ownerPlanningState = {
  data: {
    friends: [] as typeof tripFriends,
    pending_invites: [] as Array<{
      id: number;
      trip_id: number;
      email: string;
      status: 'PENDING';
      expires_at: string;
      created_at: string;
    }>,
    shopping_items: [],
    todos: [],
    trip_details: [],
    trips,
  },
  pageLoading: false,
  selectedTripId: String(trips[0]!.id),
};

describe('TripFriendsWidget', () => {
  beforeEach(() => {
    supabaseClient.current = createSupabaseMock();
    supabaseUser.value = { sub: OWNER_ID };
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
  });

  it('renders names and statuses from nested friend_profile without querying profiles', async () => {
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          ...ownerPlanningState,
          data: {
            ...ownerPlanningState.data,
            friends: [
              ...tripFriends,
              {
                ...tripFriends[0]!,
                friend_profile: tripFriends[0]!.friend_profile
                  ? {
                    ...tripFriends[0]!.friend_profile,
                    first_name: 'Dana',
                    id: 'declined-friend',
                    last_name: 'Declined',
                    trail_name: null,
                  }
                  : null,
                id: 3,
                profile_id: 'declined-friend',
                status: 'DECLINED',
              },
            ],
          },
        },
      }),
    });

    expect(wrapper.text())
      .toContain('Shelly Borga');
    expect(wrapper.text())
      .toContain('Pending');
    expect(wrapper.text())
      .toContain('Unknown friend');
    expect(wrapper.text())
      .toContain('Accepted');
    expect(wrapper.text())
      .toContain('Declined');
    expect(supabaseClient.current?.from)
      .not
      .toHaveBeenCalled();
  });

  it('lists pending email invites separately from trip members', async () => {
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          ...ownerPlanningState,
          data: {
            ...ownerPlanningState.data,
            friends: tripFriends,
            pending_invites: [{
              created_at: '2026-08-20T00:00:00.000Z',
              email: 'new.person@example.com',
              expires_at: '2026-09-03T00:00:00.000Z',
              id: 44,
              status: 'PENDING',
              trip_id: 2,
            }],
          },
        },
      }),
    });

    expect(wrapper.text())
      .toContain('new.person@example.com');
    expect(wrapper.text())
      .toContain('Resend');
    expect(wrapper.find('[data-testid="trip-friends-empty-invite"]')
      .exists())
      .toBe(false);
  });

  it('opens an accepted friend pack from their avatar and toggles back', async () => {
    const acceptedFriend = {
      ...tripFriends[0]!,
      id: 9,
      status: 'ACCEPTED' as const,
    };
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          ...ownerPlanningState,
          data: {
            ...ownerPlanningState.data,
            friends: [acceptedFriend, tripFriends[0]!],
          },
        },
      }),
    });
    const store = usePlanningStore();

    expect(wrapper.findAll('[data-testid="trip-friend-pack-avatar"]'))
      .toHaveLength(1);

    await wrapper.get('[data-testid="trip-friend-pack-avatar"]')
      .trigger('click');
    expect(store.viewedPackProfileId)
      .toBe(acceptedFriend.profile_id);

    await wrapper.get('[data-testid="trip-friend-pack-avatar"]')
      .trigger('click');
    expect(store.viewedPackProfileId)
      .toBeUndefined();
  });

  it('does not fetch profiles for the empty friends list', async () => {
    await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          ...ownerPlanningState,
          data: {
            ...ownerPlanningState.data,
            friends: [],
          },
        },
      }),
    });

    expect(supabaseClient.current?.from)
      .not
      .toHaveBeenCalled();
  });

  it('shows invite controls for an empty trip the user owns', async () => {
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: ownerPlanningState,
      }),
    });

    expect(wrapper.find('[data-testid="trip-friends-invite"]')
      .exists())
      .toBe(true);
    expect(wrapper.find('[data-testid="trip-friends-empty-invite"]')
      .exists())
      .toBe(true);
    expect(wrapper.text())
      .toContain('Invite from Friends or by email.');
    expect(wrapper.text())
      .not
      .toContain('in-app invite');

    await wrapper.get('[data-testid="trip-friends-invite"]')
      .trigger('click');
    await vi.waitFor(() => {
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });
  });

  it('pins the selected trip when opening the invite dialog', async () => {
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          ...ownerPlanningState,
          selectedTripId: String(trips[1]!.id),
        },
      }),
    });

    await wrapper.get('[data-testid="trip-friends-invite"]')
      .trigger('click');
    await vi.waitFor(() => {
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });

    const dialog = wrapper.getComponent({ name: 'InviteFriendsDialog' });
    expect(dialog.props('tripId'))
      .toBe(trips[1]!.id);
    expect(dialog.props('tripName'))
      .toBe(trips[1]!.name);
  });

  it('resends a pending invite to that invite trip id, not the store selection', async () => {
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          ...ownerPlanningState,
          data: {
            ...ownerPlanningState.data,
            friends: tripFriends,
            pending_invites: [{
              created_at: '2026-08-20T00:00:00.000Z',
              email: 'new.person@example.com',
              expires_at: '2026-09-03T00:00:00.000Z',
              id: 44,
              status: 'PENDING',
              trip_id: trips[1]!.id,
            }],
          },
          selectedTripId: String(trips[0]!.id),
        },
      }),
    });

    await wrapper.get('[data-testid="trip-invite-resend"]')
      .trigger('click');

    await vi.waitFor(() => {
      expect(fetchMock)
        .toHaveBeenCalledWith(`/api/trips/${trips[1]!.id}/invites`, {
          body: { emails: ['new.person@example.com'] },
          method: 'POST',
        });
    });
    expect(fetchMock)
      .not
      .toHaveBeenCalledWith(`/api/trips/${trips[0]!.id}/invites`, expect.anything());
  });

  it('hides invite controls when the user does not own the trip', async () => {
    supabaseUser.value = { sub: 'someone-else' };
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: ownerPlanningState,
      }),
    });

    expect(wrapper.find('[data-testid="trip-friends-invite"]')
      .exists())
      .toBe(false);
    expect(wrapper.find('[data-testid="trip-friends-empty-invite"]')
      .exists())
      .toBe(false);
  });
});
