<script lang='ts' setup>
  import { ListTodoIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';

  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip } = storeToRefs($store);
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
        size="sm" />
    </gc-empty-state>
    <div v-else>
      Display todos
    </div>
  </div>
</template>
