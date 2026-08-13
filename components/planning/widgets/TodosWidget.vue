<script lang='ts' setup>
  import { ResourceType, type Tables } from '@/types';

  const $store = usePlanningStore();

  const activeTab = ref<ResourceType>(ResourceType.USER);
  const userTodos = computed(() => {
    return $store.data.todos.filter(t => t.resource_type === ResourceType.USER);
  });

  const groupTodos = computed(() => {
    return $store.data.todos.filter(t => t.resource_type === ResourceType.GROUP);
  });

  const createTodo = () => $store.createTodo(activeTab.value);
  const updateTodo = (todo: Tables<'todos'>, payload: Parameters<typeof $store.updateTodo>[1]) => {
    return $store.updateTodo(todo, payload);
  };
  const batchUpdateTodos = (completed: boolean | 'indeterminate', resourceType: ResourceType) => {
    return $store.batchUpdateTodos(completed, resourceType);
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
                      @update:checked="batchUpdateTodos($event, ResourceType.USER)" />
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
                    <checkbox
                      :checked="groupTodos.every((u: Tables<'todos'>) => u.completed)"
                      @update:checked="batchUpdateTodos($event, ResourceType.GROUP)" />
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
