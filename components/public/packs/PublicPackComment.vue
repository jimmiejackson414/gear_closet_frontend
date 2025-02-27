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
          comment_id: props.comment.id,
          profile_id: user.value?.id as string,
          text,
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
      depth="0"
      style="--depth: 0;">
      <li style="--nested: true">
        <div
          class="comment relative flex gap-2"
          :class="{ 'pb-4': !replyingTo }">
          <gc-avatar
            class="mt-2"
            :initials="initials(comment.profile)"
            size="md"
            :url="buildImageSrc(comment.profile.image)" />
          <div>
            <!-- body -->
            <div
              class="comment__body w-fit rounded-xl p-4"
              :class="comment.profile_id === user?.id ? 'bg-primary-light/40' : 'bg-gray-200'">
              <div class="flex items-center justify-start gap-4">
                <typography
                  class="!font-bold"
                  :class="comment.deleted_at ? 'text-gray-400' : 'text-gray-900'"
                  variant="small">
                  {{ friendlyUsername(comment.profile) }}
                </typography>
                <typography
                  :class="comment.deleted_at ? 'text-gray-400' : 'text-gray-500'"
                  variant="muted">
                  {{ formattedTime(comment.created_at) }}
                </typography>
              </div>
              <typography
                v-if="comment.deleted_at"
                class="italic text-gray-400">
                This comment has been deleted
              </typography>
              <typography v-else>
                {{ comment.text }}
              </typography>
            </div>
            <!-- actions -->
            <div
              v-if="!!user"
              class="comment__actions flex gap-2 py-1">
              <button-root
                size="sm"
                variant="ghost"
                @click="[replyingTo = true]">
                Reply
              </button-root>
              <button-root
                v-if="user.id === comment.profile_id && !comment.deleted_at"
                class="text-destructive hover:text-destructive/75"
                size="sm"
                variant="ghost"
                @click="() => deleteComment(comment)">
                Delete
              </button-root>
            </div>
          </div>
        </div>
        <div
          v-if="replyingTo"
          class="mt-4 flex max-w-xl flex-col items-start pb-6 ps-[4.25rem]">
          <textarea-root
            v-model="newReplyValue"
            class="w-full rounded-xl shadow-sm disabled:pointer-events-none disabled:bg-gray-100"
            :disabled="submitting"
            placeholder="Add a reply" />
          <div class="my-2 grid w-full grid-cols-[1fr_auto_auto] items-center gap-6">
            <button-root
              class="justify-self-start text-muted-foreground"
              :disabled="submitting"
              size="sm"
              variant="ghost"
              @click="[replyingTo = false, newReplyValue = undefined]">
              Cancel
            </button-root>
            <typography variant="muted">
              Commenting as <span class="font-bold">{{ friendlyUsername(comment.profile) }}</span>
            </typography>
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
          depth="1"
          style="--depth: 1;">
          <li
            v-for="reply in comment.replies"
            :key="reply.id">
            <div class="comment relative flex gap-2 pb-4">
              <gc-avatar
                class="mt-2"
                :initials="initials(reply.profile)"
                size="md"
                :url="buildImageSrc(reply.profile.image)" />
              <div>
                <!-- body -->
                <div
                  class="comment__body w-fit rounded-xl p-4"
                  :class="reply.profile_id === user?.id ? 'bg-primary-light/40' : 'bg-gray-200'">
                  <div class="flex items-center justify-start gap-4">
                    <typography
                      class="!font-bold"
                      :class="reply.deleted_at ? 'text-gray-400' : 'text-gray-900'"
                      variant="small">
                      {{ friendlyUsername(reply.profile) }}
                    </typography>
                    <typography
                      :class="reply.deleted_at ? 'text-gray-400' : 'text-gray-500'"
                      variant="muted">
                      {{ formattedTime(reply.created_at) }}
                    </typography>
                  </div>
                  <typography
                    v-if="reply.deleted_at"
                    class="italic text-gray-400">
                    This reply has been deleted
                  </typography>
                  <typography v-else>
                    {{ reply.text }}
                  </typography>
                </div>
                <!-- actions -->
                <div
                  v-if="!!user && !reply.deleted_at"
                  class="comment__actions flex gap-2 py-1">
                  <button-root
                    v-if="user.id === reply.profile_id"
                    class="text-destructive hover:text-destructive/75"
                    size="sm"
                    variant="ghost"
                    @click="() => deleteReply(reply)">
                    Delete
                  </button-root>
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