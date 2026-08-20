import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TripFriendsWidget from '@/components/planning/widgets/TripFriendsWidget.vue';
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

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

const ownerPlanningState = {
  pageLoading: false,
  selectedTripId: String(trips[0]!.id),
  data: {
    trips,
    friends: [] as typeof tripFriends,
    trip_details: [],
    todos: [],
    shopping_items: [],
  },
};

describe('TripFriendsWidget', () => {
  beforeEach(() => {
    supabaseClient.current = createSupabaseMock();
    supabaseUser.value = { sub: OWNER_ID };
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
                id: 3,
                profile_id: 'declined-friend',
                status: 'DECLINED',
                friend_profile: tripFriends[0]!.friend_profile
                  ? {
                    ...tripFriends[0]!.friend_profile,
                    id: 'declined-friend',
                    first_name: 'Dana',
                    last_name: 'Declined',
                    trail_name: null,
                  }
                  : null,
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

    await wrapper.get('[data-testid="trip-friends-invite"]')
      .trigger('click');
    await vi.waitFor(() => {
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });
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
