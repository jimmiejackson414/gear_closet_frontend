<script lang='ts' setup>
  import { BellRingIcon } from 'lucide-vue-next';
  import { useUserStore } from '@/stores/user';
  import NotificationItem from '@/components/common/NotificationItem.vue';
  import { tailwind } from '@/helpers';
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

    <!-- Dropdown button -->
    <button
      id="dropdownNotificationButton"
      class="bg-white duration-200 ease-in-out font-medium inline-flex items-center p-3 relative rounded-full shadow-light hover:shadow-default text-center hover:text-primary text-gray-500 text-sm transition-all  focus:outline-none"
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
      class="bg-white divide-gray-100 divide-y hidden max-w-sm rounded-lg shadow w-full z-20">
      <div class="bg-gray-50 block font-medium px-4 py-2 rounded-t-lg text-center text-gray-700">
        Notifications
      </div>
      <div class="divide-gray-100 divide-y">
        <a
          class="flex px-4 py-3 hover:bg-gray-100"
          href="#">
          <div class="flex-shrink-0">
            <img
              alt="Jese image"
              class="h-11 rounded-full w-11"
              src="/docs/images/people/profile-picture-1.jpg">
            <div class="-mt-5 absolute bg-blue-600 border border-white flex justify-center items-center h-5 ms-6 rounded-full w-5">
              <svg
                aria-hidden="true"
                class="h-2 text-white w-2"
                fill="currentColor"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
              </svg>
            </div>
          </div>
          <div class="ps-3 w-full">
            <div class="mb-1.5 text-gray-500 text-sm">New message from <span class="font-semibold text-gray-900">Jese Leos</span>: "Hey, what's up? All set for the presentation?"</div>
            <div class="text-blue-600 text-xs">a few moments ago</div>
          </div>
        </a>
        <a
          class="flex px-4 py-3 hover:bg-gray-100"
          href="#">
          <div class="flex-shrink-0">
            <img
              alt="Joseph image"
              class="h-11 rounded-full w-11"
              src="/docs/images/people/profile-picture-2.jpg">
            <div class="-mt-5 absolute bg-gray-900 border border-white flex justify-center items-center h-5 ms-6 rounded-full w-5">
              <svg
                aria-hidden="true"
                class="h-2 text-white w-2"
                fill="currentColor"
                viewBox="0 0 20 18"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
              </svg>
            </div>
          </div>
          <div class="ps-3 w-full">
            <div class="mb-1.5 text-gray-500 text-sm"><span class="font-semibold text-gray-900">Joseph Mcfall</span> and <span class="font-medium text-gray-900">5 others</span> started following you.</div>
            <div class="text-blue-600 text-xs">10 minutes ago</div>
          </div>
        </a>
        <a
          class="flex px-4 py-3 hover:bg-gray-100"
          href="#">
          <div class="flex-shrink-0">
            <img
              alt="Bonnie image"
              class="h-11 rounded-full w-11"
              src="/docs/images/people/profile-picture-3.jpg">
            <div class="-mt-5 absolute bg-red-600 border border-white flex justify-center items-center h-5 ms-6 rounded-full w-5">
              <svg
                aria-hidden="true"
                class="h-2 text-white w-2"
                fill="currentColor"
                viewBox="0 0 20 18"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
              </svg>
            </div>
          </div>
          <div class="ps-3 w-full">
            <div class="mb-1.5 text-gray-500 text-sm"><span class="font-semibold text-gray-900">Bonnie Green</span> and <span class="font-medium text-gray-900">141 others</span> love your story. See it and view more stories.</div>
            <div class="text-blue-600 text-xs">44 minutes ago</div>
          </div>
        </a>
        <a
          class="flex px-4 py-3 hover:bg-gray-100"
          href="#">
          <div class="flex-shrink-0">
            <img
              alt="Leslie image"
              class="h-11 rounded-full w-11"
              src="/docs/images/people/profile-picture-4.jpg">
            <div class="-mt-5 absolute bg-green-400 border border-white flex justify-center items-center h-5 ms-6 rounded-full w-5">
              <svg
                aria-hidden="true"
                class="h-2 text-white w-2"
                fill="currentColor"
                viewBox="0 0 20 18"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
              </svg>
            </div>
          </div>
          <div class="ps-3 w-full">
            <div class="mb-1.5 text-gray-500 text-sm"><span class="font-semibold text-gray-900">Leslie Livingston</span> mentioned you in a comment: <span
              class="font-medium text-blue-500"
              href="#">@bonnie.green</span> what do you say?</div>
            <div class="text-blue-600 dark:text-blue-500 text-xs">1 hour ago</div>
          </div>
        </a>
        <a
          class="flex px-4 py-3 hover:bg-gray-100"
          href="#">
          <div class="flex-shrink-0">
            <img
              alt="Robert image"
              class="h-11 rounded-full w-11"
              src="/docs/images/people/profile-picture-5.jpg">
            <div class="-mt-5 absolute bg-purple-500 border border-white flex justify-center items-center h-5 ms-6 rounded-full w-5">
              <svg
                aria-hidden="true"
                class="h-2 text-white w-2"
                fill="currentColor"
                viewBox="0 0 20 14"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
              </svg>
            </div>
          </div>
          <div class="ps-3 w-full">
            <div class="mb-1.5 text-gray-500 text-sm"><span class="font-semibold text-gray-900">Robert Brown</span> posted a new video: Glassmorphism - learn how to implement the new design trend.</div>
            <div class="text-blue-600 text-xs">3 hours ago</div>
          </div>
        </a>
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
    </div> -->
  </nav>
</template>
