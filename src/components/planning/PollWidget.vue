<template>
  <q-card
    id="poll-widget"
    class="widget box-shadow-light aside">
    <div v-if="loading">
      <FriendSkeleton
        v-for="i in [0, 1, 2]"
        :key="`friends-${i}`" />
    </div>
    <div v-else>
      <q-card-section class="header">
        <q-icon
          name="bi-bar-chart-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title">
          Poll
        </p>
        <div
          v-if="canAccessSettings"
          class="action-btns-wrapper">
          <q-btn
            class="poll-settings"
            round
            color="grey-4"
            size="sm"
            text-color="text"
            unelevated
            :ripple="false"
            icon="bi-gear-fill">
            <q-menu>
              <q-list style="min-width: 100px;">
                <q-item
                  v-close-popup
                  clickable
                  @click="isRemovePollModalOpen = true">
                  <q-item-section>Remove Poll</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="poll-container">
        <Poll
          :question="options.question"
          :answers="options.answers"
          show-total-votes
          :show-results="shouldShowResults"
          @add-answer="addAnswer"
          @add-vote="addVote" />
      </q-card-section>
    </div>
  </q-card>
  <AlertDialog
    alert-color="negative"
    btn-color="negative"
    :has-cancel-btn="true"
    :is-open="isRemovePollModalOpen"
    :is-submitting="isLoading"
    title="Remove Poll"
    @handle-close="isRemovePollModalOpen = false"
    @handle-continue="handleRemovePoll">
    <template #content>
      <p class="text-body1">
        Are you sure you want to remove this poll?
      </p>
      <p class="text-body1">
        This action will <strong>permanently</strong> remove this poll and cannot be undone.
      </p>
    </template>
  </AlertDialog>
</template>

<script lang='ts' setup>
  import { computed, defineAsyncComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { usePlanningStore } from '@/stores/planning';
  import { useAuthStore } from '@/stores/auth';
  import Poll from '@/components/common/charts/Poll.vue';
  import { Answer } from '@/generated/types';
  import FriendSkeleton from './loading/FriendSkeleton.vue';

  const AlertDialog = defineAsyncComponent(() => import('@/components/common/dialogs/AlertDialog.vue'));

  const $store = usePlanningStore();
  const $authStore = useAuthStore();
  const { loading, poll, answers } = storeToRefs($store);
  const { supabaseUser } = storeToRefs($authStore);
  const isRemovePollModalOpen = ref(false);
  const isLoading = ref(false);

  const calcVotes = (a: Answer): number => {
    let votes = 0;

    if (!poll.value?.user_answers) return votes;

    poll.value.user_answers.forEach(answer => {
      if (answer!.answer_id === a.id) {
        votes += 1;
      }
    });

    return votes;
  };

  const canAccessSettings = computed(() => poll.value?.user_id === supabaseUser.value?.data.user?.id);

  const options = computed(() => {
    if (!poll.value) return { question: '', answers: [] };

    return {
      question: poll.value.question?.title || '',
      answers: answers.value?.map(a => ({
        value: a?.id as number,
        text: a?.content || '',
        votes: calcVotes(a as Answer),
      })) || [],
    };
  });

  const shouldShowResults = computed(() => {
    const userAnswer = { poll_id: poll.value?.id, user_id: supabaseUser.value?.data.user?.id };
    return poll.value?.user_answers?.some(a => a?.poll_id === userAnswer.poll_id && a?.user_id === userAnswer.user_id);
  });

  const addVote = async (obj: any): Promise<void> => {
    await $store.createUserAnswer({
      poll_id: poll.value?.id,
      user_id: supabaseUser.value?.data.user?.id as string,
      answer_id: obj.value,
    });
  };

  const addAnswer = async (content: string): Promise<void> => {
    await $store.createAnswer({
      question_id: poll.value?.question?.id as number,
      content,
    });
  };

  const handleRemovePoll = async (): Promise<void> => {
    isLoading.value = true;
    await $store.removePoll(poll.value?.id as number);
    isLoading.value = false;
    isRemovePollModalOpen.value = false;
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/aside";
</style>
