<script lang='ts' setup>
  import { VoteIcon } from 'lucide-vue-next';
  import type { Poll } from '~/types';

  interface Props {
    data?: Poll;
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
      <vote-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Poll
      </p>
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data">
      <p class="mb-4 text-base">
        You haven't created a poll for this trip yet!
      </p>
      <gc-button
        label="Create a poll"
        outlined
        size="sm" />
    </gc-empty-state>
  </div>
</template>
