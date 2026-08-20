import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/stores/app';
import { useClosetStore } from '@/stores/closet';
import { selectedPack } from '@/tests/unit/mocks/closet.mock';
import {
  createDeferred,
  createSupabaseMock,
  createThenableQuery,
  type QueryResult,
} from '@/tests/unit/mocks/supabase.mock';
import type { ExtendedPack } from '@/types/closet';

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
mockNuxtImport('useRoute', () => () => ({ meta: { public: false } }));

function clonePack (): ExtendedPack {
  return structuredClone(selectedPack);
}

describe('stores/closet', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    supabaseClient.current = createSupabaseMock();
  });

  describe('fetchClosetPage', () => {
    it('ignores a stale in-flight fetch via fetchGeneration', async () => {
      const deferreds = [
        createDeferred<QueryResult>(),
        createDeferred<QueryResult>(),
      ];
      let call = 0;
      supabaseClient.current = createSupabaseMock({
        rpc: () => {
          const deferred = deferreds[call++];
          return deferred!.promise;
        },
      });

      const store = useClosetStore();
      const packA = { ...clonePack(), id: 1, name: 'Pack A' };
      const packB = { ...clonePack(), id: 2, name: 'Pack B' };

      const first = store.fetchClosetPage(1);
      const second = store.fetchClosetPage(2);

      deferreds[0]!.resolve({ data: { pack: packA, packs: [{ id: 1, name: 'Pack A', slug: 'a' }] }, error: null });
      await Promise.resolve();
      // Stale response must not win.
      expect(store.data.selectedPack?.name)
        .not
        .toBe('Pack A');

      deferreds[1]!.resolve({ data: { pack: packB, packs: [{ id: 2, name: 'Pack B', slug: 'b' }] }, error: null });
      await Promise.all([first, second]);

      expect(store.data.selectedPack?.name)
        .toBe('Pack B');
      expect(store.pageLoading)
        .toBe(false);
    });
  });

  describe('createItem', () => {
    it('rolls back the optimistic row when insert fails', async () => {
      supabaseClient.current = createSupabaseMock({
        from: (table) => {
          if (table === 'items') {
            return createThenableQuery({ data: null, error: { message: 'insert failed' } });
          }
          return createThenableQuery({ data: null, error: null });
        },
      });

      const store = useClosetStore();
      const appStore = useAppStore();
      const notifySpy = vi.spyOn(appStore, 'notifyNegative');
      store.data.selectedPack = clonePack();
      const categoryId = store.data.selectedPack!.categories[0]!.id;
      const before = store.data.selectedPack!.categories[0]!.category_items.length;

      await store.createItem(categoryId);

      expect(store.data.selectedPack!.categories[0]!.category_items)
        .toHaveLength(before);
      expect(store.data.selectedPack!.categories[0]!.category_items.every(ci => ci.id > 0))
        .toBe(true);
      expect(notifySpy)
        .toHaveBeenCalledWith('Error creating item');
    });

    it('replaces the temp id after a successful create', async () => {
      const createdItem = {
        id: 9001,
        name: 'New Item',
        generic_type: 'Description',
        price: 0,
        consumable: null,
        worn: null,
        quantity: 1,
        unit: 'g',
        weight: '0',
        url: null,
        slug: 'x',
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
        profile_id: supabaseUser.value!.sub,
      };
      const createdCategoryItem = {
        id: 8001,
        category_id: 1,
        item_id: 9001,
        position: 99,
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
      };

      supabaseClient.current = createSupabaseMock({
        from: (table) => {
          if (table === 'items') {
            return createThenableQuery({ data: [createdItem], error: null });
          }
          if (table === 'category_items') {
            return createThenableQuery({ data: [createdCategoryItem], error: null });
          }
          return createThenableQuery({ data: null, error: null });
        },
      });

      const store = useClosetStore();
      store.data.selectedPack = clonePack();
      const categoryId = store.data.selectedPack!.categories[0]!.id;
      const before = store.data.selectedPack!.categories[0]!.category_items.length;

      await store.createItem(categoryId);

      const items = store.data.selectedPack!.categories[0]!.category_items;
      expect(items)
        .toHaveLength(before + 1);
      const created = items.find(ci => ci.item_id === 9001);
      expect(created)
        .toBeTruthy();
      expect(created!.id)
        .toBe(8001);
      expect(created!.item.id)
        .toBe(9001);
    });
  });

  describe('updateItem', () => {
    it('ignores a stale update response', async () => {
      const deferreds = [
        createDeferred<QueryResult>(),
        createDeferred<QueryResult>(),
      ];
      let call = 0;
      supabaseClient.current = createSupabaseMock({
        from: () => {
          const deferred = deferreds[call++];
          return {
            ...createThenableQuery({ data: null, error: null }),
            update: vi.fn(() => ({
              eq: vi.fn(() => ({
                select: vi.fn(() => deferred!.promise),
              })),
            })),
          };
        },
      });

      const store = useClosetStore();
      store.data.selectedPack = clonePack();
      const category = store.data.selectedPack!.categories[0]!;
      const categoryItem = category.category_items[0]!;
      const item = categoryItem.item;

      const first = store.updateItem(item, 'name', 'First', category.id);
      const second = store.updateItem(item, 'name', 'Second', category.id);

      // Resolve stale first response after second already applied optimistically.
      deferreds[0]!.resolve({
        data: [{ ...item, name: 'First-from-server' }],
        error: null,
      });
      await Promise.resolve();

      deferreds[1]!.resolve({
        data: [{ ...item, name: 'Second-from-server' }],
        error: null,
      });
      await Promise.all([first, second]);

      expect(categoryItem.item.name)
        .toBe('Second-from-server');
    });
  });
});
