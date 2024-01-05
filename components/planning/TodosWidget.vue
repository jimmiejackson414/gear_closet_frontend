<script lang='ts' setup>
  import { ListTodoIcon } from 'lucide-vue-next';
  import type { Todo } from '~/types';

  interface Props {
    data?: Todo[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: undefined,
    loading: false,
  });
</script>

<template>
  <div class="bg-grey-50 p-4 rounded-2xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <list-todo-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Todos
      </p>
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data?.length">
      <p class="mb-4 text-base">
        You haven't added any todos to this trip yet!
      </p>
      <gc-button
        label="Add a pack"
        outlined
        size="sm" />
    </gc-empty-state>
    <div v-else>
      Display todos
    </div>
  </div>
</template>
