import { defineStore } from "pinia";
import type { Database, Tables, TablesUpdate } from "@/types";
import type { ExtendedCategoryItem, ExtendedPack } from "@/types/helpers";

export interface ClosetPageData {
  selectedPack?: ExtendedPack;
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
    createPackDialog: boolean;
    deleteCategoryDialog: boolean;
    deletePackDialog: boolean;
    removeItemDialog: boolean;
    sharePackDialog: boolean;
    updateThemeDialog: boolean;
    uploadCsvDialog: boolean;
  }
  pageLoading: boolean;
};

type Getters = {};

type Actions = {
  fetchClosetPage(packId: number): Promise<void>;
  createItem(categoryId: number): Promise<void>;
  updateCategoryItems(payload: TablesUpdate<'category_items'>[]): Promise<void>;
  updateItem(item: Tables<'items'>, key: string, value: string | number | boolean | undefined, categoryId: number): Promise<void>;
};

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
        createPackDialog: false,
        deleteCategoryDialog: false,
        deletePackDialog: false,
        removeItemDialog: false,
        sharePackDialog: false,
        updateThemeDialog: false,
        uploadCsvDialog: false,
      },
      pageLoading: true,
    }),

    actions: {
      /**
       * Fetches the planning page data.
       * @param packId The pack id.
       * @returns The planning page data.
       */
      async fetchClosetPage (packId) {
        const $store = useAppStore();
        this.pageLoading = true;

        try {
          const supabase = useSupabaseClient<Database>();

          const { data: pageData, error } = await supabase
            .rpc('get_closet_page_data', { p_pack_id: packId || 0 })
            .returns<ClosetPageResponse>();

          if (error) throw new Error(error.message);
          if (!error && pageData) {
            this.data.selectedPack = pageData.pack;
            this.data.allPacks = pageData.packs || [];
          }
        } catch (err: any) {
          $store.notifyNegative('An error occurred fetching the closet page.');
        } finally {
          this.pageLoading = false;
        }
      },

      /**
       * Optimistically creates a new item.
       * @param categoryId The category id.
       */
      async createItem (categoryId) {
        const $store = useAppStore();

        try {
          const user = useSupabaseUser();
          const supabase = useSupabaseClient<Database>();

          // Find the category up front for later use
          const category = this.data.selectedPack?.categories.find(cat => cat.id === categoryId);
          if (!category) throw new Error('Category not found');

          // Generate the new item for both server request and optimistic update
          const newItem = { ...generateItem(), profile_id: user.value?.id } as Tables<'items'>;
          const optimisticItem = { ...newItem, id: 0 };

          // Optimistic update for category item
          const optimisticCategoryItem = {
            id: 0,
            category_id: categoryId,
            item_id: optimisticItem.id,
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

          // Create the new category_item after item is created
          const newCategoryItem = {
            category_id: categoryId,
            item_id: createdItem[0].id,
            position: updatedCategoryItems.length,
          };

          const { data: createdCategoryItem, error: categoryItemError } = await supabase.from('category_items')
            .insert([newCategoryItem])
            .select();

          if (categoryItemError) throw categoryItemError;

          // Replace the temporary optimistic item with the real item after creation
          const finalCategoryItem = {
            ...optimisticCategoryItem,
            id: createdCategoryItem[0].id,
            item_id: createdItem[0].id,
            item: createdItem[0],
          };

          // Final optimistic update of category items
          this.data.selectedPack!.categories = this.data.selectedPack!.categories.map(cat =>
            cat.id === categoryId
              ? { ...cat, category_items: cat.category_items.map(item =>
                item.item_id === optimisticCategoryItem.item_id ? finalCategoryItem : item,
              ) }
              : cat,
          );
        } catch (err) {
          const category = this.data.selectedPack?.categories.find(cat => cat.id === categoryId);
          if (category) {
            // Rollback the optimistic update by filtering out the item
            category.category_items = category.category_items.filter(item => item.id !== 0);
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

          const { data: updatedCategoryItems, error } = await supabase.from('category_items')
            .upsert(payload)
            .returns<ExtendedCategoryItem[]>()
            .select(`*, item:items(*)`);

          if (error || !updatedCategoryItems) {
            $appStore.notifyNegative('There was an error updating the category items.');
            return;
          }

          // Check if all category_id values are the same (indicating a single category or multiple)
          const isSingleCategory = updatedCategoryItems.every(
            (item) => item.category_id === updatedCategoryItems[0].category_id,
          );

          if (isSingleCategory) {
            const singleCategoryId = updatedCategoryItems[0].category_id;
            const categoryIndex = this.data.selectedPack?.categories.findIndex(
              (c) => c.id === singleCategoryId,
            );

            if (categoryIndex !== undefined && categoryIndex !== -1) {
              const category = this.data.selectedPack!.categories[categoryIndex];

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
          }

        } catch (err) {
          console.error('Error updating category items:', err);
          $appStore.notifyNegative('There was an error updating the category items.');
        }
      },

      /**
       * Updates the item with the new value.
       * @param item The item to update.
       * @param key The key to update.
       * @param value The new value.
       * @param categoryId The category id.
       */
      async updateItem (item, key, value, categoryId) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();

          if (key === 'url') { value = prependProtocol(value as string);}
          const { data: updatedItem, error } = await supabase.from('items')
            .update({
              [key]: value,
            })
            .eq('id', item.id)
            .select();

          if (error || !updatedItem) {
            $appStore.notifyNegative('There was an error updating the item.');
            return;
          }

          // update item located in store
          const categoryIndex = this.data.selectedPack?.categories.findIndex((c) => c.id === categoryId);
          const categoryItemIndex = this.data.selectedPack?.categories[categoryIndex as number].category_items.findIndex((ci) => ci.item.id === item.id);
          this.data.selectedPack!.categories[categoryIndex as number].category_items[categoryItemIndex as number].item = updatedItem[0];
        } catch (err) {
          $appStore.notifyNegative('There was an error updating the item.');
        }
      },
    },
  },
);
