import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/stores/app';
import { normalizePlanningPageData, usePlanningStore, type PlanningPageData } from '@/stores/planning';
import { todos, tripDetails, tripFriends, trips } from '@/tests/unit/mocks/planning.mock';
import {
  createDeferred,
  createSupabaseMock,
  createThenableQuery,
  type QueryResult,
} from '@/tests/unit/mocks/supabase.mock';
import { ResourceType, TripDetailsType } from '@/types';

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

const SESSION_USER_ID = '61b66be5-d199-48d5-898a-c521dd6b59cc';

describe('stores/planning', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    supabaseClient.current = createSupabaseMock();
  });

  describe('normalizePlanningPageData', () => {
    it('fills empty arrays for null/undefined payloads', () => {
      expect(normalizePlanningPageData(undefined))
        .toEqual({
          errors: undefined,
          friends: [],
          pack: undefined,
          party_packs: [],
          pending_invites: [],
          poll: undefined,
          shopping_items: [],
          todos: [],
          trip_details: [],
          trips: [],
        });
      expect(normalizePlanningPageData(null).trips)
        .toEqual([]);
    });

    it('preserves partial payloads safely', () => {
      const normalized = normalizePlanningPageData({
        trips,
      } as any);
      expect(normalized.trips)
        .toEqual(trips);
      expect(normalized.todos)
        .toEqual([]);
      expect(normalized.shopping_items)
        .toEqual([]);
      expect(normalized.party_packs)
        .toEqual([]);
    });

    it('keeps nested friend_profile from the RPC payload', () => {
      const normalized = normalizePlanningPageData({
        friends: tripFriends,
        trips,
      } as any);
      expect(normalized.friends)
        .toEqual(tripFriends);
      expect(normalized.friends[0]?.friend_profile?.first_name)
        .toBe('Shelly');
    });

    it('treats an empty pack array from the RPC as no pack', () => {
      const normalized = normalizePlanningPageData({
        pack: [] as unknown as PlanningPageData['pack'],
        trips,
      } as any);
      expect(normalized.pack)
        .toBeUndefined();
    });

    it('coerces nested party packs and ignores a non-array party_packs payload', () => {
      const normalized = normalizePlanningPageData({
        party_packs: [
          { display_name: 'Junebug', pack: [], profile_id: 'friend-id' },
        ],
        trips,
      } as any);
      expect(normalized.party_packs[0]?.pack)
        .toBeUndefined();

      const empty = normalizePlanningPageData({
        party_packs: {} as unknown as PlanningPageData['party_packs'],
        trips,
      } as any);
      expect(empty.party_packs)
        .toEqual([]);
    });
  });

  describe('fetchPlanningPage', () => {
    it('ignores stale in-flight fetches', async () => {
      const deferreds = [
        createDeferred<QueryResult>(),
        createDeferred<QueryResult>(),
      ];
      let call = 0;
      supabaseClient.current = createSupabaseMock({
        rpc: () => deferreds[call++]!.promise,
      });

      const store = usePlanningStore();
      store.pageLoading = false;
      store.data.trips = [...trips];

      const first = store.fetchPlanningPage(2);
      const second = store.fetchPlanningPage(3);

      deferreds[0]!.resolve({
        data: {
          friends: [],
          shopping_items: [],
          todos: [],
          trip_details: [],
          trips: [trips[0]],
        },
        error: null,
      });
      await Promise.resolve();
      expect(store.selectedTripId)
        .not
        .toBe('2');

      deferreds[1]!.resolve({
        data: {
          friends: [],
          shopping_items: [],
          todos: [],
          trip_details: [],
          trips: [trips[1]],
        },
        error: null,
      });
      await Promise.all([first, second]);

      expect(store.selectedTripId)
        .toBe(String(trips[1]!.id));
      expect(store.isRefreshing)
        .toBe(false);
      expect(store.pageLoading)
        .toBe(false);
    });

    it('uses pageLoading on initial load and isRefreshing on subsequent loads', async () => {
      supabaseClient.current = createSupabaseMock({
        rpc: () => Promise.resolve({
          data: {
            friends: [],
            shopping_items: [],
            todos: [],
            trip_details: [],
            trips,
          },
          error: null,
        }),
      });

      const store = usePlanningStore();
      expect(store.pageLoading)
        .toBe(true);

      await store.fetchPlanningPage(0);
      expect(store.pageLoading)
        .toBe(false);
      expect(store.isRefreshing)
        .toBe(false);
      expect(store.data.trips.length)
        .toBeGreaterThan(0);

      let resolveRefresh!: (value: QueryResult) => void;
      supabaseClient.current = createSupabaseMock({
        rpc: () => new Promise((resolve) => {
          resolveRefresh = resolve;
        }),
      });

      const refresh = store.fetchPlanningPage(Number(store.selectedTripId));
      expect(store.isRefreshing)
        .toBe(true);
      expect(store.pageLoading)
        .toBe(false);

      resolveRefresh!({
        data: {
          friends: [],
          shopping_items: [],
          todos: [],
          trip_details: [],
          trips,
        },
        error: null,
      });
      await refresh;
      expect(store.isRefreshing)
        .toBe(false);
    });

    it('selects the requested trip even when payload ids are strings', async () => {
      supabaseClient.current = createSupabaseMock({
        rpc: () => Promise.resolve({
          data: {
            friends: [],
            shopping_items: [],
            todos: [],
            trip_details: [],
            trips: trips.map((trip) => ({ ...trip, id: String(trip.id) as unknown as number })),
          },
          error: null,
        }),
      });

      const store = usePlanningStore();
      await store.fetchPlanningPage(trips[1]!.id);

      expect(store.selectedTripId)
        .toBe(String(trips[1]!.id));
    });

    it('does not fall back to the first trip when the requested trip is missing', async () => {
      supabaseClient.current = createSupabaseMock({
        rpc: () => Promise.resolve({
          data: {
            friends: [],
            shopping_items: [],
            todos: [],
            trip_details: [],
            trips,
          },
          error: null,
        }),
      });

      const store = usePlanningStore();
      await store.fetchPlanningPage(99);

      expect(store.selectedTripId)
        .toBe('99');
      expect(store.selectedTrip)
        .toBeUndefined();
    });
  });

  describe('updateTodo', () => {
    it('updates local todo state on success', async () => {
      const todo = { ...todos[0]! };
      const updated = { ...todo, completed: true, title: 'Updated todo' };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: [updated], error: null }),
      });

      const store = usePlanningStore();
      store.data.todos = [{ ...todo }];
      store.selectedTripId = String(todo.trip_id);

      await store.updateTodo(todo, { completed: true, title: 'Updated todo' });

      expect(store.data.todos[0])
        .toMatchObject({ completed: true, title: 'Updated todo' });
    });

    it('toasts and leaves list unchanged on failure', async () => {
      const todo = { ...todos[0]! };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: null, error: { message: 'nope' } }),
      });

      const store = usePlanningStore();
      const appStore = useAppStore();
      const notifySpy = vi.spyOn(appStore, 'notifyNegative');
      store.data.todos = [{ ...todo }];

      await store.updateTodo(todo, { title: 'Should not stick' });

      expect(store.data.todos[0]?.title)
        .toBe(todo.title);
      expect(notifySpy)
        .toHaveBeenCalledWith('nope');
    });
  });

  describe('batchUpdateTodos', () => {
    it('no-ops when completed is indeterminate', async () => {
      const fromSpy = vi.fn();
      supabaseClient.current = createSupabaseMock({ from: fromSpy });
      const store = usePlanningStore();
      store.data.todos = [{ ...todos[0]! }];

      await store.batchUpdateTodos('indeterminate', ResourceType.USER);

      expect(fromSpy)
        .not
        .toHaveBeenCalled();
    });

    it('upserts and replaces todos for the matching resource type', async () => {
      const userTodo = { ...todos[0]!, completed: false, id: 1, resource_type: ResourceType.USER };
      const groupTodo = {
        ...todos[0]!,
        completed: false,
        id: 2,
        resource_type: ResourceType.GROUP,
        title: 'Group chore',
      };
      const updated = [
        { ...userTodo, completed: true },
        groupTodo,
      ];
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: updated, error: null }),
      });

      const store = usePlanningStore();
      store.data.todos = [userTodo, groupTodo];

      await store.batchUpdateTodos(true, ResourceType.USER);

      expect(store.data.todos)
        .toEqual(updated);
      expect(store.data.todos.find((t) => t.id === 1)?.completed)
        .toBe(true);
      expect(store.data.todos.find((t) => t.id === 2)?.completed)
        .toBe(false);
    });
  });

  describe('batchUpdateShoppingItems', () => {
    it('upserts completed flags for matching shopping items', async () => {
      const item = {
        completed: false,
        created_at: '2024-04-21T01:21:08.285444+00:00',
        id: 1,
        profile_id: '61b66be5-d199-48d5-898a-c521dd6b59cc',
        quantity: 1,
        resource_type: ResourceType.USER,
        title: 'Socks',
        trip_id: 2,
        updated_at: '2024-04-21T01:21:08.285444+00:00',
      };
      const updated = [{ ...item, completed: true }];
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: updated, error: null }),
      });

      const store = usePlanningStore();
      store.data.shopping_items = [item];

      await store.batchUpdateShoppingItems(true, ResourceType.USER);

      expect(store.data.shopping_items[0]?.completed)
        .toBe(true);
    });
  });

  describe('isSelectedTripOwner', () => {
    it('is true when the selected trip belongs to the session user', () => {
      const store = usePlanningStore();
      store.data.trips = [...trips];
      store.selectedTripId = String(trips[0]!.id);

      expect(store.isSelectedTripOwner)
        .toBe(true);
    });

    it('is false for an accepted invite trip', () => {
      const store = usePlanningStore();
      store.data.trips = [{ ...trips[0]!, profile_id: 'someone-else' }];
      store.selectedTripId = String(trips[0]!.id);

      expect(store.isSelectedTripOwner)
        .toBe(false);
    });
  });

  describe('canEditSelectedTrip', () => {
    it('is true for the trip owner', () => {
      const store = usePlanningStore();
      store.data.trips = [...trips];
      store.selectedTripId = String(trips[0]!.id);

      expect(store.canEditSelectedTrip)
        .toBe(true);
    });

    it('is true for an accepted invitee', () => {
      const store = usePlanningStore();
      store.data.trips = [{ ...trips[0]!, profile_id: 'someone-else' }];
      store.selectedTripId = String(trips[0]!.id);
      // Nested profile types on ExtendedTripFriend hit TS2589 if assigned structurally.
      (store.data as { friends: Array<{ profile_id: string; status: string }> }).friends = [{
        profile_id: SESSION_USER_ID,
        status: 'ACCEPTED',
      }];

      expect(store.isSelectedTripOwner)
        .toBe(false);
      expect(store.canEditSelectedTrip)
        .toBe(true);
    });

    it('is false for a pending invitee', () => {
      const store = usePlanningStore();
      store.data.trips = [{ ...trips[0]!, profile_id: 'someone-else' }];
      store.selectedTripId = String(trips[0]!.id);
      (store.data as { friends: Array<{ profile_id: string; status: string }> }).friends = [{
        profile_id: SESSION_USER_ID,
        status: 'PENDING',
      }];

      expect(store.canEditSelectedTrip)
        .toBe(false);
    });
  });

  describe('deleteSelectedTrip', () => {
    it('does not delete when the user does not own the trip', async () => {
      const rpc = vi.fn();
      supabaseClient.current = createSupabaseMock({ rpc });

      const store = usePlanningStore();
      store.data.trips = [{ ...trips[0]!, profile_id: 'someone-else' }];
      store.selectedTripId = String(trips[0]!.id);

      const ok = await store.deleteSelectedTrip();
      expect(ok)
        .toBe(false);
      expect(rpc)
        .not
        .toHaveBeenCalled();
    });

    it('deletes the owned trip and loads the remaining list', async () => {
      const rpc = vi.fn((fn: string) => {
        if (fn === 'delete_trip') return Promise.resolve({ data: null, error: null });
        return Promise.resolve({
          data: {
            friends: [],
            shopping_items: [],
            todos: [],
            trip_details: [],
            trips: [trips[1]],
          },
          error: null,
        });
      });
      supabaseClient.current = createSupabaseMock({ rpc });

      const store = usePlanningStore();
      store.pageLoading = false;
      store.data.trips = [...trips];
      store.selectedTripId = String(trips[0]!.id);

      const ok = await store.deleteSelectedTrip();
      expect(ok)
        .toBe(true);
      expect(rpc)
        .toHaveBeenCalledWith('delete_trip', { p_trip_id: trips[0]!.id });
      expect(store.selectedTripId)
        .toBe(String(trips[1]!.id));
    });

    it('toasts and skips refetch when the rpc fails', async () => {
      const rpc = vi.fn((fn: string) => {
        if (fn === 'delete_trip') {
          return Promise.resolve({ data: null, error: { message: 'nope' } });
        }
        return Promise.resolve({ data: { trips }, error: null });
      });
      supabaseClient.current = createSupabaseMock({ rpc });

      const store = usePlanningStore();
      store.pageLoading = false;
      store.data.trips = [...trips];
      store.selectedTripId = String(trips[0]!.id);

      const ok = await store.deleteSelectedTrip();
      expect(ok)
        .toBe(false);
      expect(store.selectedTripId)
        .toBe(String(trips[0]!.id));
      expect(rpc.mock.calls.some(call => call[0] === 'get_planning_page_data'))
        .toBe(false);
    });
  });

  describe('viewTripPack', () => {
    it('toggles a friend pack and resets when the selected trip changes', () => {
      const store = usePlanningStore();
      store.selectedTripId = String(trips[0]!.id);

      store.viewTripPack('friend-id');
      expect(store.viewedPackProfileId)
        .toBe('friend-id');

      store.viewTripPack('friend-id');
      expect(store.viewedPackProfileId)
        .toBeUndefined();

      store.viewTripPack('friend-id');
      store.selectedTripId = String(trips[1]!.id);
      expect(store.viewedPackProfileId)
        .toBeUndefined();
    });
  });

  describe('trip details CRUD', () => {
    it('creates a detail from the submitted payload and returns it', async () => {
      const payload = {
        title: 'Campsite notes',
        type: TripDetailsType.HIKE,
        url: null,
        value: 'Bring a bear can',
      };
      const created = {
        ...tripDetails[0]!,
        id: 99,
        ...payload,
      };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: [created], error: null }),
      });

      const store = usePlanningStore();
      store.selectedTripId = String(trips[0]!.id);
      store.data.trip_details = [];

      const detail = await store.createTripDetail(payload);
      expect(detail)
        .toEqual(created);
      expect(store.data.trip_details)
        .toEqual([created]);
    });

    it('updates a detail in local state on success', async () => {
      const updated = { ...tripDetails[0]!, title: 'Campsite', url: null };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: [updated], error: null }),
      });

      const store = usePlanningStore();
      store.data.trip_details = [{ ...tripDetails[0]! }];

      const ok = await store.updateTripDetail(tripDetails[0]!.id, { title: 'Campsite' });
      expect(ok)
        .toBe(true);
      expect(store.data.trip_details[0]?.title)
        .toBe('Campsite');
    });

    it('removes a deleted detail from local state', async () => {
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: null, error: null }),
      });

      const store = usePlanningStore();
      store.data.trip_details = [...tripDetails];

      const ok = await store.deleteTripDetail(tripDetails[0]!.id);
      expect(ok)
        .toBe(true);
      expect(store.data.trip_details.find(detail => detail.id === tripDetails[0]!.id))
        .toBeUndefined();
    });
  });
});
