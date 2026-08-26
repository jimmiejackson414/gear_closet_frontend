import { defineStore } from "pinia";
import type { Database, Tables, TablesUpdate } from "@/types";
import type { ExtendedCategoryItem, ExtendedPack, PublicPack } from "@/types/closet";

export interface ClosetPageData {
  selectedPack?: ExtendedPack | PublicPack;
  allPacks: {
    id: number;
    name: string;
    slug: string;
    locked_at?: string | null;
  }[];

}

interface ClosetPageResponse {
  pack: ExtendedPack;
  packs: {
    id: number;
    name: string;
    slug: string;
    locked_at?: string | null;
  }[];
}

/** Item columns editable inline from the pack table. */
type EditableItemField =
  | 'consumable'
  | 'generic_type'
  | 'name'
  | 'price'
  | 'quantity'
  | 'unit'
  | 'url'
  | 'weight'
  | 'worn';

/** Unique negative ids for optimistic createItem rows. */
let tempIdCounter = 0;
const nextTempId = () => --tempIdCounter;

/** Per-item generation so stale updateItem responses are ignored. */
const itemUpdateGenerations = new Map<number, number>();

export const useClosetStore = defineStore('closet', () => {
  const activeCategoryId = ref<number | undefined>(undefined);
  const activeItem = ref<Tables<'items'> | undefined>(undefined);
  const data = ref<ClosetPageData>({
    allPacks: [],
    selectedPack: undefined,
  });
  const dialogStates = ref({
    addUrlDialog: false,
    deleteCategoryDialog: false,
    deletePackDialog: false,
    managePackSettingsDialog: false,
    removeItemDialog: false,
    sharePackDialog: false,
    uploadCsvDialog: false,
  });
  /** Monotonic id so stale in-flight fetches don't overwrite newer results. */
  const fetchGeneration = ref(0);
  const pageLoading = ref(true);

  const isPublicRoute = computed(() => {
    const $route = useRoute();
    return $route.meta.public as boolean || false;
  });

  /**
   * Fetches the closet page data.
   * @param packId The pack id.
   */
  const fetchClosetPage = async (packId: number) => {
    const $store = useAppStore();
    const generation = ++fetchGeneration.value;
    pageLoading.value = true;

    try {
      const supabase = useSupabaseClient<Database>();
      const resolvedPackId = Number.isFinite(packId) ? packId : 0;

      const { data: pageData, error } = await supabase
        .rpc('get_closet_page_data', { p_pack_id: resolvedPackId || 0 });

      if (generation !== fetchGeneration.value) return;

      if (error) {
        $store.notifyNegative(error.message || 'An error occurred fetching the closet page.');
        return;
      }

      if (pageData) {
        // The RPC is typed as returning Json, so its shape can only be asserted.
        const response = pageData as unknown as ClosetPageResponse;
        data.value.selectedPack = response.pack;
        data.value.allPacks = response.packs || [];
      }
    } catch (err) {
      if (generation !== fetchGeneration.value) return;
      const message = err instanceof Error ? err.message : '';
      $store.notifyNegative(message || 'An error occurred fetching the closet page.');
    } finally {
      if (generation === fetchGeneration.value) {
        pageLoading.value = false;
      }
    }
  };

  /**
   * Optimistically creates a new item.
   * @param categoryId The category id.
   */
  const createItem = async (categoryId: number) => {
    const $store = useAppStore();
    const $userStore = useUserStore();
    if (
      !$userStore.isPaidMember
      && data.value.selectedPack
      && 'locked_at' in data.value.selectedPack
      && data.value.selectedPack.locked_at
    ) {
      $store.notifyNegative('This pack is locked on the Free plan. Upgrade or change your Free selection to edit it.');
      return;
    }
    const tempId = nextTempId();

    try {
      const user = useSupabaseUser();
      const supabase = useSupabaseClient<Database>();

      // Find the category up front for later use
      const category = data.value.selectedPack?.categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Category not found');

      // Generate the new item for both server request and optimistic update
      const newItem = { ...generateItem(), profile_id: user.value?.sub } as Tables<'items'>;
      const optimisticItem = { ...newItem, id: tempId };

      // Optimistic update for category item
      const optimisticCategoryItem = {
        category_id: categoryId,
        created_at: new Date()
          .toISOString(),
        id: tempId,
        item: optimisticItem,
        item_id: tempId,
        position: (category?.category_items?.length ?? 0) + 1,
        updated_at: new Date()
          .toISOString(),
      };

      // Optimistically update category's category_items
      const updatedCategoryItems = [...category.category_items, optimisticCategoryItem];

      // Perform optimistic update
      data.value.selectedPack!.categories = data.value.selectedPack!.categories.map(cat =>
        cat.id === categoryId ? { ...cat, category_items: updatedCategoryItems } : cat,
      );

      // Insert the new item into the database
      const { data: createdItem, error: itemError } = await supabase.from('items')
        .insert([newItem])
        .select();

      if (itemError) throw itemError;

      const created = createdItem?.[0];
      if (!created) throw new Error('Failed to create item');

      // Create the new category_item after item is created
      const newCategoryItem = {
        category_id: categoryId,
        item_id: created.id,
        position: updatedCategoryItems.length,
      };

      const { data: createdCategoryItem, error: categoryItemError } = await supabase.from('category_items')
        .insert([newCategoryItem])
        .select();

      if (categoryItemError) throw categoryItemError;

      const createdCatItem = createdCategoryItem?.[0];
      if (!createdCatItem) throw new Error('Failed to create category item');

      // Replace the temporary optimistic item with the real item after creation
      const finalCategoryItem = {
        ...optimisticCategoryItem,
        id: createdCatItem.id,
        item: created,
        item_id: created.id,
      };

      // Final optimistic update of category items
      data.value.selectedPack!.categories = data.value.selectedPack!.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, category_items: cat.category_items.map(item =>
            item.id === tempId ? finalCategoryItem : item,
          ) }
          : cat,
      );
    } catch {
      const category = data.value.selectedPack?.categories.find(cat => cat.id === categoryId);
      if (category) {
        // Rollback the optimistic update by filtering out the temp item
        category.category_items = category.category_items.filter(item => item.id !== tempId);
      }
      $store.notifyNegative('Error creating item');
    }
  };

  /**
   * Updates the category items.
   * @param payload Tables<'category_items'>[]
   * @returns void
   */
  const updateCategoryItems = async (payload: TablesUpdate<'category_items'>[]) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();

      const { data: updatedCategoryItemsData, error } = await supabase.from('category_items')
        .upsert(payload)
        .select(`*, item:items(*)`);

      if (error || !updatedCategoryItemsData) {
        $appStore.notifyNegative('There was an error updating the category items.');
        const packId = data.value.selectedPack?.id;
        if (packId != null) {
          await fetchClosetPage(packId);
        }
        return;
      }

      const updatedCategoryItems = updatedCategoryItemsData as ExtendedCategoryItem[];
      const firstUpdated = updatedCategoryItems[0];
      if (!firstUpdated) return;

      // Check if all category_id values are the same (indicating a single category or multiple)
      const isSingleCategory = updatedCategoryItems.every(
        (item) => item.category_id === firstUpdated.category_id,
      );

      if (isSingleCategory) {
        const singleCategoryId = firstUpdated.category_id;
        const categoryIndex = data.value.selectedPack?.categories.findIndex(
          (c) => c.id === singleCategoryId,
        );

        if (categoryIndex !== undefined && categoryIndex !== -1) {
          const category = data.value.selectedPack!.categories[categoryIndex];
          if (!category) return;

          category.category_items = category.category_items.map(item => {
            const updatedItem = updatedCategoryItems.find(updated => updated.id === item.id);
            if (updatedItem) {
              return { ...item, ...updatedItem };
            }
            return item;
          });
        }
      } else {
        // Handle multiple categories by grouping items by category_id
        const groupedItems = updatedCategoryItems.reduce<Record<string, ExtendedCategoryItem[]>>(
          (acc, item) => {
            const key = String(item.category_id);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
          },
          {},
        );

        // Loop through each grouped category and update the category_items
        for (const [categoryId, items] of Object.entries(groupedItems)) {
          const categoryIndex = data.value.selectedPack?.categories.findIndex((c) => c.id === parseInt(categoryId));
          if (categoryIndex !== undefined && categoryIndex !== -1) {
            const category = data.value.selectedPack!.categories[categoryIndex];
            if (!category) continue;

            category.category_items = category.category_items.map(item => {
              const updatedItem = items.find(updated => updated.id === item.id);
              if (updatedItem) {
                return { ...item, ...updatedItem };
              }
              return item;
            });

            // Add any new items that were moved into the category
            items.forEach(item => {
              if (!category.category_items.some(existingItem => existingItem.id === item.id)) {
                category.category_items.push(item);
              }
            });
          }
        }

        // Remove items from source categories that moved away
        for (const category of data.value.selectedPack?.categories ?? []) {
          category.category_items = category.category_items.filter((item) => {
            const updated = updatedCategoryItems.find((u) => u.id === item.id);
            if (updated && updated.category_id !== category.id) return false;
            return true;
          });
        }
      }

    } catch (err) {
      console.error('Error updating category items:', err);
      $appStore.notifyNegative('There was an error updating the category items.');
      const packId = data.value.selectedPack?.id;
      if (packId != null) {
        await fetchClosetPage(packId);
      }
    }
  };

  /**
   * Updates the item with the new value (optimistic; rolls back on error).
   * Generic over the column so the value, the optimistic write and the
   * rollback all share one type instead of going through `any`.
   * @param item The item to update.
   * @param key The column to update.
   * @param value The new value.
   * @param categoryId The category id.
   */
  const updateItem = async <K extends EditableItemField>(
    item: Tables<'items'>,
    key: K,
    value: Tables<'items'>[K] | undefined,
    categoryId: number,
  ) => {
    const $appStore = useAppStore();
    const generation = (itemUpdateGenerations.get(item.id) ?? 0) + 1;
    itemUpdateGenerations.set(item.id, generation);

    const categoryIndex = data.value.selectedPack?.categories.findIndex((c) => c.id === categoryId);
    if (categoryIndex === undefined || categoryIndex === -1) return;

    const category = data.value.selectedPack?.categories[categoryIndex];
    if (!category) return;

    const categoryItemIndex = category.category_items.findIndex((ci) => ci.item.id === item.id);
    const categoryItem = category.category_items[categoryItemIndex];
    if (!categoryItem) return;

    const previousValue = categoryItem.item[key];
    // `key === 'url'` can't narrow K, so the protocol-prefixed string needs asserting.
    const nextValue = (key === 'url' ? prependProtocol(value as string) : value) as Tables<'items'>[K];

    // Optimistic local patch
    categoryItem.item[key] = nextValue;

    try {
      const supabase = useSupabaseClient<Database>();

      const { data: updatedItem, error } = await supabase.from('items')
        .update({ [key]: nextValue } as TablesUpdate<'items'>)
        .eq('id', item.id)
        .select();

      if (itemUpdateGenerations.get(item.id) !== generation) return;

      if (error || !updatedItem) {
        categoryItem.item[key] = previousValue;
        $appStore.notifyNegative('There was an error updating the item.');
        return;
      }

      const updated = updatedItem[0];
      if (!updated) {
        categoryItem.item[key] = previousValue;
        return;
      }

      categoryItem.item = updated;
    } catch {
      if (itemUpdateGenerations.get(item.id) !== generation) return;
      categoryItem.item[key] = previousValue;
      $appStore.notifyNegative('There was an error updating the item.');
    }
  };

  return {
    activeCategoryId,
    activeItem,
    createItem,
    data,
    dialogStates,
    fetchClosetPage,
    fetchGeneration,
    isPublicRoute,
    pageLoading,
    updateCategoryItems,
    updateItem,
  };
});
