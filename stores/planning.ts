import { defineStore } from "pinia";
import type { Database, Tables } from "@/types";
import type { ExtendedPack, ExtendedPoll } from "@/types/helpers";

export interface PlanningPageData {
  trips: Tables<'trips'>[];
  pack?: ExtendedPack;
  trip_details: Tables<'trip_details'>[];
  todos: Tables<'todos'>[];
  shopping_items: Tables<'shopping_list_items'>[];
  friends: Tables<'trip_friends'>[];
  poll?: ExtendedPoll;
  errors?: string[];
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
  fetchPlanningPage(identifier: number): Promise<void>;
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
        pageLoading: true,
        selectedTripId: undefined,
      };
    },

    getters: {
      selectedTrip () {
        return this.data.trips.find(trip => String(trip.id) === this.selectedTripId);
      },
    },

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
            .rpc('get_planning_page_data', { p_trip_id: tripId || 0 });

          if (pageData && !error) {
            const data = pageData as unknown as PlanningPageData;
            this.data = data;

            // set selected trip if available
            const firstTrip = data.trips[0];
            const findSelectedTrip = data.trips.find((trip: Tables<'trips'>) => trip.id === (tripId ? tripId : firstTrip?.id));
            if (findSelectedTrip) {
              this.selectedTripId = String(findSelectedTrip.id);
            }
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