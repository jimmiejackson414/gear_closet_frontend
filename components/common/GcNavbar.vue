<script lang='ts' setup>
  import { useUserStore } from '@/stores/user';
  import type { ExtendedNotification } from '@/types/helpers';

  interface Props {
    pageTitle?: string;
  }

  withDefaults(defineProps<Props>(), {
    pageTitle: '',
  });

  const $store = useUserStore();
  onMounted(() => {
    $store.subscribeToNotifications();
  });

  const shouldShowBadge = computed(() => ( $store.unreadNotifications?.length ?? 0 ) > 0);
  const welcomeMessage = computed(() => {
    if ($store.profile?.first_name) {
      const arr = ['Hello', 'Welcome', 'Hey'];
      const rand = Math.floor(Math.random() * arr.length);
      return `${arr[rand]}, ${$store.profile.first_name}!`;
    }
    return 'Welcome!';
  });

  const isDropdownOpen = ref(false);
  const notificationDropdown = ref<any | null>(null);
  onClickOutside(notificationDropdown, () => isDropdownOpen.value = false);

  const colorMode = useColorMode();
  const toggleColorMode = () => (colorMode.preference = (colorMode.value === 'light' ? 'dark' : 'light'));
</script>

<template>
  <nav class="container flex items-start p-0 z-50">
    <div class="page-title">
      <p
        class="text-base-lg"
        data-testid="welcome-message">
        <span class="mr-2">&#128075;</span>
        <client-only>
          {{ welcomeMessage }}
        </client-only>
      </p>
      <h1
        v-if="pageTitle"
        class="mt-4 text-3xl">
        {{ pageTitle }}
      </h1>
    </div>
    <div class="grow" />

    <div class="flex items-center gap-8">
      <span
        v-tippy="{ content: 'Toggle color mode' }"
        class="flex">
        <button-root
          size="icon"
          variant="ghost"
          @click="toggleColorMode">
          <icon-sun
            v-if="colorMode.value === 'dark'"
            class="size-6! text-accent-alt dark:text-card-foreground"
            :size="20" />
          <icon-moon
            v-else
            class="size-6! text-accent-alt dark:text-card-foreground"
            :size="40" />
        </button-root>
      </span>
      <div class="relative">
        <button-root
          data-testid="notifications-button"
          size="icon"
          variant="ghost"
          @click="isDropdownOpen = !isDropdownOpen">
          <icon-bell-ring class="size-max! text-accent-alt dark:text-card-foreground" />
          <div
            v-if="shouldShowBadge"
            class="absolute top-1 bg-destructive block border-2 border-white inset-e-1 h-3 rounded-full w-3" />
        </button-root>
        <fade-transition>
          <div
            v-if="isDropdownOpen"
            ref="notificationDropdown"
            class="absolute top-full right-0 bg-white border divide-gray-100 duration-300 max-w-sm min-w-[300px] mt-2 rounded-lg shadow-sm transition-all w-max z-20"
            data-testid="notifications-dropdown">
            <div class="bg-gray-50 block font-bold px-4 py-2 rounded-t-lg text-center text-dark-grey">
              Notifications ({{ $store.unreadNotifications?.length ?? 0 }})
            </div>
            <span v-if="$store.unreadNotifications?.length">
              <ul class="divide-gray-100 divide-y">
                <notification-item
                  v-for="notification in $store.unreadNotifications"
                  :key="notification.id"
                  :notification="(notification as ExtendedNotification)" />
              </ul>
              <div class="bg-gray-50 block px-4 py-2 rounded-b-lg text-center text-dark-grey">
                <button-root
                  size="sm"
                  variant="ghost"
                  @click="$store.markAllAsRead()">
                  Mark all as read
                </button-root>
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
    </div>
  </nav>
</template>
