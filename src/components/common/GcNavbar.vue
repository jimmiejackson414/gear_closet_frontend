<script lang='ts' setup>
  import { initDropdowns } from 'flowbite';
  import { BellRingIcon } from 'lucide-vue-next';
  import { useUserStore } from '@/stores/user';
  import NotificationItem from '@/components/common/NotificationItem.vue';
  import { tailwind } from '@/helpers';
  import type { Notification, UpdateNotificationInput } from '@/generated/backendTypes';

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
    const payload: UpdateNotificationInput = { id: notification.id };
    $userStore.updateNotification(payload);
  };

  onMounted(() => {
    initDropdowns();
  });
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

    <!-- Dropdown button -->
    <button
      id="dropdownNotificationButton"
      class="bg-white duration-200 ease-in-out focus-visible:outline-none font-medium inline-flex items-center outline-none focus:outline-none p-3 relative rounded-full shadow-light hover:shadow-default text-center hover:text-primary text-gray-500 text-sm transition-all "
      data-dropdown-offset-distance="10"
      data-dropdown-offset-skidding="-160"
      data-dropdown-toggle="dropdownNotification"
      type="button">
      <bell-ring-icon
        class="h-6 w-6"
        fill="currentColor" />
      <div
        v-if="shouldShowBadge"
        class="absolute top-1 right-2 bg-danger block border-2 border-white h-3 rounded-full w-3" />
    </button>

    <!-- Dropdown menu -->
    <div
      id="dropdownNotification"
      aria-labelledby="dropdownNotificationButton"
      class="bg-white divide-gray-100 divide-y duration-300 hidden max-w-sm rounded-lg shadow-default transition-opacity w-full z-20">
      <div class="bg-gray-50 block font-medium px-4 py-2 rounded-t-lg text-center text-gray-700">
        Notifications
      </div>
      <div class="divide-gray-100 divide-y">
        <ul
          v-if="unreadNotifications.length"
          class="flex flex-col">
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
      </div>
      <a
        class="bg-gray-50 hover:bg-gray-100 block font-medium py-2 rounded-b-lg text-center text-gray-900 text-sm"
        href="#">
        <div class="inline-flex items-center ">
          <svg
            aria-hidden="true"
            class="h-4 me-2 text-gray-500 w-4"
            fill="currentColor"
            viewBox="0 0 20 14"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
          </svg>
          View all
        </div>
      </a>
    </div>

    <!-- <div class="hs-dropdown inline-flex relative">
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
    </div> -->
  </nav>
</template>
