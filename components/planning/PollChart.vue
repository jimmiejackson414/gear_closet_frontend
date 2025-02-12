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

  const hasVoted = computed(() => props.poll.votes.some(v => v.profile_id === user.value?.id));
  const totalVotes = computed(() => props.poll.votes.reduce((acc) => acc + 1, 0));
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
    return calcAnswers.value.reduce((acc, cur) => {
      if (cur.percent > acc.percent) {
        return cur;
      }
      return acc;
    }, calcAnswers.value[0]);
  });

  const createVote = async (answer: Tables<'answers'>) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newVote, error } = await supabase.from('profile_answers')
        .insert({
          answer_id: answer.id,
          poll_id: props.poll.id,
          profile_id: user.value?.id,
        })
        .select();

      if (!error && newVote.length) { emits('createVote', newVote[0]); }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new vote.');
    } finally {
      submitting.value = false;
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
      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase.from('answers')
        .insert({
          content: newAnswer.value,
          profile_id: user.value?.id,
          question_id: props.poll.question.id,
        })
        .select();

      if (!error && data?.length) {
        emits('createAnswer', data[0]);
        resetNewAnswer();
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new answer.');
    } finally {
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
        v-for="(answer, i) in calcAnswers"
        :key="i">
        <!-- Show buttons if user has not voted yet -->
        <template v-if="!hasVoted">
          <button-root
            class="mb-3 w-full"
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
              :class="[ answer.content === highestPercentAnswer.content ? 'font-bold' : 'font-medium' ]">
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
            @blur="createAnswer"
            @keyup.enter="createAnswer"
            @keyup.escape="resetNewAnswer" />
        </div>
      </slide-up-transition>
    </div>
    <typography class="font-bold text-grey text-right text-sm">
      {{ poll.votes.length }} {{ poll.votes.length === 1 ? 'vote' : 'votes' }}
    </typography>
  </div>
</template>
