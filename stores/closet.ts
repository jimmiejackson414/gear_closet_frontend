import { defineStore } from "pinia";
import type { Database, Tables, TablesUpdate } from "@/types";
import type { ExtendedCategoryItem, ExtendedPack, PublicPack } from "@/types/helpers";

export interface ClosetPageData {
  selectedPack?: ExtendedPack | PublicPack;
  allPacks: {
    id: number;
    name: string;
    slug: string;
  }[];

}

interface ClosetPageResponse {
  pack: ExtendedPack;
  packs: {
    id: number;
    name: string;
    slug: string;
  }[];
}

type State = {
  activeCategoryId?: number;
  activeItem?: Tables<'items'>;
  data: ClosetPageData;
  dialogStates: {
    addUrlDialog: boolean;
    deleteCategoryDialog: boolean;
    deletePackDialog: boolean;
    managePackSettingsDialog: boolean;
    removeItemDialog: boolean;
    sharePackDialog: boolean;
    uploadCsvDialog: boolean;
  }
  /** Monotonic id so stale in-flight fetches don't overwrite newer results. */
  fetchGeneration: number;
  pageLoading: boolean;
};

type Getters = {
  isPublicRoute: () => boolean;
};

type Actions = {
  fetchClosetPage(packId: number): Promise<void>;
  createItem(categoryId: number): Promise<void>;
  updateCategoryItems(payload: TablesUpdate<'category_items'>[]): Promise<void>;
  updateItem(item: Tables<'items'>, key: string, value: string | number | boolean | undefined, categoryId: number): Promise<void>;
};

/** Unique negative ids for optimistic createItem rows. */
let tempIdCounter = 0;
const nextTempId = () => --tempIdCounter;

/** Per-item generation so stale updateItem responses are ignored. */
const itemUpdateGenerations = new Map<number, number>();

export const useClosetStore = defineStore<"closet", State, Getters, Actions>(
  'closet',
  {
    state: () => ({
      activeCategoryId: undefined,
      activeItem: undefined,
      data: {
        selectedPack: undefined,
        allPacks: [],
      },
      dialogStates: {
        addUrlDialog: false,
        deleteCategoryDialog: false,
        deletePackDialog: false,
        managePackSettingsDialog: false,
        removeItemDialog: false,
        sharePackDialog: false,
        uploadCsvDialog: false,
      },
      fetchGeneration: 0,
      pageLoading: true,
    }),

    getters: {
      isPublicRoute (): boolean {
        const $route = useRoute();
        return $route.meta.public as boolean || false;
      },
    },

    actions: {
      /**
       * Fetches the closet page data.
       * @param packId The pack id.
       */
      async fetchClosetPage (packId: number) {
        const $store = useAppStore();
        const generation = ++this.fetchGeneration;
        this.pageLoading = true;

        try {
          const supabase = useSupabaseClient<Database>();
          const resolvedPackId = Number.isFinite(packId) ? packId : 0;

          const { data: pageData, error } = await supabase
            .rpc('get_closet_page_data', { p_pack_id: resolvedPackId || 0 });

          if (generation !== this.fetchGeneration) return;

          if (error) {
            $store.notifyNegative(error.message || 'An error occurred fetching the closet page.');
            return;
          }

          if (pageData) {
            const data = pageData as unknown as ClosetPageResponse;
            this.data.selectedPack = data.pack;
            this.data.allPacks = data.packs || [];
          }
        } catch (err: any) {
          if (generation !== this.fetchGeneration) return;
          $store.notifyNegative(err?.message || 'An error occurred fetching the closet page.');
        } finally {
          if (generation === this.fetchGeneration) {
            this.pageLoading = false;
          }
        }
      },

      /**
       * Optimistically creates a new item.
       * @param categoryId The category id.
       */
      async createItem (categoryId: number) {
        const $store = useAppStore();
        const tempId = nextTempId();

        try {
          const user = useSupabaseUser();
          const supabase = useSupabaseClient<Database>();

          // Find the category up front for later use
          const category = this.data.selectedPack?.categories.find(cat => cat.id === categoryId);
          if (!category) throw new Error('Category not found');

          // Generate the new item for both server request and optimistic update
          const newItem = { ...generateItem(), profile_id: user.value?.sub } as Tables<'items'>;
          const optimisticItem = { ...newItem, id: tempId };

          // Optimistic update for category item
          const optimisticCategoryItem = {
            id: tempId,
            category_id: categoryId,
            item_id: tempId,
            position: (category?.category_items?.length ?? 0) + 1,
            created_at: new Date()
              .toISOString(),
            updated_at: new Date()
              .toISOString(),
            item: optimisticItem,
          };

          // Optimistically update category's category_items
          const updatedCategoryItems = [...category.category_items, optimisticCategoryItem];

          // Perform optimistic update
          this.data.selectedPack!.categories = this.data.selectedPack!.categories.map(cat =>
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
            item_id: created.id,
            item: created,
          };

          // Final optimistic update of category items
          this.data.selectedPack!.categories = this.data.selectedPack!.categories.map(cat =>
            cat.id === categoryId
              ? { ...cat, category_items: cat.category_items.map(item =>
                item.id === tempId ? finalCategoryItem : item,
              ) }
              : cat,
          );
        } catch (err) {
          const category = this.data.selectedPack?.categories.find(cat => cat.id === categoryId);
          if (category) {
            // Rollback the optimistic update by filtering out the temp item
            category.category_items = category.category_items.filter(item => item.id !== tempId);
          }
          $store.notifyNegative('Error creating item');
        }
      },

      /**
       * Updates the category items.
       * @param payload Tables<'category_items'>[]
       * @returns void
       */
      async updateCategoryItems (payload: TablesUpdate<'category_items'>[]) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();

          const { data: updatedCategoryItemsData, error } = await supabase.from('category_items')
            .upsert(payload)
            .select(`*, item:items(*)`);

          if (error || !updatedCategoryItemsData) {
            $appStore.notifyNegative('There was an error updating the category items.');
            const packId = this.data.selectedPack?.id;
            if (packId != null) {
              await this.fetchClosetPage(packId);
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
            const categoryIndex = this.data.selectedPack?.categories.findIndex(
              (c) => c.id === singleCategoryId,
            );

            if (categoryIndex !== undefined && categoryIndex !== -1) {
              const category = this.data.selectedPack!.categories[categoryIndex];
              if (!category) return;

              category.category_items = category.category_items.map(item => {
                const updatedItem = updatedCategoryItems.find(updated => updated.id === item.id) as ExtendedCategoryItem;
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
                acc[key].push(item as ExtendedCategoryItem);
                return acc;
              },
              {},
            );

            // Loop through each grouped category and update the category_items
            for (const [categoryId, items] of Object.entries(groupedItems)) {
              const categoryIndex = this.data.selectedPack?.categories.findIndex((c) => c.id === parseInt(categoryId));
              if (categoryIndex !== undefined && categoryIndex !== -1) {
                const category = this.data.selectedPack!.categories[categoryIndex];
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
            for (const category of this.data.selectedPack?.categories ?? []) {
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
          const packId = this.data.selectedPack?.id;
          if (packId != null) {
            await this.fetchClosetPage(packId);
          }
        }
      },

      /**
       * Updates the item with the new value (optimistic; rolls back on error).
       * @param item The item to update.
       * @param key The key to update.
       * @param value The new value.
       * @param categoryId The category id.
       */
      async updateItem (item: Tables<'items'>, key: string, value: string | number | boolean | undefined, categoryId: number) {
        const $appStore = useAppStore();
        const generation = (itemUpdateGenerations.get(item.id) ?? 0) + 1;
        itemUpdateGenerations.set(item.id, generation);

        const categoryIndex = this.data.selectedPack?.categories.findIndex((c) => c.id === categoryId);
        if (categoryIndex === undefined || categoryIndex === -1) return;

        const category = this.data.selectedPack?.categories[categoryIndex];
        if (!category) return;

        const categoryItemIndex = category.category_items.findIndex((ci) => ci.item.id === item.id);
        const categoryItem = category.category_items[categoryItemIndex];
        if (!categoryItem) return;

        const previousValue = (categoryItem.item as any)[key];
        const nextValue = key === 'url' ? prependProtocol(value as string) : value;

        // Optimistic local patch
        (categoryItem.item as any)[key] = nextValue;

        try {
          const supabase = useSupabaseClient<Database>();

          const { data: updatedItem, error } = await supabase.from('items')
            .update({
              [key]: nextValue,
            } as any)
            .eq('id', item.id)
            .select();

          if (itemUpdateGenerations.get(item.id) !== generation) return;

          if (error || !updatedItem) {
            (categoryItem.item as any)[key] = previousValue;
            $appStore.notifyNegative('There was an error updating the item.');
            return;
          }

          const updated = updatedItem[0];
          if (!updated) {
            (categoryItem.item as any)[key] = previousValue;
            return;
          }

          categoryItem.item = updated;
        } catch (err) {
          if (itemUpdateGenerations.get(item.id) !== generation) return;
          (categoryItem.item as any)[key] = previousValue;
          $appStore.notifyNegative('There was an error updating the item.');
        }
      },
    },
  },
);
