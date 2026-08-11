<script lang='ts' setup>
  import { type Database, ResourceType, type Tables, type TablesUpdate } from '@/types';

  const $appStore = useAppStore();
  const $store = usePlanningStore();

  const activeTab = ref<ResourceType>(ResourceType.USER);
  const userTodos = computed(() => {
    return $store.data.todos.filter(t => t.resource_type === ResourceType.USER);
  });

  const groupTodos = computed(() => {
    return $store.data.todos.filter(t => t.resource_type === ResourceType.GROUP);
  });

  /**
   * Creates a new todo for the selected trip.
   */
  const createTodo = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: newTodo, error } = await supabase.from('todos')
        .insert({
          completed: false,
          profile_id: user.value?.sub as string,
          resource_type: activeTab.value,
          title: 'New todo',
          trip_id: Number($store.selectedTripId),
        })
        .select();

      if (newTodo?.length && !error) {
        $store.data.todos.push(newTodo[0]);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new todo.');
    }
  };

  /**
   *  Updates a todo.
   * @param todo
   */
  const updateTodo = async (todo: Tables<'todos'>, payload: TablesUpdate<'todos'>) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTodo, error } = await supabase.from('todos')
        .update(payload)
        .eq('id', todo.id as number)
        .select();

      if (updatedTodo?.length && !error) {
        const index = $store.data.todos.findIndex((t) => t.id === todo.id);
        $store.data.todos[index] = updatedTodo[0];
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the todo.');
    }
  };

  /**
   * Batch updates todos.
   */
  const batchUpdateTodos = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTodos, error } = await supabase.from('todos')
        .upsert($store.data.todos)
        .select();

      if (updatedTodos?.length && !error) {
        $store.data.todos = updatedTodos;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the todos.');
    }
  };
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr] py-4">
      <icon-list-todo class="mr-6 w-6 h-6 text-primary" />
      <p class="font-bold! text-base">
        Todos
      </p>
      <button-root
        v-if="!$store.pageLoading && $store.data?.todos.length"
        class="justify-self-end rounded-full"
        size="icon"
        @click="createTodo">
        <icon-plus />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state v-else-if="!$store.pageLoading && !$store.data?.todos.length">
      <p class="mb-4 text-base">
        You haven't added any todos to this trip yet!
      </p>
      <button-root
        size="sm"
        variant="outline"
        @click="createTodo">
        Get Started
      </button-root>
    </gc-empty-state>
    <div v-else>
      <tabs
        v-model="activeTab"
        activation-mode="manual"
        class="w-full"
        :default-value="ResourceType.USER">
        <tabs-list class="grid grid-cols-2 w-full">
          <tabs-trigger :value="ResourceType.USER">
            You
          </tabs-trigger>
          <tabs-trigger :value="ResourceType.GROUP">
            Group
          </tabs-trigger>
        </tabs-list>
        <tabs-content :value="ResourceType.USER">
          <div v-if="userTodos.length">
            <table-root class="w-full">
              <table-header>
                <table-row no-hover-effect>
                  <table-head class="w-[50px]">
                    <checkbox
                      :checked="userTodos.every((u: Tables<'todos'>) => u.completed)"
                      @update:checked="batchUpdateTodos" />
                  </table-head>
                  <table-head class="font-bold">
                    Title
                  </table-head>
                </table-row>
              </table-header>
              <table-body>
                <table-row
                  v-for="todo in userTodos"
                  :key="todo.id">
                  <table-cell>
                    <checkbox
                      :checked="todo.completed"
                      @update:checked="updateTodo(todo, { completed: $event })" />
                  </table-cell>
                  <table-cell>
                    <gc-inline-edit
                      :model-value="todo.title ?? undefined"
                      name="title"
                      @update:model-value="updateTodo(todo, { title: $event as string })">
                      {{ todo.title }}
                    </gc-inline-edit>
                  </table-cell>
                </table-row>
              </table-body>
            </table-root>
          </div>
          <typography
            v-else
            class="text-base text-center">
            No todos found.
          </typography>
        </tabs-content>
        <tabs-content :value="ResourceType.GROUP">
          <div v-if="groupTodos.length">
            <table-root class="w-full">
              <table-header>
                <table-row no-hover-effect>
                  <table-head class="w-[50px]">
                    <checkbox :checked="groupTodos.every((u: Tables<'todos'>) => u.completed)" />
                  </table-head>
                  <table-head class="font-bold">
                    Title
                  </table-head>
                </table-row>
              </table-header>
              <table-body>
                <table-row
                  v-for="todo in groupTodos"
                  :key="todo.id">
                  <table-cell>
                    <checkbox
                      :checked="todo.completed"
                      @update:checked="updateTodo(todo, { completed: $event })" />
                  </table-cell>
                  <table-cell>
                    <gc-inline-edit
                      :model-value="todo.title ?? undefined"
                      name="title"
                      @update:model-value="updateTodo(todo, { title: $event as string })">
                      {{ todo.title }}
                    </gc-inline-edit>
                  </table-cell>
                </table-row>
              </table-body>
            </table-root>
          </div>
          <typography
            v-else
            class="text-base text-center">
            No group todos found.
          </typography>
        </tabs-content>
      </tabs>
    </div>
  </card>
</template>
