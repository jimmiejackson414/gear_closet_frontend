<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { CheckCircleIcon } from 'lucide-vue-next';
  import type { Notification } from '@/generated/types';

  dayjs.extend(relativeTime);

  interface Props {
    notification: Notification;
  }

  const props = withDefaults(defineProps<Props>(), {
    notification: undefined,
  });

  const emit = defineEmits(['markAsRead']);

  const relativeDate = ((notification: Notification) => dayjs()
    .to(notification.created_at as string));
</script>

<template>
  <li class="font-medium grid grid-cols-[auto,1fr,auto,auto] gap-x-2 group items-start px-0 py-3 text-dark-grey text-sm">
    <span class="w-[1rem]">
      <span
        class="font-medium h-[8px] inline-flex items-center rounded-full text-xs w-[8px]"
        :class="props.notification.read_on_date ? 'bg-transparent' : 'bg-danger'" />
    </span>
    <span class="flex flex-col">
      <p class="font-bold mb-1 text-sm">
        {{ props.notification.title }}
      </p>
      <p class="font-medium text-sm">
        {{ props.notification.content }}
      </p>
    </span>
    <span class="text-grey text-xs uppercase">
      {{ relativeDate(props.notification) }}
    </span>
    <button
      v-show="!props.notification.read_on_date"
      class="ml-2"
      type="button"
      @click="emit('markAsRead', notification)">
      <check-circle-icon class="duration-200 group-hover:opacity-100 h-5 opacity-0 text-dark-grey hover:text-positive transition-all w-5" />
    </button>
  </li>
</template>
