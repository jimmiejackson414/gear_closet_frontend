<script lang='ts' setup>
  import { IconCheck, IconCircleHelp } from '#components';
  import { validatePollForm } from '@/utils/pollFormValidation';
  import type { Database, Tables } from '@/types';
  import type { ExtendedPoll } from '@/types/helpers';

  type PollForm = {
    question: Tables<'questions'>;
    answers: Tables<'answers'>[];
  };

  interface Props {
    isOpen: boolean;
    state: 'create' | 'edit';
    form: PollForm;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose']);
  const isSubmitting = ref(false);
  const $appStore = useAppStore();
  const $store = usePlanningStore();

  const validationErrors = reactive({
    question: '',
    answers: '',
  });

  /** Deep clone so edits never share nested question/answers with the live store. */
  const cloneForm = (form: PollForm): PollForm => ({
    question: { ...form.question },
    answers: form.answers.map(answer => ({ ...answer })),
  });

  const localForm = reactive<PollForm>(cloneForm(props.form));

  const clearValidationErrors = () => {
    validationErrors.question = '';
    validationErrors.answers = '';
  };

  watch(
    () => props.isOpen,
    (open) => {
      if (open) {
        const next = cloneForm(props.form);
        localForm.question = next.question;
        localForm.answers = next.answers;
        clearValidationErrors();
      }
    },
  );

  const submitPoll = async () => {
    const validation = validatePollForm({
      question: localForm.question?.title ?? '',
      answers: localForm.answers.map((answer) => answer.content ?? ''),
    });

    validationErrors.question = validation.errors.question ?? '';
    validationErrors.answers = validation.errors.answers ?? '';

    if (!validation.ok) return;

    if (props.state === 'edit') {
      await updatePoll(validation.filledAnswers);
    } else {
      await createPoll(validation.filledAnswers);
    }
  };

  /**
   * Update the selected trip's poll.
   */
  const updatePoll = async (answers: string[]) => {
    try {
      isSubmitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: updatedPoll, error } = await supabase.rpc('update_poll', {
        poll_id: $store.data.poll?.id as number,
        question: localForm.question.title.trim(),
        answers,
      })
        .select();

      if (error) {
        $appStore.notifyNegative('There was an error updating the poll.');
        return;
      }
      if (updatedPoll) {
        $store.data.poll = updatedPoll as unknown as ExtendedPoll;
      }
      emits('onClose');
    } catch {
      $appStore.notifyNegative('There was an error updating the poll.');
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Create a new poll for the selected trip.
   */
  const createPoll = async (answers: string[]) => {
    try {
      isSubmitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: newPoll, error } = await supabase.rpc('create_poll', {
        trip_id: Number($store.selectedTripId),
        question: localForm.question.title.trim(),
        answers,
      })
        .single();

      if (error) {
        $appStore.notifyNegative('There was an error creating a new poll.');
        return;
      }
      if (newPoll) {
        $store.data.poll = newPoll as ExtendedPoll;
      }
      emits('onClose');
    } catch {
      $appStore.notifyNegative('There was an error creating a new poll.');
    } finally {
      isSubmitting.value = false;
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
    if (localForm.answers.length <= 1) return;
    localForm.answers.splice(index, 1);
  };

  /**
   * Close without writing draft edits back to the store.
   */
  const handleClose = () => {
    clearValidationErrors();
    emits('onClose');
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-112.5 lg:max-w-162.5"
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
            :aria-invalid="Boolean(validationErrors.question)"
            placeholder="Where should we go hiking this year?"
            :prepend-icon="IconCircleHelp"
            @update:model-value="validationErrors.question = ''" />
          <p
            v-if="validationErrors.question"
            class="text-destructive text-sm">
            {{ validationErrors.question }}
          </p>
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
              v-model="_answer.content"
              :placeholder="`Answer ${index + 1}`"
              :prepend-icon="IconCheck"
              @update:model-value="validationErrors.answers = ''" />
            <button-root
              class="justify-self-end ml-2"
              :disabled="localForm.answers.length <= 1"
              size="sm"
              type="button"
              variant="ghost"
              @click="removeAnswer(index)">
              <icon-x class="text-destructive" />
            </button-root>
          </div>
          <p
            v-if="validationErrors.answers"
            class="text-destructive text-sm">
            {{ validationErrors.answers }}
          </p>
          <button-root
            class="justify-self-start"
            :disabled="localForm.answers.length >= 6"
            size="sm"
            type="button"
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
          @click="submitPoll">
          {{ state === 'edit' ? 'Update' : 'Create' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
