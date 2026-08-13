<script lang='ts' setup>
  import type { Database, Tables } from '~/types';
  import type { ExtendedPoll } from '~/types/helpers';

  interface Props {
    poll: ExtendedPoll;
  }

  const props = defineProps<Props>();

  const $appStore = useAppStore();
  const submitting = ref(false);
  const isAdding = ref(false);
  const user = useSupabaseUser();
  const emits = defineEmits(['createAnswer', 'createVote']);

  const hasVoted = computed(() => props.poll.votes.some(v => v.profile_id === user.value?.sub));
  const totalVotes = computed(() => props.poll.votes.length);
  const calcAnswers = computed(() => {
    if (totalVotes.value === 0) {
      return props.poll.answers.map(a => {
        return { ...a, percent: 0 };
      });
    }

    return props.poll.answers.map(a => {
      const votesForAnswer = props.poll.votes.filter(v => v.answer_id === a.id).length;
      return {
        ...a,
        percent: votesForAnswer > 0 ? Math.round((votesForAnswer / totalVotes.value) * 100) : 0,
      };
    });
  });

  const highestPercentAnswer = computed(() => {
    const first = calcAnswers.value[0];
    if (!first) return undefined;
    return calcAnswers.value.reduce((acc: Tables<'answers'> & { percent: number }, cur: Tables<'answers'> & { percent: number }) => {
      if (cur.percent > acc.percent) {
        return cur;
      }
      return acc;
    }, first);
  });

  const votingAnswerId = ref<number | null>(null);
  const createVote = async (answer: Tables<'answers'>) => {
    try {
      submitting.value = true;
      votingAnswerId.value = answer.id;
      const supabase = useSupabaseClient<Database>();
      const { data: newVote, error } = await supabase.from('profile_answers')
        .insert({
          profile_id: user.value?.sub,
          answer_id: answer.id,
          poll_id: props.poll.id,
        })
        .select();

      if (error) {
        $appStore.notifyNegative(error.message || 'There was an error creating a new vote.');
        return;
      }

      if (newVote?.length) {
        emits('createVote', newVote[0]);
      }
    } catch {
      $appStore.notifyNegative('There was an error creating a new vote.');
    } finally {
      submitting.value = false;
      votingAnswerId.value = null;
    }
  };

  const newAnswer = ref('');
  const newAnswerInputRef = ref(null);
  const resetNewAnswer = () => {
    newAnswer.value = '';
    isAdding.value = false;
  };

  const createAnswer = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase.from('answers')
        .insert({
          content: newAnswer.value,
          question_id: props.poll.question.id,
          profile_id: user.value?.sub,
        })
        .select();

      if (error) {
        $appStore.notifyNegative(error.message || 'There was an error creating a new answer.');
        return;
      }

      if (data?.length) {
        emits('createAnswer', data[0]);
        resetNewAnswer();
      }
    } catch {
      $appStore.notifyNegative('There was an error creating a new answer.');
    } finally {
      submitting.value = false;
      isAdding.value = false;
    }
  };
  onClickOutside(newAnswerInputRef, () => isAdding.value = false);
</script>

<template>
  <div>
    <typography
      class="font-bold text-center text-xl"
      variant="large">
      {{ poll.question.title }}
    </typography>
    <div class="grid grid-cols-1-col my-4">
      <div
        v-for="answer in calcAnswers"
        :key="answer.id">
        <!-- Show buttons if user has not voted yet -->
        <template v-if="!hasVoted">
          <button-root
            class="mb-3 w-full"
            :disabled="submitting"
            :loading="votingAnswerId === answer.id"
            variant="outline"
            @click="createVote(answer)">
            {{ answer.content }}
          </button-root>
        </template>

        <!-- Else, show the results -->
        <template v-else>
          <div class="bg-accent-light flex justify-center items-center h-10 mb-3 relative rounded-lg w-full">
            <div
              class="absolute left-0 bg-accent h-10 rounded-lg"
              :style="{ width: answer.percent + '%' }" />
            <div
              class="absolute ml-2"
              :class="[ answer.content === highestPercentAnswer?.content ? 'font-bold' : 'font-medium' ]">
              {{ answer.content }} ({{ answer.percent + '%' }})
            </div>
          </div>
        </template>
      </div>

      <!-- Show the add answer button if user has not voted yet -->
      <slide-up-transition v-if="!hasVoted && poll.answers.length < 6">
        <button-root
          v-if="!isAdding"
          class="justify-self-center"
          :disabled="submitting"
          size="sm"
          @click="isAdding = true">
          <icon-plus class="h-4 mr-2 w-4" />
          Add Answer
        </button-root>
        <div
          v-else
          class="grid gap-1.5 items-center mb-4 w-full">
          <label-root for="newAnswer">
            New Answer
          </label-root>
          <input-root
            id="newAnswer"
            ref="newAnswerInputRef"
            v-model="newAnswer"
            class="mt-2 w-full"
            :disabled="submitting"
            @blur="createAnswer"
            @keyup.enter="createAnswer"
            @keyup.escape="resetNewAnswer" />
        </div>
      </slide-up-transition>
    </div>
    <typography class="font-bold text-muted-foreground text-right text-sm">
      {{ totalVotes }} {{ totalVotes === 1 ? 'vote' : 'votes' }}
    </typography>
  </div>
</template>
