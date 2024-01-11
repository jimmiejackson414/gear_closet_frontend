<script lang='ts' setup>
  import { CheckCircle2Icon, HelpCircleIcon, SettingsIcon, VoteIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';
  import type { Database } from '@/types';
  import type { ExtendedPoll } from '@/types/helpers';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip } = storeToRefs($store);

  const isSettingsOpen = ref(false);
  const isPollDialogOpen = ref(false);
  const submitting = ref(false);
  const modalState = ref<'create' | 'edit'>('create');
  const modalForm = reactive({
    question: '',
    answers: [''],
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
  const deletePoll = async () => {
    // try {
    //   const supabase = useSupabaseClient<Database>();
    //   const { error } = await supabase.from('polls')
    //     .delete()
    //     .eq('id', data.value.poll?.id);

    //   if (!error) {
    //     data.value.poll = null;
    //   }
    // } catch (err) {
    //   $appStore.notifyNegative('There was an error deleting the poll.');
    // } finally {
    //   isSettingsOpen.value = false;
    // }
  };

  /**
   * Update the selected trip's poll.
   */
  const updatePoll = async () => {
    // try {
    //   submitting.value = true;
    //   const supabase = useSupabaseClient<Database>();
    //   const { data: updatedPoll, error } = await supabase.from('polls')
    //     .update({
    //       question: modalForm.question,
    //       answers: modalForm.answers,
    //     })
    //     .eq('id', data.value.poll?.id)
    //     .select();

    //   if (updatedPoll?.length && !error) {
    //     data.value.poll = updatedPoll[0];
    //   }
    // } catch (err) {
    //   $appStore.notifyNegative('There was an error updating the poll.');
    // } finally {
    //   submitting.value = false;
    //   isPollDialogOpen.value = false;
    // }
  };

  /**
   * Create a new poll for the selected trip.
   */
  const createPoll = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: newPoll, error } = await supabase.rpc('create_poll', {
        trip_id: selectedTrip?.value?.id as number,
        question: modalForm.question,
        answers: modalForm.answers,
      })
        .returns<ExtendedPoll>()
        .single();

      if (newPoll && !error) {
        data.value.poll = newPoll;
      }
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
  const addAnswer = () => { modalForm.answers.push(''); };

  const settingsBtnRef = ref(null);
  const settingsDropdownRef = ref(null);
  onClickOutside(settingsBtnRef, () => isSettingsOpen.value = false);
  onClickOutside(settingsDropdownRef, () => isSettingsOpen.value = false);

  onMounted(() => {
    // set modalForm values if editing
    if (data.value.poll) {
      modalForm.question = data.value.poll.title;
      modalForm.answers = data.value.poll.answers.map((a) => a.content) as string[];
    }
  });
</script>

<template>
  <div class="bg-grey-50 px-8 py-4 rounded-2xl shadow-light">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <vote-icon class="h-6 mr-6 text-primary w-6" />
        <p class="font-bold text-base">
          Poll
        </p>
      </div>
      <span
        v-if="canAccessSettings"
        class="relative">
        <gc-button
          v-if="!pageLoading && data.poll"
          ref="settingsBtnRef"
          class="justify-self-end"
          :icon="SettingsIcon"
          round
          size="sm"
          @click="isSettingsOpen = !isSettingsOpen" />
        <fade-transition>
          <div
            v-if="isSettingsOpen"
            ref="settingsDropdownRef"
            class="absolute top-full right-0 bg-white border divide-gray-100 duration-300 max-w-sm mt-2 rounded-lg shadow transition-all w-max z-20">
            <ul>
              <li class="bg-white hover:bg-gray-50 duration-100 transition-[background]">
                <button
                  class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-center hover:text-primary"
                  @click="modalState = 'edit'; isPollDialogOpen = true">
                  Edit Poll
                </button>
              </li>
              <li class="bg-white hover:bg-gray-50 duration-100 transition-[background]">
                <button class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-center hover:text-danger-dark text-danger">
                  Delete Poll
                </button>
              </li>
            </ul>
          </div>
        </fade-transition>
      </span>
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
      <poll-chart />
    </div>
  </div>
  <gc-modal
    :is-open="isPollDialogOpen"
    :title="modalTitle"
    @handle-cancel="isPollDialogOpen = false">
    <template #default>
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
            v-model="modalForm.question"
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
              v-for="(answer, index) in modalForm.answers"
              :key="index"
              class="w-full">
              <gc-input
                v-model="modalForm.answers[index]"
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
</template>
