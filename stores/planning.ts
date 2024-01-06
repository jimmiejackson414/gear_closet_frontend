import { defineStore } from "pinia";
import { decrypt } from "~/helpers/encryption";
import type { Database, Tables } from "@/types";
import type { ExtendedPack } from "@/types/helpers";
import type { LocationQuery } from "vue-router";

export interface PlanningPageData {
  trips: Tables<'trips'>[];
  pack?: ExtendedPack;
  trip_details: Tables<'trip_details'>[];
  todos: Tables<'todos'>[];
  shopping_items: Tables<'shopping_list_items'>[];
  friends: Tables<'trip_friends'>[];
  poll?: Tables<'polls'>;
  errors?: string[];
}

type State = {
  data: PlanningPageData,
  pageLoading: boolean,
  selectedTrip?: Tables<'trips'>,
};

type Getters = {};

type Actions = {
  fetchPlanningPage(query: LocationQuery): Promise<void>;
};

export const usePlanningStore = defineStore<"planning", State, Getters, Actions>(
  'planning',
  {
    state () {
      return {
        data: {
          trips: [],
          pack: undefined,
          trip_details: [],
          todos: [],
          shopping_items: [],
          friends: [],
          poll: undefined,
        },
        pageLoading: false,
        selectedTrip: undefined,
      };
    },

    getters: {},

    actions: {
      /**
       * Fetches the planning page data.
       */
      async fetchPlanningPage (query: LocationQuery) {
        const $store = useAppStore();
        this.pageLoading = true;

        try {
          const supabase = useSupabaseClient<Database>();
          const tripId = query?.trip && Number(decrypt(query.trip));
          const { data: pageData, error } = await supabase
            .rpc('get_planning_page_data', { p_trip_id: tripId || 0 })
            .returns<PlanningPageData>();

          if (pageData && !error) {
            this.data = pageData;

            // set selected trip if available
            const findSelectedTrip = pageData.trips.find(trip => trip.id === (tripId ? tripId : pageData.trips[0].id)) as Tables<'trips'>;
            this.selectedTrip = findSelectedTrip;
          }
        } catch (err: any) {
          $store.notifyNegative(err);
        } finally {
          this.pageLoading = false;
        }
      },
    },
  },
);