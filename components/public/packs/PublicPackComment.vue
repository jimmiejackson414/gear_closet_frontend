<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Database } from '@/types';
  import type { ExtendedComment, ExtendedReply } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    comment: ExtendedComment;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['handle-add-reply']);
  const user = useSupabaseUser();
  const $appStore = useAppStore();

  const formattedTime = (time: string | null) => {
    if (!time) return '';
    return dayjs()
      .to(time);
  };

  const replyingTo = ref(false);
  const quillEditorRef = ref<any | null>(null);
  const submitting = ref(false);
  /**
   * Add a reply to a comment
   */
  const addReply = async () => {
    const text = quillEditorRef.value?.getText()
      .trim();
    if (!text) return;

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();

      // insert reply
      const { data, error } = await supabase.from('replies')
        .insert({
          text,
          comment_id: props.comment.id,
          profile_id: user.value?.id as string,
        })
        .select();

      if (error || !data) throw error;

      // retrieve extended reply data
      const { data: reply, error: replyError } = await supabase
        .from('replies')
        .select(`
          *,
          profile:profiles (first_name, last_name, trail_name, image)
        `)
        .eq('id', data[0].id)
        .maybeSingle();

      if (replyError || !reply) throw replyError;
      emits('handle-add-reply', reply as ExtendedReply);
      quillEditorRef.value?.setText('');
      replyingTo.value = false;
      $appStore.notifyPositive('Reply added successfully');
    } catch (error) {
      $appStore.notifyNegative('Failed to add reply');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Soft delete a comment
   */
  // TODO: Implement deleteComment
  const isDeletingCommentId = ref<number | null>(null);
  const deleteComment = async () => {
    console.log(`deleteComment`);
  };

  /**
   * Soft delete a reply
   */
  const isDeletingReplyId = ref<number | null>(null);
  const deleteReply = async (reply: ExtendedReply) => {
    try {
      isDeletingReplyId.value = reply.id;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase
        .from('replies')
        .update({ deleted_at: new Date()
          .toISOString() })
        .eq('id', reply.id);

      if (error) throw error;
      $appStore.notifyPositive('Reply deleted successfully');
    } catch (error) {
      $appStore.notifyNegative('Failed to delete reply');
    } finally {
      isDeletingReplyId.value = null;
    }
  };
</script>

<template>
  <div class="max-w-3xl mt-4">
    <ul
      class="list"
      depth="0"
      style="--depth: 0;">
      <li style="--nested: true">
        <div
          class="comment flex gap-2 relative"
          :class="{ 'pb-4': !replyingTo }">
          <gc-avatar
            class="user"
            :initials="initials(comment.profile)"
            size="md"
            :url="buildImageSrc(comment.profile.image)" />
          <div>
            <!-- body -->
            <div
              class="comment__body p-4 rounded-xl w-fit"
              :class="comment.profile_id === user?.id ? 'bg-primary-light/40' : 'bg-gray-200'">
              <div class="flex justify-start items-center gap-4">
                <p
                  class="font-bold text-sm"
                  :class="comment.deleted_at ? 'text-gray-400' : 'text-gray-900'">
                  {{ friendlyUsername(comment.profile) }}
                </p>
                <p
                  class="text-sm"
                  :class="comment.deleted_at ? 'text-gray-400' : 'text-gray-500'">
                  {{ formattedTime(comment.created_at) }}
                </p>
              </div>
              <p
                v-if="comment.deleted_at"
                class="italic text-gray-400">
                This comment has been deleted
              </p>
              <p
                v-else
                class="mt-2">
                {{ comment.text }}
              </p>
            </div>
            <!-- actions -->
            <div
              v-if="!!user"
              class="comment__actions flex gap-2 pl-4 py-1">
              <button
                class="duration-150 ease-snap font-bold text-dark-grey hover:text-dark-grey/75 text-sm transition-colors"
                @click="[replyingTo = true]">
                Reply
              </button>
              <button
                v-if="user.id === comment.profile_id && !comment.deleted_at"
                class="duration-150 ease-snap font-bold text-danger hover:text-danger/75 text-sm transition-colors"
                @click="deleteComment">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="replyingTo"
          class="flex items-end flex-col ps-14">
          <p class="my-2 text-gray-500 text-sm">
            Commenting as <span class="font-bold">{{ friendlyUsername(comment.profile) }}</span>
          </p>
          <client-only>
            <quill-editor
              ref="quillEditorRef"
              class="custom-editor"
              :enable="!submitting"
              :options="{ modules: { toolbar: false } }"
              placeholder="Add a reply"
              theme="snow" />
          </client-only>
          <button-root
            class="mt-2"
            :disabled="submitting"
            :loading="submitting"
            size="sm"
            @click="addReply">
            Submit
          </button-root>
        </div>
        <ul
          v-if="comment.replies.length"
          class="list"
          depth="1"
          style="--depth: 1;">
          <li
            v-for="reply in comment.replies"
            :key="reply.id">
            <div class="comment flex gap-2 pb-4 relative">
              <gc-avatar
                class="user"
                :initials="initials(reply.profile)"
                size="md"
                :url="buildImageSrc(reply.profile.image)" />
              <div>
                <!-- body -->
                <div
                  class="comment__body p-4 rounded-xl w-fit"
                  :class="reply.profile_id === user?.id ? 'bg-primary-light/40' : 'bg-gray-200'">
                  <div class="flex justify-start items-center gap-4">
                    <p
                      class="font-bold text-sm"
                      :class="reply.deleted_at ? 'text-gray-400' : 'text-gray-900'">
                      {{ friendlyUsername(reply.profile) }}
                    </p>
                    <p
                      class="text-sm"
                      :class="reply.deleted_at ? 'text-gray-400' : 'text-gray-500'">
                      {{ formattedTime(reply.created_at) }}
                    </p>
                  </div>
                  <p
                    v-if="reply.deleted_at"
                    class="italic text-gray-400">
                    This reply has been deleted
                  </p>
                  <p v-else>
                    {{ reply.text }}
                  </p>
                </div>
                <!-- actions -->
                <div
                  v-if="!!user && !reply.deleted_at"
                  class="comment__actions flex gap-2 pl-4 py-1">
                  <button
                    v-if="user.id === reply.profile_id"
                    class="duration-150 ease-snap font-bold text-danger hover:text-danger/75 text-sm transition-colors"
                    @click="() => deleteReply(reply)">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style>
  .comment {
    --size: 3.5rem;
    /* @apply pb-4; */
  }

  @container style(--depth: 0) {
    li:has(ul) > .comment {
      @apply relative before:content-[''] before:absolute before:start-[24px] before:bottom-0 before:w-0.5 before:bg-gray-300;

      &:before {
        top: calc(var(--size) + 8px);
      }
    }
  }

  @container style(--depth: 1) {
    li:has(ul) > .comment {
      @apply relative before:content-[''] before:absolute before:start-[12px] before:bottom-0 before:w-0.5 before:bg-gray-300;

      &:before {
        top: calc(var(--size) + 8px);
      }
    }
  }

  @container style(--depth: 1) {
    li:not(:last-child) {
      @apply relative before:content-[''] before:absolute before:start-[24px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300;
    }

    li {
      @apply relative before:content-[''] after:absolute after:start-[24px] after:top-[0px] after:h-[28px] after:w-[22px] after:bg-gray-300 after:bg-transparent after:border-l-2 after:border-b-2 after:border-gray-300;

      &:after {
        border-end-start-radius: 10px;
      }
    }
  }

  @container style(--nested: true) {
    .comment {
      @apply relative pt-1;
    }

    li {
      @apply ps-14;
    }
  }
</style>