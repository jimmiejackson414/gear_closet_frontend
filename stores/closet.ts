import { defineStore } from "pinia";
import type { Database, Tables } from "@/types";
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
  data: ClosetPageData;
  pageLoading: boolean;
};

type Getters = {};

type Actions = {
  fetchClosetPage(packId: number): Promise<void>;
};

export const useClosetStore = defineStore<"closet", State, Getters, Actions>(
  'closet',
  {
    state () {
      return {
        data: {
          selectedPack: undefined,
          allPacks: [],
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
          console.log(`inside catch`, err);
          $store.notifyNegative(err);
        } finally {
          this.pageLoading = false;
        }
      },
    },
  },
);
