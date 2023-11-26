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

  const { unreadNotifications, currentUser } = storeToRefs($userStore);

  const shouldShowBadge = computed(() => $userStore.unreadNotifications.length > 0);

  const welcomeMessage = computed(() => {
    if (currentUser.value?.first_name) {
      const arr = ['Hello', 'Welcome', 'Hey'];
      const rand = Math.floor(Math.random() * arr.length);
      return `${arr[rand]}, ${currentUser.value.first_name}!`;
    }
    return 'Welcome!';
  });

  const markAsRead = (notification: Notification) => {
    const payload: UpdateNotification = { id: notification.id };
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
        class="bg-white duration-200 focus-visible:outline-none hs-dropdown-toggle p-3 relative rounded-full shadow-light hover:shadow-default transition-all"
        type="button">
        <bell-ring-icon class="h-6 w-6" />
        <span
          v-if="shouldShowBadge"
          class="-translate-y-1/2 absolute top-2 bg-danger end-1 font-medium inline-flex items-center px-1.5 py-0.5 rounded-full text-white text-xs transform translate-x-1/2">
          {{ $userStore.unreadNotifications.length }}
        </span>
      </button>
      <div
        aria-labelledby="hs-dropdown-default"
        class="bg-white duration hidden hs-dropdown-menu hs-dropdown-open:opacity-100 max-w-[30rem] min-w-[20rem] mt-2 opacity-0 p-4 rounded-lg shadow-default transition-[opacity,margin] z-50 after:-bottom-4 after:absolute after:h-4 after:start-0 after:w-full before:-top-4 before:absolute before:h-4 before:start-0 before:w-full">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-base">
            Notifications
          </h3>
        </div>
        <div class="divide-gray-200 divide-y">
          <ul
            v-if="unreadNotifications.length"
            class="divide-light-grey divide-y flex flex-col">
            <notification-item
              v-for="notification in unreadNotifications.slice(0, 5)"
              :key="notification.id"
              :notification="notification"
              placement="navbar"
              @mark-as-read="markAsRead" />
          </ul>
          <div
            v-else
            class="py-3">
            <p class="font-medium text-dark-grey text-left text-sm ">
              No new notifications
            </p>
          </div>
          <div class="pt-2 view-all-wrapper">
            <router-link
              class="font-medium text-primary text-sm"
              to="/notifications">
              View all
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
