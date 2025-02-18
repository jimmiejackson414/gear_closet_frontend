<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { ExtendedNotification } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    notification: ExtendedNotification;
  }

  const props = withDefaults(defineProps<Props>(), {
    notification: undefined,
  });

  const emit = defineEmits(['markAsRead']);

  const relativeDate = computed(() => dayjs()
    .to(props.notification.created_at as string));

  const computedImageSrc = computed(() => {
    if (props.notification?.sender?.image) {
      return { backgroundImage: `url(${props.notification.sender.image})` };
    }
    return { backgroundImage: `url('/gear-closet-icon.svg')` };
  });
</script>

<template>
  <li
    class="flex cursor-pointer px-4 py-3 hover:bg-gray-100"
    :class="{ 'bg-primary-light/40': !notification?.read_on_date }"
    @mouseover="emit('markAsRead', notification)">
    <div class="shrink-0">
      <div
        class="size-11 rounded-full bg-cover bg-center bg-no-repeat"
        :style="computedImageSrc" />
      <div class="absolute -mt-5 ms-6 flex size-5 items-center justify-center rounded-full border border-white bg-primary">
        <svg
          aria-hidden="true"
          class="size-2 text-white"
          fill="currentColor"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
          <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
        </svg>
      </div>
    </div>
    <div class="w-full ps-3">
      <typography
        class="mb-1.5"
        variant="small">
        New message from <span class="font-semibold text-gray-900">{{ friendlyUsername(notification?.sender) }}</span>: "{{ notification?.content }}"
      </typography>
      <div class="text-xs font-bold text-primary">
        {{ relativeDate }}
      </div>
    </div>
  </li>
</template>
