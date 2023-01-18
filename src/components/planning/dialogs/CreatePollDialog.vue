<!-- eslint-disable vuejs-accessibility/no-autofocus -->
<template>
  <q-dialog
    :model-value="props.isOpen"
    class="create-poll-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-form @submit.prevent.stop="handleCreate">
        <q-card-section class="header">
          <div class="row justify-between align-center">
            <h6 class="text-h6 q-ma-none">
              Create A New Poll
            </h6>
            <q-icon name="bi-info-circle-fill">
              <q-tooltip class="text-center">
                All friends invited to this Trip will <br>be able to vote and add new suggestions.
              </q-tooltip>
            </q-icon>
          </div>
          <p
            class="text-body1 q-mb-none">
            For example, "Where should we go hiking this year?"
          </p>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 q-col-gutter-sm">
              <q-input
                v-model="question"
                :disable="isSubmitting"
                outlined
                dense
                autofocus
                class="q-mb-md"
                aria-required="true"
                label="Question">
                <template #prepend>
                  <q-icon name="bi-question-circle" />
                </template>
              </q-input>
              <q-input
                v-for="(answer, i) in answers"
                :key="i"
                v-model="answers[i]"
                :disable="isSubmitting"
                outlined
                dense
                :value="answer"
                :label="`Answer ${i + 1}`">
                <template #prepend>
                  <q-icon name="bi-check" />
                </template>
              </q-input>
              <q-btn
                class="add-answer-btn"
                flat
                rounded
                dense
                size="sm"
                color="primary"
                label="Add Answer"
                icon="bi-plus"
                @click="createNewAnswer" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-between">
          <q-btn
            unelevated
            :ripple="false"
            flat
            text-color="text"
            label="Cancel"
            :disable="isSubmitting"
            @click="emit('handleClose')" />
          <q-btn
            unelevated
            :ripple="false"
            color="primary"
            label="Create"
            :loading="isSubmitting"
            :disable="isSubmitting"
            type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { watchEffect, ref } from 'vue';
  import { usePlanningStore } from '@/stores/planning';
  import { CreatePollInput } from '@/generated/types';

  // define props
  const props = defineProps<{
    isOpen: boolean;
  }>();

  // define emits
  const emit = defineEmits(['handleClose']);

  // define store
  const $store = usePlanningStore();

  // local state
  const isSubmitting = ref(false);
  const question = ref('');
  const answers = ref(['']);

  // handle create function
  const handleCreate = async (): Promise<void> => {
    isSubmitting.value = true;
    const payload: CreatePollInput = {
      question: question.value,
      answers: answers.value,
      tripId: $store.selectedTrip?.id as number,
    };
    await $store.createPoll(payload);

    emit('handleClose');
    isSubmitting.value = false;
  };

  // create new answer
  const createNewAnswer = (): void => {
    answers.value.push('');
  };

  // reset local state
  watchEffect(() => {
    if (!props.isOpen) {
      question.value = '';
      answers.value = [''];
    }
  });
</script>

<style lang="scss" scoped>
  .add-answer-btn {
    margin: 0.5rem 0.5rem 0;
    padding-right: 12px;
    padding-bottom: 8px;
  }
</style>
