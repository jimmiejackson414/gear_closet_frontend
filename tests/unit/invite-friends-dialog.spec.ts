import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InviteFriendsDialog from '@/components/planning/dialogs/InviteFriendsDialog.vue';
import { tripFriends, trips } from '@/tests/unit/mocks/planning.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import { testMountGlobals } from './helpers';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const extraProfile = {
  ...tripFriends[0]!.friend_profile!,
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  email: 'other.friend@example.com',
  first_name: 'Other',
  last_name: 'Friend',
  trail_name: null,
  image: null,
};

const supabaseUser = vi.hoisted(() => ({
  value: { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' } as { sub: string } | null,
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

const planningState = {
  pageLoading: false,
  selectedTripId: String(trips[0]!.id),
  data: {
    trips,
    friends: tripFriends,
    trip_details: [],
    todos: [],
    shopping_items: [],
  },
};

describe('InviteFriendsDialog', () => {
  beforeEach(() => {
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
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
    });
  });

  it('renders friend search and an email field', async () => {
    await mountSuspended(InviteFriendsDialog, {
      global: testMountGlobals({ planning: planningState }),
      attachTo: document.body,
      props: { isOpen: true },
    });

    expect(document.body.textContent)
      .toContain('Invite to trip');
    expect(document.body.textContent)
      .toContain('in-app invite');
    expect(document.body.querySelector('input[type="email"]'))
      .toBeTruthy();
    expect((document.body.querySelector('[data-testid="invite-submit"]') as HTMLButtonElement).disabled)
      .toBe(true);
  });

  it('marks friends already on the trip as disabled', async () => {
    const wrapper = await mountSuspended(InviteFriendsDialog, {
      global: testMountGlobals({ planning: planningState }),
      attachTo: document.body,
      props: { isOpen: true },
    });
    const select = wrapper.findComponent({ name: 'Multiselect' });

    select.vm.$emit('search', 'Shelly');
    await vi.waitFor(() => {
      const options = select.props('options') as Array<{ disabled?: boolean; status?: string }>;
      expect(options.some(option => option.disabled && option.status === 'PENDING'))
        .toBe(true);
      expect(options.some(option => option.value === extraProfile.id && !option.disabled))
        .toBe(true);
    });
  });
});
