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
  activeDetail?: Tables<'trip_details'>;
  data: PlanningPageData;
  dialogStates: {
    createTripDialog: boolean;
    modifyDetailDialog: boolean;
  }
  pageLoading: boolean;
  selectedTripId: number | null;
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
        activeDetail: undefined,
        data: {
          trips: [],
          pack: undefined,
          trip_details: [],
          todos: [],
          shopping_items: [],
          friends: [],
          poll: undefined,
        },
        dialogStates: {
          createTripDialog: false,
          modifyDetailDialog: false,
        },
        pageLoading: true,
        selectedTripId: null,
      };
    },

    getters: {
      selectedTrip () {
        return this.data.trips.find(trip => trip.id === this.selectedTripId);
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
            .rpc('get_planning_page_data', { p_trip_id: tripId || 0 })
            .returns<PlanningPageData>();

          if (pageData && !error) {
            this.data = pageData;

            // set selected trip if available
            const findSelectedTrip = pageData.trips.find(trip => trip.id === (tripId ? tripId : pageData.trips[0].id)) as Tables<'trips'>;
            this.selectedTripId = findSelectedTrip.id;
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