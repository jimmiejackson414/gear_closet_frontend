import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TripFriendsWidget from '@/components/planning/widgets/TripFriendsWidget.vue';
import { createSupabaseMock } from '@/tests/unit/mocks/supabase.mock';
import { tripFriends, trips } from '@/tests/unit/mocks/planning.mock';
import { testMountGlobals } from './helpers';

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

describe('TripFriendsWidget', () => {
  beforeEach(() => {
    supabaseClient.current = createSupabaseMock();
  });

  it('renders names and statuses from nested friend_profile without querying profiles', async () => {
    const wrapper = await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          pageLoading: false,
          data: {
            trips,
            friends: tripFriends,
            trip_details: [],
            todos: [],
            shopping_items: [],
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
    expect(supabaseClient.current?.from)
      .not
      .toHaveBeenCalled();
  });

  it('does not fetch profiles for the empty friends list', async () => {
    await mountSuspended(TripFriendsWidget, {
      global: testMountGlobals({
        planning: {
          pageLoading: false,
          data: {
            trips,
            friends: [],
            trip_details: [],
            todos: [],
            shopping_items: [],
          },
        },
      }),
    });

    expect(supabaseClient.current?.from)
      .not
      .toHaveBeenCalled();
  });
});
