<script lang='ts' setup>
  import { IconCheck, IconCircleHelp } from '#components';
  import type { Database, Tables } from '@/types';
  import type { ExtendedPoll } from '@/types/helpers';

  interface Props {
    isOpen: boolean;
    state: 'create' | 'edit';
    form: { question: Tables<'questions'>, answers: Tables<'answers'>[]}
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose']);
  const isSubmitting = ref(false);
  const $appStore = useAppStore();
  const $store = usePlanningStore();

  let localForm = reactive({ ...props.form });

  /**
   * Update the selected trip's poll.
   */
  const updatePoll = async () => {
    try {
      isSubmitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: updatedPoll, error } = await supabase.rpc('update_poll', {
        poll_id: $store.data.poll?.id as number,
        question: localForm.question?.title as string,
        answers: localForm.answers.map((a: Tables<'answers'>) => a.content) as string[],
      })
        .select();

      if (error) { $appStore.notifyNegative('There was an error updating the poll.');}
      if (updatedPoll) { $store.data.poll = updatedPoll as unknown as ExtendedPoll; }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the poll.');
    } finally {
      isSubmitting.value = false;
      emits('onClose');
    }
  };

  /**
   * Create a new poll for the selected trip.
   */
  const createPoll = async () => {
    try {
      isSubmitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: newPoll, error } = await supabase.rpc('create_poll', {
        trip_id: Number($store.selectedTripId),
        question: localForm.question?.title as string,
        answers: localForm.answers.map((a: Tables<'answers'>) => a.content) as string[],
      })
        .single();

      if (error) { $appStore.notifyNegative('There was an error creating a new poll.');}
      if (newPoll) { $store.data.poll = newPoll as ExtendedPoll; }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new poll.');
    } finally {
      isSubmitting.value = false;
      emits('onClose');
    }
  };

  /**
   * Add a new answer to the poll.
   */
  const addAnswer = () => {
    localForm.answers.push({
      id: 0,
      question_id: 0,
      created_at: '',
      updated_at: '',
      profile_id: '',
      content: '',
    });
  };

  /**
   * Removes an answer from the poll.
   */
  const removeAnswer = (index: number) => {
    localForm.answers.splice(index, 1);
  };

  /**
   * Close and reset the form
   */
  const handleClose = () => {
    localForm = { ...props.form };
    emits('onClose');
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>{{ capitalize(state) }} Poll</dialog-title>
        <dialog-description>
          <span
            v-if="state === 'create'"
            class="mb-2">
            Create a poll for your friends to vote on!
          </span>
          <span
            v-else-if="state === 'edit'"
            class="mb-2">
            All friends invited to this trip will be able to vote and add new suggestions.
          </span>
        </dialog-description>
      </dialog-header>
      <div class="w-full">
        <div class="grid gap-1.5 items-center mb-4 w-full">
          <label-root for="question">
            Question
          </label-root>
          <input-root
            id="question"
            v-model="localForm.question.title"
            placeholder="Where should we go hiking this year?"
            :prepend-icon="IconCircleHelp" />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <label-root for="answer">
            Answers
          </label-root>
          <div
            v-for="(_answer, index) in localForm.answers"
            :key="index"
            class="flex items-center w-full">
            <input-root
              :id="`Answer-${index}`"
              v-model="localForm.answers[index].content"
              :placeholder="`Answer ${index + 1}`"
              :prepend-icon="IconCheck" />
            <button-root
              class="justify-self-end ml-2"
              size="sm"
              variant="ghost"
              @click="removeAnswer(index)">
              <icon-x class="text-destructive" />
            </button-root>
          </div>
          <button-root
            class="justify-self-start"
            :disabled="localForm.answers.length >= 6"
            size="sm"
            variant="outline"
            @click="addAnswer">
            Add answer
          </button-root>
        </div>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="isSubmitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="state === 'edit' ? updatePoll() : createPoll()">
          {{ state === 'edit' ? 'Update' : 'Create' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
