<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Database } from '@/types';
  import type { ExtendedComment, ExtendedReply, PublicPack } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    comment: ExtendedComment;
  }

  const props = defineProps<Props>();
  // const emits = defineEmits(['handle-add-reply']);
  const user = useSupabaseUser();
  const $appStore = useAppStore();
  const $store = useClosetStore();

  const formattedTime = (time: string | null) => {
    if (!time) return '';
    return dayjs()
      .to(time);
  };

  const replyingTo = ref(false);
  const newReplyValue = ref<string | undefined>(undefined);
  const submitting = ref(false);
  /**
   * Add a reply to a comment
   */
  const addReply = async () => {
    const text = newReplyValue.value?.trim();
    if (!text) return;

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();

      // insert and return reply
      const { data, error } = await supabase.from('replies')
        .insert({
          text,
          comment_id: props.comment.id,
          profile_id: user.value?.sub as string,
        })
        .select(`
          *,
          profile:profiles (first_name, last_name, trail_name, image) 
        `);

      if (error || !data) throw error;


      const newReply = data[0]; // Get the newly created reply

      // Find the comment and update its replies
      const commentIndex = ($store.data.selectedPack as PublicPack)?.comments.findIndex((c) => c.id === props.comment.id);
      if (commentIndex !== -1) {
        const targetComment = ($store.data.selectedPack as PublicPack).comments[commentIndex];
        if (!targetComment.replies) {
          targetComment.replies = []; // Ensure replies array exists
        }
        targetComment.replies.push(newReply as ExtendedReply);
      }

      newReplyValue.value = undefined;
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
  const isDeletingCommentId = ref<number | null>(null);
  const deleteComment = async (comment: ExtendedComment) => {
    try {
      isDeletingCommentId.value = comment.id;
      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from('comments')
        .update({ deleted_at: new Date()
          .toISOString()})
        .eq('id', comment.id)
        .select(`
          *,
          profile:profiles (*),
          replies(*,
            profile:profiles (*)
          )
        `);

      if (error) throw error;

      if (data?.length) {
        const updatedComment = data[0] as ExtendedComment;
        const commentIndex = ($store.data.selectedPack as PublicPack)?.comments.findIndex((c) => c.id === comment.id);
        if (commentIndex !== -1) {
          ($store.data.selectedPack as PublicPack).comments[commentIndex] = updatedComment;
        }
      }

      $appStore.notifyPositive('Comment deleted successfully');
    } catch (error) {
      $appStore.notifyNegative('Failed to delete comment');
    } finally {
      isDeletingCommentId.value = null;
    }
  };

  /**
   * Soft delete a reply
   */
  const isDeletingReplyId = ref<number | null>(null);
  const deleteReply = async (reply: ExtendedReply) => {
    try {
      isDeletingReplyId.value = reply.id;
      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from('replies')
        .update({ deleted_at: new Date()
          .toISOString() })
        .eq('id', reply.id)
        .select(`
          *,
          profile:profiles (*)
        `);

      if (error) throw error;

      if (data?.length) {
        const updatedReply = data[0] as ExtendedReply;
        const selectedPack = $store.data.selectedPack as PublicPack;
        if (selectedPack) {
          for (const comment of selectedPack.comments) {
            const replyIndex = comment.replies.findIndex((r) => r.id === reply.id);
            if (replyIndex !== -1) {
              comment.replies[replyIndex] = updatedReply;
              break;
            }
          }
        }
      }

      $appStore.notifyPositive('Reply deleted successfully');
    } catch (error) {
      $appStore.notifyNegative('Failed to delete reply');
    } finally {
      isDeletingReplyId.value = null;
    }
  };
</script>

<template>
  <div class="mt-4 w-full">
    <ul
      class="list"
      depth="0"
      style="--depth: 0;">
      <li style="--nested: true">
        <div
          class="relative flex gap-2 comment"
          :class="{ 'pb-4': !replyingTo }">
          <gc-avatar
            class="mt-2 user"
            :initials="initials(comment.profile)"
            size="md"
            :url="buildImageSrc(comment.profile.image)" />
          <div>
            <!-- body -->
            <div
              class="p-4 rounded-xl w-fit comment__body"
              :class="comment.profile_id === user?.sub ? 'bg-primary-light/40' : 'bg-gray-200'">
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
                class="text-gray-400 italic">
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
              class="flex gap-2 py-1 pl-4 comment__actions">
              <button
                class="font-semibold text-muted-foreground hover:text-muted-foreground/75 text-sm transition-colors duration-150 ease-out"
                @click="[replyingTo = true]">
                Reply
              </button>
              <button
                v-if="user?.sub === comment.profile_id && !comment.deleted_at"
                class="font-semibold text-destructive hover:text-destructive/75 text-sm transition-colors duration-150 ease-out"
                @click="() => deleteComment(comment)">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="replyingTo"
          class="flex flex-col items-start mt-4 ps-17 pb-6 max-w-xl">
          <textarea-root
            v-model="newReplyValue"
            class="disabled:bg-gray-100 shadow-xs rounded-xl w-full disabled:pointer-events-none"
            :disabled="submitting"
            placeholder="Add a reply" />
          <div class="items-center gap-6 grid grid-cols-[1fr_auto_auto] my-2 w-full">
            <button-root
              class="justify-self-start text-muted-foreground"
              :disabled="submitting"
              size="sm"
              variant="ghost"
              @click="[replyingTo = false, newReplyValue = undefined]">
              Cancel
            </button-root>
            <p class="text-muted-foreground text-sm">
              Commenting as <span class="font-bold">{{ friendlyUsername(comment.profile) }}</span>
            </p>
            <button-root
              :disabled="submitting"
              :loading="submitting"
              size="sm"
              @click="addReply">
              Submit
            </button-root>
          </div>
        </div>
        <ul
          v-if="comment.replies.length"
          class="list"
          depth="1"
          style="--depth: 1;">
          <li
            v-for="reply in comment.replies"
            :key="reply.id">
            <div class="relative flex gap-2 pb-4 comment">
              <gc-avatar
                class="mt-2 user"
                :initials="initials(reply.profile)"
                size="md"
                :url="buildImageSrc(reply.profile.image)" />
              <div>
                <!-- body -->
                <div
                  class="p-4 rounded-xl w-fit comment__body"
                  :class="reply.profile_id === user?.sub ? 'bg-primary-light/40' : 'bg-gray-200'">
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
                    class="text-gray-400 italic">
                    This reply has been deleted
                  </p>
                  <p v-else>
                    {{ reply.text }}
                  </p>
                </div>
                <!-- actions -->
                <div
                  v-if="!!user && !reply.deleted_at"
                  class="flex gap-2 py-1 pl-4 comment__actions">
                  <button
                    v-if="user?.sub === reply.profile_id"
                    class="font-bold text-destructive hover:text-destructive/75 text-sm transition-colors duration-150 ease-out"
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
  }

  @container style(--depth: 0) {
    li:has(ul) > .comment {
      @apply before:bottom-0 before:absolute relative before:inset-s-6 before:bg-gray-300 before:w-0.5 before:content-[''];

      &:before {
        top: calc(var(--size) + 8px);
      }
    }
  }

  @container style(--depth: 1) {
    li:has(ul) > .comment {
      @apply before:bottom-0 before:absolute relative before:inset-s-3 before:bg-gray-300 before:w-0.5 before:content-[''];

      &:before {
        top: calc(var(--size) + 8px);
      }
    }
  }

  @container style(--depth: 1) {
    li:not(:last-child) {
      @apply before:top-0 before:bottom-0 before:absolute relative before:inset-s-6 before:bg-gray-300 before:w-0.5 before:content-[''];
    }

    li {
      @apply after:top-0 after:absolute relative after:inset-s-6 after:bg-transparent after:border-gray-300 after:border-b-2 after:border-l-2 after:w-5.5 after:h-7 before:content-[''];

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