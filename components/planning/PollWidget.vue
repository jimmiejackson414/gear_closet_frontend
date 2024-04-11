<script lang='ts' setup>
  import { AlertCircleIcon, CheckCircle2Icon, HelpCircleIcon, SettingsIcon, VoteIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';
  import type { Database, Tables } from '@/types';
  import type { ExtendedPoll } from '@/types/helpers';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTripId } = storeToRefs($store);

  const isSettingsOpen = ref(false);
  const isPollDialogOpen = ref(false);
  const submitting = ref(false);
  const modalState = ref<'create' | 'edit'>('create');
  const modalForm = reactive<{ question: Tables<'questions'>, answers: Tables<'answers'>[]}>({
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
  });

  const modalTitle = computed(() => {
    return modalState.value === 'edit' ? 'Edit Poll' : 'Create Poll';
  });

  const canAccessSettings = computed(() => {
    const user = useSupabaseUser();
    return data.value.poll?.profile_id === user.value?.id;
  });

  /**
   * Delete poll from the selected trip.
   */
  const isDeleteConfirmOpen = ref(false);
  const deletePoll = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from('polls')
        .delete()
        .eq('id', data.value.poll?.id as number);

      if (error) { $appStore.notifyNegative('There was an error deleting the poll.'); }
      else {
        data.value.poll = undefined;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the poll.');
    } finally {
      isDeleteConfirmOpen.value = false;
    }
  };

  /**
   * Update the selected trip's poll.
   */
  const updatePoll = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: updatedPoll, error } = await supabase.rpc('update_poll', {
        poll_id: data.value.poll?.id as number,
        question: modalForm.question?.title as string,
        answers: modalForm.answers.map(a => a.content) as string[],
      })
        .returns<ExtendedPoll>()
        .select();

      if (error) { $appStore.notifyNegative('There was an error updating the poll.');}
      if (updatedPoll) { data.value.poll = updatedPoll as unknown as ExtendedPoll; }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the poll.');
    } finally {
      submitting.value = false;
      isPollDialogOpen.value = false;
    }
  };

  /**
   * Create a new poll for the selected trip.
   */
  const createPoll = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: newPoll, error } = await supabase.rpc('create_poll', {
        trip_id: selectedTripId?.value as number,
        question: modalForm.question?.title as string,
        answers: modalForm.answers.map(a => a.content) as string[],
      })
        .returns<ExtendedPoll>()
        .single();

      if (error) { $appStore.notifyNegative('There was an error creating a new poll.');}
      if (newPoll) { data.value.poll = newPoll; }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new poll.');
    } finally {
      submitting.value = false;
      isPollDialogOpen.value = false;
    }
  };

  /**
   * Add a new answer to the poll.
   */
  const addAnswer = () => {
    modalForm.answers.push({
      id: 0,
      question_id: 0,
      created_at: '',
      updated_at: '',
      profile_id: '',
      content: '',
    });
  };

  const settingsBtnRef = ref(null);
  const settingsDropdownRef = ref(null);
  onClickOutside(settingsBtnRef, () => isSettingsOpen.value = false);
  onClickOutside(settingsDropdownRef, () => isSettingsOpen.value = false);

  watch(() => data.value.poll, (newPoll) => {
    if (newPoll) {
      modalForm.question = JSON.parse(JSON.stringify(newPoll.question));
      modalForm.answers = JSON.parse(JSON.stringify(newPoll.answers));
    }
  }, { immediate: true });
</script>

<template>
  <div class="card card-aside">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <vote-icon class="h-6 mr-6 text-primary w-6" />
        <p class="!font-bold text-base">
          Poll
        </p>
      </div>
      <div
        v-if="canAccessSettings"
        class="flex">
        <headless-menu
          as="div"
          class="inline-block relative text-left">
          <div class="bg-primary flex justify-center items-center h-6 rounded-full w-6">
            <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-0 py-2 rounded-md text-sm text-white">
              <settings-icon class="h-4 w-4" />
            </headless-menu-button>
          </div>
          <zoom-transition>
            <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 z-10 focus:outline-none">
              <headless-menu-item @click="[ modalState = 'edit', isPollDialogOpen = true ]">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                  Edit Poll
                </p>
              </headless-menu-item>
              <headless-menu-item @click="isDeleteConfirmOpen = true">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-danger hover:bg-gray-100">
                  Delete Poll
                </p>
              </headless-menu-item>
            </headless-menu-items>
          </zoom-transition>
        </headless-menu>
      </div>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.poll">
      <p class="mb-4 text-base">
        You haven't created a poll for this trip yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm"
        @click="isPollDialogOpen = true" />
    </gc-empty-state>
    <div v-else>
      <poll-chart
        :poll="(data.poll as ExtendedPoll)"
        @create-answer="data.poll?.answers.push($event)"
        @create-vote="data.poll?.votes.push($event)" />
    </div>
  </div>

  <!-- Create & Edit Modal -->
  <gc-modal
    :is-open="isPollDialogOpen"
    :title="modalTitle"
    @handle-cancel="isPollDialogOpen = false">
    <template #content>
      <div class="flex flex-col">
        <p
          v-if="modalState === 'create'"
          class="mb-2 text-base">
          Create a poll for your friends to vote on!
        </p>
        <p
          v-if="modalState === 'create'"
          class="mb-6 text-sm">
          All friends invited to this Trip will be able to vote and add new suggestions.
        </p>
        <label
          class="flex flex-col font-bold gap-2 mb-4 text-grey text-sm"
          for="question">
          Question
          <gc-input
            v-model="modalForm.question.title"
            class="font-normal text-base w-full"
            name="question"
            placeholder="Where should we go hiking this year?"
            :prepend-icon="HelpCircleIcon" />
        </label>
        <div class="grid grid-cols-1 gap-4">
          <label
            class="flex flex-col font-bold gap-2 text-grey text-sm"
            for="answer">
            Answers
            <div
              v-for="(_answer, index) in modalForm.answers"
              :key="index"
              class="w-full">
              <gc-input
                v-model="modalForm.answers[index].content"
                class="font-normal w-full"
                :name="`Answer-${index}`"
                :placeholder="`Answer ${index + 1}`"
                :prepend-icon="CheckCircle2Icon" />
            </div>
          </label>
          <gc-button
            class="justify-self-start"
            :disabled="modalForm.answers.length >= 6"
            label="Add answer"
            size="sm"
            variant="positive"
            @click="addAnswer" />
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-end items-center gap-4 w-full">
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="isPollDialogOpen = false" />
        <gc-button
          :disabled="submitting"
          :label="modalState === 'edit' ? 'Update' : 'Create'"
          :loading="submitting"
          size="sm"
          @click="modalState === 'edit' ? updatePoll() : createPoll()" />
      </div>
    </template>
  </gc-modal>

  <!-- Delete Confirm Modal -->
  <gc-modal
    :is-open="isDeleteConfirmOpen"
    size="sm"
    @handle-cancel="isDeleteConfirmOpen = false">
    <template #content>
      <div class="flex justify-center items-center flex-col">
        <alert-circle-icon class="h-12 mb-4 text-danger w-12" />
        <p class="mb-2 text-base">
          Are you sure you want to delete this poll?
        </p>
        <p class="font-bold mb-4 text-sm">
          This action cannot be undone.
        </p>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-center items-center gap-4 w-full">
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="isDeleteConfirmOpen = false" />
        <gc-button
          :disabled="submitting"
          label="Yes, I'm Sure"
          :loading="submitting"
          size="sm"
          variant="danger"
          @click="deletePoll" />
      </div>
    </template>
  </gc-modal>
</template>
