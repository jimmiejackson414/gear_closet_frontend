<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { ExtendedComment } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    comment: ExtendedComment;
  }

  defineProps<Props>();

  const user = useSupabaseUser();

  const formattedTime = (time: string | null) => {
    if (!time) return '';
    return dayjs()
      .to(time);
  };
</script>

<template>
  <div class="relative">
    <!-- Parent comment -->
    <div class="flex items-start gap-6 mt-4">
      <!-- Line -->
      <div
        v-if="comment.replies.length"
        class="absolute top-12 -bottom-12 left-8 bg-gray-300 w-0.5"
        :style="{ height: `calc(100% - 4rem)` }" />
      <gc-avatar
        class="ml-4"
        :profile="comment.profile"
        size="sm" />
      <div class="flex flex-col gap-1 max-w-md w-fit">
        <div class="flex items-center space-x-2">
          <span class="font-semibold text-gray-900 text-sm">
            {{ friendlyUsername(comment.profile) }}
          </span>
          <span class="font-normal text-gray-500 text-sm">
            {{ formattedTime(comment.created_at) }}
          </span>
        </div>
        <div
          class="flex flex-col leading-1.5 p-4 rounded-e-xl rounded-es-xl"
          :class="comment.profile_id === user?.id ? 'bg-primary-light/40 border-primary-light/40' : 'bg-gray-200 border-gray-200'">
          <p class="font-normal text-gray-900 text-sm">
            {{ comment.text }}
          </p>
        </div>
      </div>
    </div>

    <!-- Line and replies -->
    <div class="ml-16 relative">
      <!-- Replies -->
      <div v-if="comment.replies.length">
        <div
          v-for="reply in comment.replies" 
          :key="reply.id"
          class="flex before:content-[''] items-start gap-6 mt-8 relative before:top-auto before:bottom-0 before:left-[-2rem] before:absolute before:border-b-[2px] before:border-gray-300 before:border-l-[2px] before:h-[1rem] before:rounded-bl-lg before:w-[2rem]">
          <gc-avatar
            class="ml-4"
            :profile="reply.profile"
            size="sm" />
          <div class="flex flex-col gap-1 max-w-md w-fit">
            <div class="flex items-center space-x-2">
              <span class="font-semibold text-gray-900 text-sm">
                {{ friendlyUsername(reply.profile) }}
              </span>
              <span class="font-normal text-gray-500 text-sm">
                {{ formattedTime(reply.created_at) }}
              </span>
            </div>
            <div
              class="flex flex-col leading-1.5 p-4 rounded-e-xl rounded-es-xl"
              :class="reply.profile_id === user?.id ? 'bg-primary-light/40 border-primary-light/40' : 'bg-gray-200 border-gray-200'">
              <p class="font-normal text-gray-900 text-sm">
                {{ reply.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
