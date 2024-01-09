<script lang='ts' setup>
  import { Tabs } from 'flowbite';
  import { ListTodoIcon, PlusIcon } from 'lucide-vue-next';
  import { ResourceType, type Database, type Todo, type UpdateTodo } from '@/types';
  import type { InstanceOptions, TabsOptions, TabsInterface, TabItem } from 'flowbite';

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
      const activeTab = tabs?.getActiveTab();
      const { data: newTodo, error } = await supabase.from('todos')
        .insert({
          trip_id: selectedTrip?.value?.id as number,
          title: 'New todo',
          completed: false,
          resource_type: activeTab?.id as ResourceType,
        })
        .select();

      if (newTodo?.length && !error) {
        data.value.todos.unshift(newTodo[0]);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new todo.');
    }
  };

  /**
   *  Updates a todo.
   * @param todo 
   */
  const updateTodo = async (todo: Todo, payload: UpdateTodo) => {
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
      $appStore.notifyNegative('There was an error updating the todo.');
    }
  };

  /**
   * Instantiates the tabs component.
   */
  let tabs: TabsInterface | null = null;
  watch([pageLoading, data], async (newValues) => {
    const [newPageLoading, newData] = newValues;
    if (!newPageLoading && newData?.todos.length) {
      await nextTick();
      const tabsElement = document?.getElementById('default-tab') as HTMLElement;
      if (tabsElement) {
        tabs = null;
        const tabElements: TabItem[] = [
          {
            id: ResourceType.USER,
            triggerEl: document?.querySelector('#you-tab') as HTMLElement,
            targetEl: document?.querySelector('#you') as HTMLElement,
          },
          {
            id: ResourceType.GROUP,
            triggerEl: document?.querySelector('#group-tab') as HTMLElement,
            targetEl: document?.querySelector('#group') as HTMLElement,
          },
        ];
        const options: TabsOptions = {
          defaultTabId: 'you-tab',
          activeClasses: 'text-primary hover:text-primary !border-primary border-primary border-b-2',
          inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
        };
        const instanceOptions: InstanceOptions = {
          id: 'default-tab',
          override: true,
        };
        tabs = new Tabs(tabsElement, tabElements, options, instanceOptions);
      }
    }
  }, { deep: true });
</script>

<template>
  <div class="bg-grey-50 px-8 py-4 rounded-2xl shadow-light">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <list-todo-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Todos
      </p>
      <gc-button
        v-if="!pageLoading && data?.todos.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        @click="createTodo" />
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
      <div class="border-b border-gray-200">
        <ul
          id="default-tab"
          class="-mb-px flex flex-wrap font-medium text-center text-gray-500 text-sm"
          role="tablist">
          <li
            class="me-2"
            role="presentation">
            <button
              id="you-tab"
              aria-controls="you"
              aria-selected="false"
              class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
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
              class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
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
            <table class="text-gray-500 text-left text-sm w-full">
              <thead class="bg-gray-50 text-gray-700 text-xs uppercase">
                <tr>
                  <th
                    class="p-0"
                    scope="col">
                    <div class="flex items-center" />
                  </th>
                  <th
                    class="px-6 py-0"
                    scope="col">
                    Title
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="todo in userTodos"
                  :key="todo.id">
                  <td class="p-0 w-4">
                    <div class="flex items-center">
                      <gc-checkbox
                        :id="`todo-${todo.id}`"
                        :checked="todo.completed"
                        strike-through
                        @update="e => updateTodo(todo, { completed: e })" />
                    </div>
                  </td>
                  <th
                    class="font-medium px-6 py-4 text-gray-900 whitespace-nowrap"
                    scope="row">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="todo.title"
                      name="title"
                      size="sm"
                      @handle-update="e => updateTodo(todo, { title: e })">
                      <p class="font-medium text-gray-500 text-sm">
                        {{ todo.title }}
                      </p>
                    </gc-inline-edit>
                  </th>
                </tr>
              </tbody>
            </table>
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
              :key="todo.id"
              class="mb-5 last:mb-0">
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
            class="text-center text-sm">
            No group todos found.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
