import { defineStore } from "pinia";
import type { RowItem } from '@/components/closet/PackItemsTable.vue';
import type { Database } from "@/types";
import type { ExtendedPack } from "@/types/helpers";

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
  activeItem?: RowItem;
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
  updateItem(item: RowItem, key: string, value: string | number | boolean | undefined, categoryId: number): Promise<void>;
};

export const useClosetStore = defineStore<"closet", State, Getters, Actions>(
  'closet',
  {
    state () {
      return {
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
      };
    },

    actions: {
      /**
       * Fetches the planning page data.
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
       * Updates the item with the new value.
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
