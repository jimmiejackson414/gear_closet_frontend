<template>
  <details
    open
    class="comment">
    <span class="comment-border-link" />
    <summary>
      <div class="comment-heading">
        <div class="comment-voting">
          <AvatarDefault
            :user="(comment.user as User)"
            size="2rem" />
        </div>
        <div class="comment-info">
          <p class="text-body2 q-mb-none q-ml-md">
            <span class="text-weight-bold">{{ friendlyUsername(comment.user) }}</span>
            &middot;
            <span class="time-ago">
              {{ timeAgo }}
            </span>
          </p>
        </div>
      </div>
    </summary>
    <div class="comment-body">
      <p
        v-if="!isEditingComment"
        class="text-body2 q-mb-none"
        v-html="comment.text" />
      <div class="actions">
        <q-btn
          v-if="!isEditingComment && currentUser"
          flat
          dense
          color="primary"
          size="sm"
          @click="isReplying = true">
          Reply
        </q-btn>
        <q-btn
          v-if="canModify && !isEditingComment"
          flat
          dense
          color="secondary"
          size="sm"
          class="q-ml-sm"
          @click="isEditingComment = true">
          Edit
        </q-btn>
        <q-btn
          v-if="canModify && !isEditingComment"
          flat
          dense
          color="negative"
          size="sm"
          class="q-ml-sm"
          @click="handleAlert">
          Delete
        </q-btn>
      </div>
      <!-- Comment Editor -->
      <Editor
        v-if="isEditingComment"
        :value="comment.text"
        :is-submitting="isSubmitting"
        @handle-close="isEditingComment = false"
        @handle-submit="handleUpdateComment" />
    </div>
    <div class="replies">
      <ReplyComponent
        v-for="reply in comment.replies"
        :key="reply!.id"
        :reply="(reply as Reply)" />
      <div
        v-if="isReplying"
        class="new-reply-wrapper q-mt-lg">
        <!-- Create Reply Editor -->
        <Editor
          v-if="isReplying"
          :value="editor"
          :is-submitting="isSubmitting"
          @handle-close="isReplying = false"
          @handle-submit="handleSubmit" />
      </div>
    </div>
  </details>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { useAppStore } from '@/stores/app';
  import { usePublicStore } from '@/stores/public';
  import { useUserStore } from '@/stores/user';
  import { friendlyUsername } from '@/helpers/functions';
  import { Comment, Reply, User } from '@/generated/types';
  import ReplyComponent from './Reply.vue';
  import Editor from './Editor.vue';

  dayjs.extend(relativeTime);

  interface Props {
    comment: Comment
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { comment } = defineProps<Props>();

  const editor = ref('');
  const isEditingComment = ref(false);
  const isReplying = ref(false);
  const isSubmitting = ref(false);
  const $store = useUserStore();
  const $appStore = useAppStore();
  const $publicStore = usePublicStore();
  const { currentUser } = storeToRefs($store);
  const { alertDialog } = storeToRefs($publicStore);

  const timeAgo = computed(() => dayjs(comment.updated_at)
    .fromNow());

  const canModify = computed(() => currentUser.value?.id === comment.user_id);

  const handleUpdateComment = async (value: string): Promise<void> => {
    isSubmitting.value = true;
    await $publicStore.updateComment(comment.id, { text: value });
    isSubmitting.value = false;
    isEditingComment.value = false;
  };

  const handleDelete = async (): Promise<void> => {
    alertDialog.value.isSubmitting = true;

    const response = await $publicStore.deleteComment(comment.id);

    if (response.success && !response.errors) {
      $appStore.notifyPositive('Comment successfully deleted');
    } else {
      $appStore.notifyNegative('Unable to delete comment. Please try again.');
    }
  };

  const handleAlert = (): void => {
    $publicStore.setAlertDialog({
      open: true,
      isSubmitting: false,
      title: 'Delete Comment',
      alertColor: 'negative',
      btnText: 'Delete',
      btnColor: 'negative',
      hasCancel: true,
      copy1: 'Are you sure you want to delete this comment?',
      copy2: 'This action cannot be undone.',
      continueCallback: handleDelete,
    });
  };

  const handleSubmit = async (value: string): Promise<void> => {
    isSubmitting.value = true;

    const input = { text: value, comment_id: comment.id };
    await $publicStore.createReply(input);

    isSubmitting.value = false;
    isEditingComment.value = false;
    isReplying.value = false;
    editor.value = '';
  };
</script>

<style lang='scss' scoped>
  .comment {
    position: relative;
    margin: 20px auto;

    .comment-border-link {
      display: block;
      position: absolute;
      top: 55px;
      left: 0.75rem;
      width: 2px;
      height: calc(100% - 50px);
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      background-color: $grey-12;
      background-clip: padding-box;
      transition: 0.2s background-color $cubic-bezier;

      &:hover {
        background-color: $grey-13;
      }
    }

    .comment-heading {
      display: flex;
      align-items: center;
      height: 50px;
      font-size: 14px;

      &::after {
        display: inline-block;
        position: absolute;
        right: 5px;
        align-self: center;
        font-size: 12px;
        color: $grey-12;
      }
    }

    .replies {
      margin-left: 40px;
    }

    .comment-body {
      padding: 0 48px;
    }

    summary {
      position: relative;
      list-style: none;
      cursor: pointer;

      &::-webkit-details-marker {
        display: none;
      }
    }
  }
</style>
