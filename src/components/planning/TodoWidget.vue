<template>
  <q-card
    id="todos-widget"
    class="widget box-shadow-light aside">
    <div v-if="loading">
      <ChecklistSkeleton
        v-for="i in [0,1,2]"
        :key="`todos-${i}`" />
    </div>
    <div v-else>
      <q-card-section class="header">
        <q-icon
          name="bi-list-check"
          color="primary"
          size="sm" />
        <p class="text-body1 title">
          Todos
        </p>
        <q-btn
          round
          color="primary"
          size="sm"
          unelevated
          :ripple="false"
          icon="bi-plus-lg"
          @click="handleCreate" />
      </q-card-section>
      <q-tabs
        v-model="tab"
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-6"
        align="justify"
        :breakpoint="0">
        <q-tab
          name="you"
          :ripple="false"
          :label="`You (${userTodos.length || 0})`" />
        <q-tab
          name="group"
          :ripple="false"
          :label="`Group (${groupTodos.length || 0})`" />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="tab"
        class="todos-panels"
        animated
        transition-next="jump-right"
        transition-prev="jump-left">
        <q-tab-panel
          name="you"
          class="q-pt-none">
          <ListTable
            :data="userTodos"
            :columns="columns"
            no-data-message="You haven't created any Todos yet!"
            @handle-delete="handleDelete"
            @handle-update="handleUpdate" />
        </q-tab-panel>
        <q-tab-panel
          name="group"
          class="q-pt-none">
          <ListTable
            :data="groupTodos"
            :columns="columns"
            no-data-message="You haven't created any Shopping Items yet!"
            @handle-delete="handleDelete"
            @handle-update="handleUpdate" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import { QTableProps } from 'quasar';
  import { storeToRefs } from 'pinia';
  import { usePlanningStore } from '@/stores/planning';
  import { CreateTodoInput, ResourceType, Todo } from '@/generated/types';
  import ChecklistSkeleton from './loading/ChecklistSkeleton.vue';
  import ListTable from './ListTable.vue';

  const store = usePlanningStore();
  const { loading, todos, selectedTrip } = storeToRefs(store);
  const tab = ref('you');

  const columns = [
    {
      name: 'completed', label: 'Completed', field: 'quantity', align: 'left', sortable: true, style: 'width: 40px',
    },
    {
      name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true,
    },
  ] as QTableProps['columns'];

  const userTodos = computed(() => todos.value.filter(todo => todo.resource_type === ResourceType.User));

  const groupTodos = computed(() => todos.value.filter(todo => todo.resource_type === ResourceType.Group));

  const handleCreate = async (): Promise<void> => {
    const newItem = {
      title: 'New Todo',
      completed: false,
      trip_id: selectedTrip.value?.id,
      resource_type: tab.value === 'you' ? ResourceType.User : ResourceType.Group,
    } as CreateTodoInput;

    await store.createTodo(newItem);
  };

  const handleDelete = async (todo: Todo): Promise<void> => {
    await store.deleteTodo(todo.id);
  };

  const handleUpdate = (todo: Todo): void => {
    const payload = { ...todo };
    delete payload.created_at;
    delete payload.updated_at;

    store.updateTodo(payload);
  };
</script>

<style lang='scss'>
  @import "@/css/planning/aside";

  .todos-panels {
    background-color: #f5f5f5;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  .todos-table {
    background-color: transparent;

    .q-table {
      td {
        color: $text;
      }
    }
  }
</style>
