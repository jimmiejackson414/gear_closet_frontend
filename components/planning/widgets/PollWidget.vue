<script lang='ts' setup>
  import { usePlanningStore } from '@/stores/planning';
  import type { Tables } from '@/types';
  import type { ExtendedPoll } from '@/types/helpers';

  const $store = usePlanningStore();

  const isPollDialogOpen = ref(false);
  const isDeleteConfirmOpen = ref(false);
  const modalState = ref<'create' | 'edit'>('create');
  const blankModalForm: { question: Tables<'questions'>, answers: Tables<'answers'>[]} = {
    question: {
      id: 0,
      poll_id: 0,
      created_at: '',
      updated_at: '',
      profile_id: '',
      title: '',
    },
    answers: [{
      id: 0,
      question_id: 0,
      created_at: '',
      updated_at: '',
      profile_id: '',
      content: '',
    }],
  };

  const canAccessSettings = computed(() => {
    const user = useSupabaseUser();
    return $store.data.poll?.profile_id === user.value?.sub;
  });
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <icon-vote class="h-6 mr-6 text-primary w-6" />
        <p class="font-bold! text-base">
          Poll
        </p>
      </div>
      <div
        v-if="canAccessSettings"
        class="flex">
        <dropdown-menu>
          <dropdown-menu-trigger>
            <icon-ellipsis-vertical class="h-6 w-6" />
          </dropdown-menu-trigger>
          <dropdown-menu-content>
            <dropdown-menu-label>Actions</dropdown-menu-label>
            <dropdown-menu-separator />
            <dropdown-menu-item @select="[ modalState = 'edit', isPollDialogOpen = true ]">
              Edit Poll
            </dropdown-menu-item>
            <dropdown-menu-item @select="isDeleteConfirmOpen = true">
              Delete Poll
            </dropdown-menu-item>
          </dropdown-menu-content>
        </dropdown-menu>
      </div>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state v-else-if="!$store.pageLoading && !$store.data.poll">
      <typography class="mb-4">
        You haven't created a poll for this trip yet!
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="isPollDialogOpen = true">
        Get Started
      </button-root>
    </gc-empty-state>
    <div v-else>
      <poll-chart
        :poll="($store.data.poll as ExtendedPoll)"
        @create-answer="$store.data.poll?.answers.push($event)"
        @create-vote="$store.data.poll?.votes.push($event)" />
    </div>
  </card>

  <!-- Create & Edit Modal -->
  <lazy-modify-poll-dialog
    :form="$store.data.poll ?? blankModalForm"
    :is-open="isPollDialogOpen"
    :state="modalState"
    @on-close="isPollDialogOpen = false" />

  <!-- Delete Confirm Modal -->
  <lazy-delete-poll-dialog
    :is-open="isDeleteConfirmOpen"
    @on-close="isDeleteConfirmOpen = false" />
</template>
