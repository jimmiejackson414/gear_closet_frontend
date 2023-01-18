<template>
  <details
    open
    class="comment">
    <span class="comment-border-link" />
    <summary>
      <div class="comment-heading">
        <div class="comment-voting">
          <q-avatar size="2rem">
            <template #default>
              <img
                :src="buildImageSrc(reply?.user?.image)"
                alt="comment avatar">
              {{ initials(reply?.user) }}
            </template>
          </q-avatar>
        </div>
        <div class="comment-info">
          <p class="text-body2 q-mb-none q-ml-md">
            <span class="text-weight-bold">{{ friendlyUsername(reply?.user) }}</span>
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
        class="text-body2 q-mb-none"
        v-html="reply?.text" />
      <div class="actions">
        <q-btn
          v-if="canModify && !isEditing"
          flat
          dense
          color="secondary"
          size="sm"
          @click="isEditing = true">
          Edit
        </q-btn>
        <q-btn
          v-if="canModify && !isEditing"
          flat
          dense
          color="negative"
          size="sm"
          class="q-ml-sm"
          @click="handleAlert">
          Delete
        </q-btn>
      </div>
      <Editor
        v-if="isEditing"
        :value="reply.text"
        :is-submitting="isSubmitting"
        @handle-close="isEditing = false"
        @handle-submit="handleUpdateReply" />
    </div>
  </details>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { useUserStore } from '@/stores/user';
  import { useAppStore } from '@/stores/app';
  import { usePublicStore } from '@/stores/public';
  import { buildImageSrc, initials, friendlyUsername } from '@/helpers/functions';
  import { Reply } from '@/generated/types';
  import Editor from './Editor.vue';

  dayjs.extend(relativeTime);

  interface Props {
    reply: Reply
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { reply } = defineProps<Props>();

  const $store = useUserStore();
  const $appStore = useAppStore();
  const $publicStore = usePublicStore();
  const { currentUser } = storeToRefs($store);
  const { alertDialog } = storeToRefs($publicStore);
  const isEditing = ref(false);
  const isSubmitting = ref(false);

  const timeAgo = computed(() => dayjs(reply?.updated_at)
    .fromNow());

  const canModify = computed(() => currentUser.value?.id === reply.user_id);

  const handleUpdateReply = async (value: string): Promise<void> => {
    isSubmitting.value = true;
    await $publicStore.updateReply(reply.id, { text: value });
    isSubmitting.value = false;
    isEditing.value = false;
  };

  const handleDelete = async (): Promise<void> => {
    alertDialog.value.isSubmitting = true;

    const response = await $publicStore.deleteReply(reply);

    if (response.success && !response.errors) {
      $appStore.notifyPositive('Reply successfully deleted');
    } else {
      $appStore.notifyNegative('Unable to delete reply. Please try again.');
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
      copy1: 'Are you sure you want to delete this comment?',
      copy2: 'This action cannot be undone.',
      continueCallback: handleDelete,
    });
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
