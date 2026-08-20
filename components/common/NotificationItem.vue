<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { notificationRoute } from '@/utils/notifications';
  import type { ExtendedNotification } from '@/types/profile';

  dayjs.extend(relativeTime);

  interface Props {
    notification: ExtendedNotification;
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['markAsRead']);

  const router = useRouter();

  const relativeDate = computed(() => dayjs()
    .to(props.notification.created_at as string));

  const computedImageSrc = computed(() => {
    if (props.notification?.sender?.image) {
      return { backgroundImage: `url(${props.notification.sender.image})` };
    }
    return { backgroundImage: `url('/gear-closet-icon.svg')` };
  });

  const openNotification = () => {
    emit('markAsRead', props.notification);
    const route = notificationRoute(props.notification.title);
    if (route) {
      void router.push(route);
    }
  };
</script>

<template>
  <li
    class="flex hover:bg-gray-100 px-4 py-3 cursor-pointer"
    :class="{ 'bg-primary-light/40': !notification?.read_on_date }"
    @click="openNotification"
    @mouseover="emit('markAsRead', notification)">
    <div class="shrink-0">
      <div
        class="bg-cover bg-no-repeat bg-center rounded-full w-11 h-11"
        :style="computedImageSrc" />
      <div class="absolute flex justify-center items-center bg-primary ms-6 -mt-5 border border-white rounded-full w-5 h-5">
        <svg
          aria-hidden="true"
          class="w-2 h-2 text-white"
          fill="currentColor"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
          <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
        </svg>
      </div>
    </div>
    <div class="ps-3 w-full">
      <div class="mb-1.5 text-muted-foreground text-sm">
        New message from <span class="font-semibold text-gray-900">{{ friendlyUsername(notification?.sender) }}</span>: "{{ notification?.content }}"
      </div>
      <div class="font-bold text-primary text-xs">
        {{ relativeDate }}
      </div>
    </div>
  </li>
</template>
