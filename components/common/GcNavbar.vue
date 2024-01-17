<script lang='ts' setup>
  import { storeToRefs } from 'pinia';
  import { BellRingIcon } from 'lucide-vue-next';
  import { useUserStore } from '@/stores/user';
  import type { ExtendedNotification } from '@/types/helpers';

  interface Props {
    pageTitle: string;
  }
  
  withDefaults(defineProps<Props>(), {
    pageTitle: '',
  });

  const $userStore = useUserStore();
  const { profile, unreadNotifications } = storeToRefs($userStore);

  onMounted(() => {
    $userStore.subscribeToNotifications();
  });

  const shouldShowBadge = computed(() => $userStore.unreadNotifications.length > 0);
  const welcomeMessage = computed(() => {
    if (profile.value?.first_name) {
      const arr = ['Hello', 'Welcome', 'Hey'];
      const rand = Math.floor(Math.random() * arr.length);
      return `${arr[rand]}, ${profile.value.first_name}!`;
    }
    return 'Welcome!';
  });

  const isDropdownOpen = ref(false);
  const notificationDropdown = ref<any | null>(null);

  onClickOutside(notificationDropdown, () => isDropdownOpen.value = false);
</script>

<template>
  <nav class="container flex items-start p-0 z-50">
    <div class="page-title">
      <p class="text-base-lg">
        <span class="mr-2">&#128075;</span>
        <client-only>
          {{ welcomeMessage }}
        </client-only>
      </p>
      <h1 class="mt-4 text-3xl">
        {{ pageTitle }}
      </h1>
    </div>
    <div class="grow" />

    <div class="relative">
      <button
        class="duration-150 ease-in-out font-medium inline-flex items-center relative text-center hover:text-dark-grey text-gray-500 text-sm focus:outline-none"
        type="button"
        @click="isDropdownOpen = !isDropdownOpen">
        <bell-ring-icon class="h-6 w-6" />
        <div
          v-if="shouldShowBadge"
          class="absolute -top-1 bg-danger block border-2 border-white h-3 rounded-full start-3.5 w-3" />
      </button>
      <fade-transition>
        <div
          v-if="isDropdownOpen"
          ref="notificationDropdown"
          class="absolute top-full right-0 bg-white border divide-gray-100 duration-300 max-w-sm min-w-[300px] mt-2 rounded-lg shadow transition-all w-max z-20">
          <div class="bg-gray-50 block font-bold px-4 py-2 rounded-t-lg text-center text-dark-grey">
            Notifications ({{ unreadNotifications.length }})
          </div>
          <span v-if="unreadNotifications.length">
            <ul class="divide-gray-100 divide-y">
              <notification-item
                v-for="notification in unreadNotifications"
                :key="notification.id"
                :notification="(notification as ExtendedNotification)" />
            </ul>
            <div class="bg-gray-50 block px-4 py-2 rounded-b-lg text-center text-dark-grey">
              <gc-button
                ghost
                label="Mark all as read"
                size="sm"
                @click="$userStore.markAllAsRead()" />
            </div>
          </span>
          <div
            v-else
            class="py-3">
            <p class="font-medium text-center text-dark-grey text-sm">
              No new notifications
            </p>
          </div>
        </div>
      </fade-transition>
    </div>
  </nav>
</template>
