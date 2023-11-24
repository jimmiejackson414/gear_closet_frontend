<script lang='ts' setup>
  import { BellRingIcon } from 'lucide-vue-next';
  import { useUserStore } from '@/stores/user';
  import NotificationItem from '@/components/common/NotificationItem.vue';
  import type { Notification, UpdateNotification } from '@/generated/types';

  interface Props {
    pageTitle: string;
  }
  
  withDefaults(defineProps<Props>(), {
    pageTitle: '',
  });

  // instantiate store and libs
  const $userStore = useUserStore();

  const { notifications, currentUser } = storeToRefs($userStore);

  const shouldShowBadge = computed(() => $userStore.totalUnread > 0 && notifications.value.items.some(n => !n.read_on_date));

  const welcomeMessage = computed(() => {
    if (currentUser.value?.first_name) {
      const arr = ['Hello', 'Welcome', 'Hey'];
      const rand = Math.floor(Math.random() * arr.length);
      return `${arr[rand]}, ${currentUser.value.first_name}!`;
    }
    return 'Welcome!';
  });

  const markAllAsRead = () => { $userStore.markAllAsRead(); };

  const markAsRead = (notification: Notification) => {
    const payload: UpdateNotification = { id: notification.id };
    $userStore.updateNotification(payload);
  };

  const markAsUnread = (notification: Notification) => {
    const payload = { id: notification.id, read_on_date: null };
    $userStore.updateNotification(payload);
  };
</script>

<template>
  <nav class="container flex items-start p-0 z-50">
    <div class="page-title">
      <p class="text-base-lg">
        <span class="mr-2">&#128075;</span>
        {{ welcomeMessage }}
      </p>
      <h1 class="mt-4 text-3xl">
        {{ pageTitle }}
      </h1>
    </div>
    <div class="grow" />
    <div class="hs-dropdown inline-flex relative">
      <button
        id="hs-dropdown-default"
        type="button"
        class="bg-white duration-200 hs-dropdown-toggle p-3 relative rounded-full shadow-light hover:shadow-default transition-all">
        <bell-ring-icon class="h-6 w-6" />
        <span
          v-if="shouldShowBadge"
          class="-translate-y-1/2 absolute top-2 bg-danger end-1 font-medium inline-flex items-center px-1.5 py-0.5 rounded-full text-white text-xs transform translate-x-1/2">
          {{ $userStore.totalUnread }}
        </span>
      </button>
      <div
        class="bg-white duration hidden hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[20rem] mt-2 opacity-0 p-2 rounded-lg shadow-default transition-[opacity,margin] z-50 after:-bottom-4 after:absolute after:h-4 after:start-0 after:w-full before:-top-4 before:absolute before:h-4 before:start-0 before:w-full"
        aria-labelledby="hs-dropdown-default">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-base">
            Notifications
          </h3>
          <button
            type="button"
            class="font-medium text-primary text-sm"
            @click="markAllAsRead">
            Mark all as read
          </button>
        </div>
        <div class="divide-gray-200 divide-y">
          <span
            v-if="notifications?.items.length"
            class="notifications-wrapper">
            <notification-item
              v-for="notification in notifications.items.slice(0, 5)"
              :key="notification.id"
              :notification="notification"
              placement="navbar"
              @mark-as-read="markAsRead"
              @mark-as-unread="markAsUnread" />
          </span>
          <div class="py-2 view-all-wrapper">
            <router-link
              to="/notifications"
              class="font-medium text-primary text-sm">
              View all notifications
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
