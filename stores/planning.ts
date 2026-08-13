import { defineStore } from "pinia";
import type { Database, Tables, TablesUpdate } from "@/types";
import { ResourceType, TripDetailsType } from "@/types";
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
  /** True while refetching after the initial load; previous data stays visible. */
  isRefreshing: boolean;
  selectedTripId: string | undefined;
  /** Monotonic id so stale in-flight fetches don't overwrite newer results. */
  fetchGeneration: number;
};

type Getters = {
  selectedTrip(): Tables<'trips'> | undefined;
};

type Actions = {
  fetchPlanningPage(tripId?: number): Promise<void>;
  updateTrip(payload: TablesUpdate<'trips'>): Promise<void>;
  createTripDetail(type: TripDetailsType): Promise<void>;
  updateTripDetail(id: number, payload: TablesUpdate<'trip_details'>): Promise<boolean>;
  deleteTripDetail(id: number): Promise<boolean>;
  createTodo(resourceType: ResourceType): Promise<void>;
  updateTodo(todo: Tables<'todos'>, payload: TablesUpdate<'todos'>): Promise<void>;
  batchUpdateTodos(completed: boolean | 'indeterminate', resourceType: ResourceType): Promise<void>;
  createShoppingItem(resourceType: ResourceType): Promise<void>;
  updateShoppingItem(item: Tables<'shopping_list_items'>, payload: TablesUpdate<'shopping_list_items'>): Promise<void>;
  batchUpdateShoppingItems(completed: boolean | 'indeterminate', resourceType: ResourceType): Promise<void>;
};

function normalizePlanningPageData (raw: PlanningPageData | null | undefined): PlanningPageData {
  return {
    trips: raw?.trips ?? [],
    pack: raw?.pack ?? undefined,
    trip_details: raw?.trip_details ?? [],
    todos: raw?.todos ?? [],
    shopping_items: raw?.shopping_items ?? [],
    friends: raw?.friends ?? [],
    poll: raw?.poll ?? undefined,
    errors: raw?.errors,
  };
}

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
        isRefreshing: false,
        selectedTripId: undefined,
        fetchGeneration: 0,
      };
    },

    getters: {
      selectedTrip () {
        return this.data.trips.find(trip => String(trip.id) === this.selectedTripId);
      },
    },

    actions: {
      /**
       * Fetches the planning page data for a trip.
       * Pass `0` / omit to let the RPC resolve the default (first) trip.
       * Concurrent calls: only the latest generation applies its result.
       * Initial load uses `pageLoading`; subsequent loads use `isRefreshing`
       * and keep previous data visible.
       */
      async fetchPlanningPage (tripId = 0) {
        const $store = useAppStore();
        const generation = ++this.fetchGeneration;
        const isInitial = this.pageLoading || !this.data.trips.length;

        if (isInitial) {
          this.pageLoading = true;
        } else {
          this.isRefreshing = true;
        }

        try {
          const supabase = useSupabaseClient<Database>();
          const resolvedTripId = Number.isFinite(tripId) ? tripId : 0;

          const { data: pageData, error } = await supabase
            .rpc('get_planning_page_data', { p_trip_id: resolvedTripId });

          // Ignore stale responses after a newer fetch started.
          if (generation !== this.fetchGeneration) return;

          if (error) {
            $store.notifyNegative(error.message || 'There was an error loading planning data.');
            if (isInitial) {
              this.data = normalizePlanningPageData(undefined);
              this.selectedTripId = undefined;
            }
            return;
          }

          const data = normalizePlanningPageData(pageData as unknown as PlanningPageData);
          this.data = data;

          if (!data.trips.length) {
            this.selectedTripId = undefined;
            return;
          }

          const firstTrip = data.trips[0];
          const preferredId = resolvedTripId || firstTrip?.id;
          const selectedTrip = preferredId != null
            ? data.trips.find((trip: Tables<'trips'>) => trip.id === preferredId)
            : undefined;

          if (selectedTrip) {
            this.selectedTripId = String(selectedTrip.id);
          } else if (firstTrip) {
            this.selectedTripId = String(firstTrip.id);
          } else {
            this.selectedTripId = undefined;
          }
        } catch (err: any) {
          if (generation !== this.fetchGeneration) return;
          $store.notifyNegative(err);
        } finally {
          if (generation === this.fetchGeneration) {
            this.pageLoading = false;
            this.isRefreshing = false;
          }
        }
      },

      async updateTrip (payload: TablesUpdate<'trips'>) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const { data: updatedTrip, error } = await supabase.from('trips')
            .update(payload)
            .eq('id', Number(this.selectedTripId))
            .select();

          if (updatedTrip?.length && this.selectedTripId && !error) {
            const trip = updatedTrip[0];
            if (!trip) return;
            this.selectedTripId = String(trip.id);

            const tripIndex = this.data.trips.findIndex(t => t.id === trip.id);
            if (tripIndex !== -1) {
              this.data.trips.splice(tripIndex, 1, trip);
            }
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error updating the trip.');
          }
        } catch {
          $appStore.notifyNegative('There was an error updating the trip.');
        }
      },

      async createTripDetail (type: TripDetailsType) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const isHike = type === TripDetailsType.HIKE;
          const { data: newDetail, error } = await supabase.from('trip_details')
            .insert({
              trip_id: Number(this.selectedTripId),
              title: 'New detail',
              type,
              value: isHike ? 'New hike detail description' : 'New trip detail description',
            })
            .select();

          if (newDetail?.length && !error) {
            const detail = newDetail[0];
            if (detail) this.data.trip_details.push(detail);
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error creating a new detail.');
          }
        } catch {
          $appStore.notifyNegative('There was an error creating a new detail.');
        }
      },

      async updateTripDetail (id: number, payload: TablesUpdate<'trip_details'>) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const { data: updatedDetail, error } = await supabase.from('trip_details')
            .update(payload)
            .eq('id', id)
            .select();

          if (updatedDetail?.length && !error) {
            const updated = updatedDetail[0];
            const index = this.data.trip_details.findIndex((t) => t.id === id);
            if (updated && index !== -1) {
              this.data.trip_details[index] = updated;
            }
            return true;
          }
          if (error) {
            $appStore.notifyNegative(error.message || 'There was an error updating the detail.');
          }
          return false;
        } catch {
          $appStore.notifyNegative('There was an error updating the detail.');
          return false;
        }
      },

      async deleteTripDetail (id: number) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const { error } = await supabase.from('trip_details')
            .delete()
            .eq('id', id);

          if (!error) {
            const index = this.data.trip_details.findIndex((t) => t.id === id);
            if (index !== -1) {
              this.data.trip_details.splice(index, 1);
            }
            return true;
          }
          $appStore.notifyNegative(error.message || 'There was an error deleting the detail.');
          return false;
        } catch {
          $appStore.notifyNegative('There was an error deleting the detail.');
          return false;
        }
      },

      async createTodo (resourceType: ResourceType) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();
          const { data: newTodo, error } = await supabase.from('todos')
            .insert({
              completed: false,
              profile_id: user.value?.sub as string,
              resource_type: resourceType,
              title: 'New todo',
              trip_id: Number(this.selectedTripId),
            })
            .select();

          if (newTodo?.length && !error) {
            const todo = newTodo[0];
            if (todo) this.data.todos.push(todo);
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error creating a new todo.');
          }
        } catch {
          $appStore.notifyNegative('There was an error creating a new todo.');
        }
      },

      async updateTodo (todo: Tables<'todos'>, payload: TablesUpdate<'todos'>) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const { data: updatedTodo, error } = await supabase.from('todos')
            .update(payload)
            .eq('id', todo.id as number)
            .select();

          if (updatedTodo?.length && !error) {
            const updated = updatedTodo[0];
            const index = this.data.todos.findIndex((t) => t.id === todo.id);
            if (updated && index !== -1) {
              this.data.todos[index] = updated;
            }
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error updating the todo.');
          }
        } catch {
          $appStore.notifyNegative('There was an error updating the todo.');
        }
      },

      async batchUpdateTodos (completed: boolean | 'indeterminate', resourceType: ResourceType) {
        if (typeof completed !== 'boolean') return;

        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const payload = this.data.todos.map((todo) => (
            todo.resource_type === resourceType
              ? { ...todo, completed }
              : todo
          ));
          const { data: updatedTodos, error } = await supabase.from('todos')
            .upsert(payload)
            .select();

          if (updatedTodos?.length && !error) {
            this.data.todos = updatedTodos;
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error updating the todos.');
          }
        } catch {
          $appStore.notifyNegative('There was an error updating the todos.');
        }
      },

      async createShoppingItem (resourceType: ResourceType) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();
          const { data: newItem, error } = await supabase.from('shopping_list_items')
            .insert({
              completed: false,
              profile_id: user.value?.sub as string,
              quantity: 1,
              resource_type: resourceType,
              title: 'New shopping item',
              trip_id: Number(this.selectedTripId),
            })
            .select();

          if (newItem?.length && !error) {
            const item = newItem[0];
            if (item) this.data.shopping_items.push(item);
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error creating a new shopping item.');
          }
        } catch {
          $appStore.notifyNegative('There was an error creating a new shopping item.');
        }
      },

      async updateShoppingItem (shoppingItem: Tables<'shopping_list_items'>, payload: TablesUpdate<'shopping_list_items'>) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const { data: updatedShoppingItem, error } = await supabase.from('shopping_list_items')
            .update(payload)
            .eq('id', shoppingItem.id as number)
            .select();

          if (updatedShoppingItem?.length && !error) {
            const updated = updatedShoppingItem[0];
            const index = this.data.shopping_items.findIndex((t) => t.id === shoppingItem.id);
            if (updated && index !== -1) {
              this.data.shopping_items[index] = updated;
            }
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error updating the shopping item.');
          }
        } catch {
          $appStore.notifyNegative('There was an error updating the shopping item.');
        }
      },

      async batchUpdateShoppingItems (completed: boolean | 'indeterminate', resourceType: ResourceType) {
        if (typeof completed !== 'boolean') return;

        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const payload = this.data.shopping_items.map((item) => (
            item.resource_type === resourceType
              ? { ...item, completed }
              : item
          ));
          const { data: updatedShoppingItems, error } = await supabase.from('shopping_list_items')
            .upsert(payload)
            .select();

          if (updatedShoppingItems?.length && !error) {
            this.data.shopping_items = updatedShoppingItems;
          } else if (error) {
            $appStore.notifyNegative(error.message || 'There was an error updating the shopping items.');
          }
        } catch {
          $appStore.notifyNegative('There was an error updating the shopping items.');
        }
      },
    },
  },
);
