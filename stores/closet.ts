import { defineStore } from "pinia";
import type { Database, Tables } from "@/types";

export interface ClosetPageData {
  packs: Tables<'packs'>[];
}

type State = {
  data: ClosetPageData;
  pageLoading: boolean;
  selectedPackId: number | null;
};

type Getters = {
  selectedPack(): Tables<'packs'> | undefined;
};

type Actions = {
  fetchClosetPage(packId: number): Promise<void>;
};

export const useClosetStore = defineStore<"closet", State, Getters, Actions>(
  'closet',
  {
    state () {
      return {
        data: {
          packs: [],
          pack_items: [],
          items: [],
        },
        pageLoading: true,
        selectedPackId: null,
      };
    },

    getters: {
      selectedPack () {
        return this.data.packs.find(pack => pack.id === this.selectedPackId);
      },
    },

    actions: {
      /**
       * Fetches the planning page data.
       */
      async fetchClosetPage (packId) {
        const $store = useAppStore();
        this.pageLoading = true;

        try {
          // const supabase = useSupabaseClient<Database>();

          // const { data: pageData, error } = await supabase
          //   .rpc('get_closet_page_data', { p_pack_id: this.selectedPackId || 0 })
          //   .returns<ClosetPageData>();

          // if (pageData && !error) {
          //   this.data = pageData;

          //   // set selected pack if available
          //   const findSelectedPack = pageData.packs.find(pack => pack.id === (packId ? packId : pageData.packs[0].id)) as Tables<'packs'>;
          //   this.selectedPackId = findSelectedPack.id;
          // }
        } catch (err: any) {
          $store.notifyNegative(err);
        } finally {
          this.pageLoading = false;
        }
      },
    },
  },
);
