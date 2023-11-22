<script lang='ts' setup>
  import { Bars3Icon, BellAlertIcon } from '@heroicons/vue/24/outline';
  import { useAppStore } from '@/stores/app';
  import { useUserStore } from '@/stores/user';
  import NotificationItem from '@/components/common/NotificationItem.vue';
  import type { Notification } from '@/generated/types';

  interface Props {
    pageTitle: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    pageTitle: '',
  });

  // instantiate store and libs
  const $appStore = useAppStore();
  const $userStore = useUserStore();

  const { notifications, currentUser } = storeToRefs($userStore);

  const shouldShowBadge = computed(() => $userStore.totalUnread > 0 && notifications.value.some(n => !n.read_on_date));

  const welcomeMessage = computed(() => {
    if (currentUser.value?.first_name) {
      const arr = ['Hello', 'Welcome', 'Hey'];
      const rand = Math.floor(Math.random() * arr.length);
      return `${arr[rand]}, ${currentUser.value.first_name}!`;
    }
    return 'Welcome!';
  });

  const markAllAsRead = (): void => { $userStore.markAllAsRead(); };

  const markAsRead = (notification: Notification): void => {
    const payload = {
      id: notification.id,
      read_on_date: new Date()
        .toISOString(),
    };
    $userStore.updateNotification(payload);
  };

  const markAsUnread = (notification: Notification): void => {
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
        class="duration-200 hs-dropdown-toggle p-3 relative rounded-full shadow-light hover:shadow-default transition-all">
        <BellAlertIcon class="h-6 w-6" />
        <span
          v-if="shouldShowBadge"
          class="-translate-y-1/2 absolute top-0 bg-danger end-0 font-medium inline-flex items-center px-1.5 py-0.5 rounded-full text-white text-xs transform translate-x-1/2">
          {{ $userStore.totalUnread }}
        </span>
      </button>
      <div
        class="bg-white duration hidden hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[15rem] mt-2 opacity-0 p-2 rounded-lg shadow-default transition-[opacity,margin] after:-bottom-4 after:absolute after:h-4 after:start-0 after:w-full before:-top-4 before:absolute before:h-4 before:start-0 before:w-full"
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
            v-if="notifications?.length"
            class="notifications-wrapper">
            <NotificationItem
              v-for="notification in notifications.slice(0, 5)"
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
    <button
      class="ml-6 p-3"
      @click="$appStore.toggleDrawer()">
      <Bars3Icon class="h-6 w-6" />
    </button>
  </nav>
</template>

<!-- <style lang="scss" scoped>
  .header {
    z-index: 2000;
    padding: 0;
    display: flex;

    .page-title {
      .emoji {
        margin-right: 0.5rem;
      }
    }
  }

  .q-list {
    .title {
      margin-right: 4rem;
    }

    .notifications-wrapper {
      background: red;

      .q-item {
        margin: 0;

        .q-btn {
          padding: 4px;
        }
      }
    }
  }
</style> -->
