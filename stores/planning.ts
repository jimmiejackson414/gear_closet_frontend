import { defineStore } from "pinia";
import type { Database, Tables } from "@/types";
import type { ExtendedPack, ExtendedPoll, ExtendedTripFriend } from "@/types/helpers";

export interface PlanningPageData {
  errors?: string[];
  friends: ExtendedTripFriend[];
  is_trip_owner: boolean;
  pack?: ExtendedPack;
  poll?: ExtendedPoll;
  shopping_items: Tables<'shopping_list_items'>[];
  todos: Tables<'todos'>[];
  trip_details: Tables<'trip_details'>[];
  trips: Tables<'trips'>[];
}

type State = {
  data: PlanningPageData;
  pageLoading: boolean;
  selectedTripId: string | undefined;
};

type Getters = {
  selectedTrip(): Tables<'trips'> | undefined;
};

type Actions = {
  fetchPlanningPage(identifier: number): Promise<PlanningPageData | undefined>;
};

export const usePlanningStore = defineStore<"planning", State, Getters, Actions>(
  'planning',
  {
    actions: {
      /**
       * Fetches the planning page data.
       */
      async fetchPlanningPage (tripId) {
        const $store = useAppStore();
        this.pageLoading = true;

        try {
          const supabase = useSupabaseClient<Database>();

          const { data: pageData, error } = await supabase
            .rpc('get_planning_page_data', { p_trip_id: tripId })
            .returns<PlanningPageData>();

          if (pageData && !error) {
            // set selected trip if available
            const selectedTripId = tripId || pageData.trips[0]?.id;
            const selectedTrip = pageData.trips.find(trip => trip.id === selectedTripId);
            if (selectedTrip) this.selectedTripId = String(selectedTrip.id);

            return pageData;
          }
        } catch (err: any) {
          $store.notifyNegative(err);
        } finally {
          this.pageLoading = false;
        }
      },
    },

    getters: {
      selectedTrip () {
        return this.data.trips.find(trip => String(trip.id) === this.selectedTripId);
      },
    },

    state () {
      return {
        data: {
          friends: [],
          is_trip_owner: false,
          pack: undefined,
          poll: undefined,
          shopping_items: [],
          todos: [],
          trip_details: [],
          trips: [],
        },
        pageLoading: true,
        selectedTripId: undefined,
      };
    },
  },
);