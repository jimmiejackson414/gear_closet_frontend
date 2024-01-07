<script lang='ts' setup>
  import { ListTodoIcon } from 'lucide-vue-next';
  import { ResourceType, type Database, type Todo, type UpdateTodo } from '@/types';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip } = storeToRefs($store);

  const userTodos = computed(() => {
    return data.value.todos.filter(t => t.resource_type === ResourceType.USER);
  });

  const groupTodos = computed(() => {
    return data.value.todos.filter(t => t.resource_type === ResourceType.GROUP);
  });

  /**
   * Creates a new todo for the selected trip.
   */
  const createTodo = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newTodo, error } = await supabase.from('todos')
        .insert({
          trip_id: selectedTrip?.value?.id as number,
          title: 'New todo',
          completed: false,
          resource_type: 'USER', // OR GROUP
        })
        .select();

      if (newTodo?.length && !error) {
        data.value.todos.unshift(newTodo[0]);
      }
    } catch (err) {
      console.log({ err });
      $appStore.notifyNegative('There was an error creating a new todo.');
    }
  };

  /**
   *  Updates a todo.
   * @param todo 
   */
  const updateTodo = async (todo: Todo, payload: UpdateTodo) => {
    console.log({ todo, payload });
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTodo, error } = await supabase.from('todos')
        .update(payload)
        .eq('id', todo.id as number)
        .select();

      if (updatedTodo?.length && !error) {
        const index = data.value.todos.findIndex((t) => t.id === todo.id);
        data.value.todos[index] = updatedTodo[0];
      }
    } catch (err) {
      console.log({ err });
      $appStore.notifyNegative('There was an error updating the todo.');
    }
  };
</script>

<template>
  <div class="bg-grey-50 px-8 py-4 rounded-2xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <list-todo-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Todos
      </p>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data?.todos.length">
      <p class="mb-4 text-base">
        You haven't added any todos to this trip yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm"
        @click="createTodo" />
    </gc-empty-state>
    <div v-else>
      <div class="border-b border-gray-200 mb-4">
        <ul
          id="default-tab"
          class="-mb-px flex flex-wrap font-medium text-center text-sm"
          data-tabs-toggle="#default-tab-content"
          role="tablist">
          <li
            class="me-2"
            role="presentation">
            <button
              id="you-tab"
              aria-controls="you"
              aria-selected="false"
              class="aria-selected:border-primary aria-selected:text-primary border-b-2 hover:border-gray-300 inline-block p-4 rounded-t-lg hover:text-gray-600"
              data-tabs-target="#you"
              role="tab"
              type="button">
              You
            </button>
          </li>
          <li
            class="me-2"
            role="presentation">
            <button
              id="group-tab"
              aria-controls="group"
              aria-selected="false"
              class="aria-selected:border-primary aria-selected:text-primary border-b-2 hover:border-gray-300 inline-block p-4 rounded-t-lg hover:text-gray-600"
              data-tabs-target="#group"
              role="tab"
              type="button">
              Group
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div
          id="you"
          aria-labelledby="you-tab"
          class="bg-gray-50 hidden p-4 rounded-lg"
          role="tabpanel">
          <div v-if="userTodos.length">
            <div
              v-for="todo in userTodos"
              :key="todo.id">
              <gc-checkbox
                :id="`todo-${todo.id}`"
                :checked="todo.completed"
                :label="todo.title"
                strike-through
                @update="e => updateTodo(todo, { completed: e })" />
            </div>
          </div>
          <p
            v-else
            class="text-base text-center">
            No todos found.
          </p>
        </div>
        <div
          id="group"
          aria-labelledby="group-tab"
          class="bg-gray-50 hidden p-4 rounded-lg"
          role="tabpanel">
          <div v-if="groupTodos.length">
            <div
              v-for="todo in groupTodos"
              :key="todo.id">
              <gc-checkbox
                :id="`todo-${todo.id}`"
                :checked="todo.completed"
                :label="todo.title"
                strike-through
                @update="e => updateTodo(todo, { completed: e })" />
            </div>
          </div>
          <p class="text-center text-sm">
            No group todos found.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
