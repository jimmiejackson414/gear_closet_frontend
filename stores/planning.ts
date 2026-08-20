import { defineStore } from "pinia";
import { ResourceType, TripDetailsType } from "@/types";
import type { Database, Tables, TablesUpdate } from "@/types";
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

export function normalizePlanningPageData (raw: PlanningPageData | null | undefined): PlanningPageData {
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

/*
 * Setup syntax rather than the options form: the `this`-based options API makes
 * TypeScript re-instantiate the whole store type on every state write, which
 * trips TS2589 once state holds wide relational rows. See #112.
 */
export const usePlanningStore = defineStore('planning', () => {
  const data = ref<PlanningPageData>({
    trips: [],
    pack: undefined,
    trip_details: [],
    todos: [],
    shopping_items: [],
    friends: [],
    poll: undefined,
  });
  const pageLoading = ref(true);
  /** True while refetching after the initial load; previous data stays visible. */
  const isRefreshing = ref(false);
  const selectedTripId = ref<string | undefined>(undefined);
  /** Monotonic id so stale in-flight fetches don't overwrite newer results. */
  const fetchGeneration = ref(0);

  const selectedTrip = computed(() =>
    data.value.trips.find(trip => String(trip.id) === selectedTripId.value));

  const isSelectedTripOwner = computed(() => {
    const session = useSupabaseUser();
    const userStore = useUserStore();
    const userId = session.value?.sub ?? userStore.profile?.id;
    return Boolean(userId && selectedTrip.value?.profile_id === userId);
  });

  /**
   * Fetches the planning page data for a trip.
   * Pass `0` / omit to let the RPC resolve the default (first) trip.
   * Concurrent calls: only the latest generation applies its result.
   * Initial load uses `pageLoading`; subsequent loads use `isRefreshing`
   * and keep previous data visible.
   */
  const fetchPlanningPage = async (tripId = 0) => {
    const $store = useAppStore();
    const generation = ++fetchGeneration.value;
    const isInitial = pageLoading.value || !data.value.trips.length;

    if (isInitial) {
      pageLoading.value = true;
    } else {
      isRefreshing.value = true;
    }

    try {
      const supabase = useSupabaseClient<Database>();
      const resolvedTripId = Number.isFinite(tripId) ? tripId : 0;

      const { data: pageData, error } = await supabase
        .rpc('get_planning_page_data', { p_trip_id: resolvedTripId });

      // Ignore stale responses after a newer fetch started.
      if (generation !== fetchGeneration.value) return;

      if (error) {
        $store.notifyNegative(error.message || 'There was an error loading planning data.');
        if (isInitial) {
          data.value = normalizePlanningPageData(undefined);
          selectedTripId.value = undefined;
        }
        return;
      }

      // The RPC is typed as returning Json, so its shape can only be asserted.
      const next = normalizePlanningPageData(pageData as unknown as PlanningPageData);
      data.value = next;

      if (!next.trips.length) {
        selectedTripId.value = undefined;
        return;
      }

      const firstTrip = next.trips[0];
      const preferredId = resolvedTripId || firstTrip?.id;
      const nextSelectedTrip = preferredId != null
        ? next.trips.find((trip: Tables<'trips'>) => trip.id === preferredId)
        : undefined;

      if (nextSelectedTrip) {
        selectedTripId.value = String(nextSelectedTrip.id);
      } else if (firstTrip) {
        selectedTripId.value = String(firstTrip.id);
      } else {
        selectedTripId.value = undefined;
      }
    } catch (err: any) {
      if (generation !== fetchGeneration.value) return;
      $store.notifyNegative(err);
    } finally {
      if (generation === fetchGeneration.value) {
        pageLoading.value = false;
        isRefreshing.value = false;
      }
    }
  };

  const updateTrip = async (payload: TablesUpdate<'trips'>) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTrip, error } = await supabase.from('trips')
        .update(payload)
        .eq('id', Number(selectedTripId.value))
        .select();

      if (updatedTrip?.length && selectedTripId.value && !error) {
        const trip = updatedTrip[0];
        if (!trip) return;
        selectedTripId.value = String(trip.id);

        const tripIndex = data.value.trips.findIndex(t => t.id === trip.id);
        if (tripIndex !== -1) {
          data.value.trips.splice(tripIndex, 1, trip);
        }
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error updating the trip.');
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the trip.');
    }
  };

  const createTripDetail = async (type: TripDetailsType) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const isHike = type === TripDetailsType.HIKE;
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          trip_id: Number(selectedTripId.value),
          title: 'New detail',
          type,
          value: isHike ? 'New hike detail description' : 'New trip detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        const detail = newDetail[0];
        if (detail) data.value.trip_details.push(detail);
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error creating a new detail.');
      }
    } catch {
      $appStore.notifyNegative('There was an error creating a new detail.');
    }
  };

  const updateTripDetail = async (id: number, payload: TablesUpdate<'trip_details'>) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedDetail, error } = await supabase.from('trip_details')
        .update(payload)
        .eq('id', id)
        .select();

      if (updatedDetail?.length && !error) {
        const updated = updatedDetail[0];
        const index = data.value.trip_details.findIndex((t) => t.id === id);
        if (updated && index !== -1) {
          data.value.trip_details[index] = updated;
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
  };

  const deleteTripDetail = async (id: number) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from('trip_details')
        .delete()
        .eq('id', id);

      if (!error) {
        const index = data.value.trip_details.findIndex((t) => t.id === id);
        if (index !== -1) {
          data.value.trip_details.splice(index, 1);
        }
        return true;
      }
      $appStore.notifyNegative(error.message || 'There was an error deleting the detail.');
      return false;
    } catch {
      $appStore.notifyNegative('There was an error deleting the detail.');
      return false;
    }
  };

  const createTodo = async (resourceType: ResourceType) => {
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
          trip_id: Number(selectedTripId.value),
        })
        .select();

      if (newTodo?.length && !error) {
        const todo = newTodo[0];
        if (todo) data.value.todos.push(todo);
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error creating a new todo.');
      }
    } catch {
      $appStore.notifyNegative('There was an error creating a new todo.');
    }
  };

  const updateTodo = async (todo: Tables<'todos'>, payload: TablesUpdate<'todos'>) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTodo, error } = await supabase.from('todos')
        .update(payload)
        .eq('id', todo.id as number)
        .select();

      if (updatedTodo?.length && !error) {
        const updated = updatedTodo[0];
        const index = data.value.todos.findIndex((t) => t.id === todo.id);
        if (updated && index !== -1) {
          data.value.todos[index] = updated;
        }
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error updating the todo.');
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the todo.');
    }
  };

  const batchUpdateTodos = async (completed: boolean | 'indeterminate', resourceType: ResourceType) => {
    if (typeof completed !== 'boolean') return;

    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const payload = data.value.todos.map((todo) => (
        todo.resource_type === resourceType
          ? { ...todo, completed }
          : todo
      ));
      const { data: updatedTodos, error } = await supabase.from('todos')
        .upsert(payload)
        .select();

      if (updatedTodos?.length && !error) {
        data.value.todos = updatedTodos;
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error updating the todos.');
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the todos.');
    }
  };

  const createShoppingItem = async (resourceType: ResourceType) => {
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
          trip_id: Number(selectedTripId.value),
        })
        .select();

      if (newItem?.length && !error) {
        const item = newItem[0];
        if (item) data.value.shopping_items.push(item);
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error creating a new shopping item.');
      }
    } catch {
      $appStore.notifyNegative('There was an error creating a new shopping item.');
    }
  };

  const updateShoppingItem = async (
    shoppingItem: Tables<'shopping_list_items'>,
    payload: TablesUpdate<'shopping_list_items'>,
  ) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedShoppingItem, error } = await supabase.from('shopping_list_items')
        .update(payload)
        .eq('id', shoppingItem.id as number)
        .select();

      if (updatedShoppingItem?.length && !error) {
        const updated = updatedShoppingItem[0];
        const index = data.value.shopping_items.findIndex((t) => t.id === shoppingItem.id);
        if (updated && index !== -1) {
          data.value.shopping_items[index] = updated;
        }
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error updating the shopping item.');
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the shopping item.');
    }
  };

  const batchUpdateShoppingItems = async (completed: boolean | 'indeterminate', resourceType: ResourceType) => {
    if (typeof completed !== 'boolean') return;

    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const payload = data.value.shopping_items.map((item) => (
        item.resource_type === resourceType
          ? { ...item, completed }
          : item
      ));
      const { data: updatedShoppingItems, error } = await supabase.from('shopping_list_items')
        .upsert(payload)
        .select();

      if (updatedShoppingItems?.length && !error) {
        data.value.shopping_items = updatedShoppingItems;
      } else if (error) {
        $appStore.notifyNegative(error.message || 'There was an error updating the shopping items.');
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the shopping items.');
    }
  };

  return {
    data,
    pageLoading,
    isRefreshing,
    selectedTripId,
    fetchGeneration,
    selectedTrip,
    isSelectedTripOwner,
    fetchPlanningPage,
    updateTrip,
    createTripDetail,
    updateTripDetail,
    deleteTripDetail,
    createTodo,
    updateTodo,
    batchUpdateTodos,
    createShoppingItem,
    updateShoppingItem,
    batchUpdateShoppingItems,
  };
});
