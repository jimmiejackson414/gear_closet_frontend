import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/stores/app';
import { normalizePlanningPageData, usePlanningStore } from '@/stores/planning';
import { todos, trips } from '@/tests/unit/mocks/planning.mock';
import {
  type QueryResult,
  createDeferred,
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';

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
          trips: [],
          pack: undefined,
          trip_details: [],
          todos: [],
          shopping_items: [],
          friends: [],
          poll: undefined,
          errors: undefined,
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
          trips: [trips[0]],
          todos: [],
          shopping_items: [],
          friends: [],
          trip_details: [],
        },
        error: null,
      });
      await Promise.resolve();
      expect(store.selectedTripId)
        .not
        .toBe('2');

      deferreds[1]!.resolve({
        data: {
          trips: [trips[1]],
          todos: [],
          shopping_items: [],
          friends: [],
          trip_details: [],
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
            trips,
            todos: [],
            shopping_items: [],
            friends: [],
            trip_details: [],
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
          trips,
          todos: [],
          shopping_items: [],
          friends: [],
          trip_details: [],
        },
        error: null,
      });
      await refresh;
      expect(store.isRefreshing)
        .toBe(false);
    });
  });

  describe('updateTodo', () => {
    it('updates local todo state on success', async () => {
      const todo = { ...todos[0]! };
      const updated = { ...todo, title: 'Updated todo', completed: true };
      supabaseClient.current = createSupabaseMock({
        from: () => createThenableQuery({ data: [updated], error: null }),
      });

      const store = usePlanningStore();
      store.data.todos = [{ ...todo }];
      store.selectedTripId = String(todo.trip_id);

      await store.updateTodo(todo, { title: 'Updated todo', completed: true });

      expect(store.data.todos[0])
        .toMatchObject({ title: 'Updated todo', completed: true });
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
});
