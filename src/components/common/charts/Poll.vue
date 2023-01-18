<template>
  <div class="vue-poll">
    <h5 class="question text-h5 q-my-none text-weight-bolder">
      {{ question }}
    </h5>
    <div class="answers-container">
      <div
        v-for="(answer, i) in calcAnswers"
        :key="i"
        class="ans">
        <template v-if="!finalResults">
          <span v-if="!visibleResults">
            <q-btn
              class="ans-no-vote noselect full-width"
              outline
              :ripple="false"
              color="primary"
              :label="answer.text"
              @click.prevent="handleVote(answer)" />

          </span>
          <div
            v-else
            :class="{ 'ans-voted': true, selected: answer.selected }">
            <span
              v-if="answer.percent"
              class="percent"
              v-text="answer.percent" />
            <span
              class="txt"
              v-html="answer.text" />
          </div>
          <span
            class="bg"
            :style="{ width: visibleResults ? answer.percent : '0%' }" />
        </template>
        <template v-else>
          <div class="ans-voted final">
            <span
              v-if="answer.percent"
              class="percent text-subtitle2"
              v-text="answer.percent" />
            <span
              class="txt text-subtitle1"
              v-html="answer.text" />
          </div>
          <span
            :class="{ bg: true, selected: mostVotes.votes === answer.votes }"
            :style="{ width: answer.percent }" />
        </template>
      </div>
      <SlideUpTransition>
        <q-btn
          v-if="!isAdding"
          flat
          class="ans-new-vote noselect full-width q-mt-md"
          color="primary"
          :ripple="false"
          label="+ Create New Answer"
          @keydown="isAdding = true"
          @click="isAdding = true" />
        <q-input
          v-else
          ref="target"
          v-model="newAnswer"
          v-on-click-outside="() => isAdding = false"
          autofocus
          class="q-mt-md"
          label="New Answer"
          outlined
          dense
          @keyup.escape="resetNewAnswer"
          @keyup.enter="handleSubmitAnswer"
          @keyup.tab="handleSubmitAnswer"
          @blur="handleSubmitAnswer">
          <template #append>
            <q-btn
              icon="bi-check-circle"
              flat
              :ripple="false"
              color="primary"
              @click="handleSubmitAnswer" />
          </template>
        </q-input>
      </SlideUpTransition>
    </div>
    <div
      v-if="showTotalVotes && (visibleResults || finalResults)"
      class="votes"
      v-text="totalVotesFormatted + ' votes'" />
  </div>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import { vOnClickOutside } from '@vueuse/components';
  import SlideUpTransition from '@/components/transitions/SlideUpTransition.vue';

  export interface PollAnswer {
    value: number;
    text: string;
    votes: number;
    percent?: string;
    selected?: boolean;
  }

  interface Props {
    answers: PollAnswer[];
    finalResults?: boolean;
    question: string;
    multiple?: boolean;
    showResults?: boolean;
    showTotalVotes?: boolean;
    submitButtonText?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    answers: () => ([{
      value: 0,
      text: '',
      votes: 0,
      percent: '0%',
      selected: false,
    }]),
    finalResults: false,
    question: '',
    multiple: false,
    showResults: false,
    showTotalVotes: false,
    submitButtonText: 'Submit',
  });

  const emits = defineEmits(['addVote', 'addAnswer']);

  const visibleResults = ref(props.showResults);
  const isAdding = ref(false);
  const target = ref<any>(null);
  const newAnswer = ref('');

  const totalVotes = computed(() => props.answers.reduce((acc, cur) => acc + cur.votes, 0));

  const totalVotesFormatted = computed(() => totalVotes.value.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ','));

  const mostVotes = computed(() => props.answers.reduce((acc, cur) => {
    if (cur.votes > acc.votes) return cur;
    return acc;
  }, { votes: 0 } as PollAnswer));

  const calcAnswers = computed(() => {
    if (totalVotes.value === 0) {
      return props.answers.map(a => {
        a.percent = '0%';
        return a;
      });
    }

    return props.answers.filter(a => {
      if (Number(a.votes) && a.votes > 0) {
        a.percent = `${Math.round((Number(a.votes) / totalVotes.value) * 100)}%`;
      } else {
        a.percent = '0%';
      }

      return a;
    });
  });

  const handleVote = (a: PollAnswer): void => {
    a.votes += 1;
    a.selected = true;
    visibleResults.value = true;

    const obj = { value: a.value, votes: a.votes, totalVotes: totalVotes.value };
    emits('addVote', obj);
  };

  const resetNewAnswer = (): void => {
    isAdding.value = false;
    newAnswer.value = '';
  };

  const handleSubmitAnswer = (): void => {
    emits('addAnswer', newAnswer.value);
    resetNewAnswer();
  };
</script>

<style lang='scss' scoped>
  .vue-poll {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;

    .answers-container {
      margin: 20px 0;

      .ans {
        position: relative;
        margin-top: 10px;

        &:first-child {
          margin-top: 0;
        }

        .bg {
          position: absolute;
          width: 0%;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 0;
          background-color: #e1e8ed;
          border-radius: 1rem;
          transition: all 0.3s cubic-bezier(0.5, 1.2, 0.5, 1.2);

          &.selected {
            background-color: #77c7f7;
          }
        }
      }

      .ans-new-vote {
        height: 40px;
      }

      .noselect {
        -webkit-touch-callout: none;
        user-select: none;
      }

      .ans-no-vote {
        text-align: center;
        box-sizing: border-box;
        border-radius: 5px;
        transition: background 0.2s ease-in-out;

        .txt {
          transition: color 0.2s ease-in-out;
        }
      }

      .ans-voted {
        padding: 5px 0;

        /* stylelint-disable-next-line no-descending-specificity */
        .percent,
        .txt {
          position: relative;
          z-index: 1;
        }

        .percent {
          font-weight: bold;
          min-width: 51px;
          display: inline-block;
          margin: 0 10px;
        }

        &.selected {
          .txt {
            &::after {
              content: "✔";
              margin-left: 10px;
            }
          }
        }
      }
    }

    .votes {
      font-size: 14px;
      color: #8899a6;
    }

    .submit {
      display: block;
      text-align: center;
      margin: 0 auto;
      max-width: 80px;
      text-decoration: none;
      background-color: #41b882;
      color: #fff;
      padding: 10px 25px;
      border-radius: 5px;
    }
  }
</style>
