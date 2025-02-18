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
  const toggleColorMode = () => {
    (colorMode.preference = (colorMode.value === 'light' ? 'dark' : 'light'));
  };
</script>

<template>
  <nav class="container z-50 flex items-start p-0">
    <div>
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

    <div class="flex items-center gap-4">
      <span
        v-tippy="{ content: 'Toggle color mode' }"
        class="flex">
        <gc-color-mode-toggle @click="toggleColorMode" />
      </span>
      <div class="relative">
        <button-root
          data-testid="notifications-button"
          size="icon"
          variant="ghost"
          @click="isDropdownOpen = !isDropdownOpen">
          <icon-bell-ring class="!size-max text-accent-alt dark:text-card-foreground" />
          <div
            v-if="shouldShowBadge"
            class="absolute end-1 top-1 block size-3 rounded-full border-2 border-white bg-destructive" />
        </button-root>
        <fade-transition>
          <div
            v-if="isDropdownOpen"
            ref="notificationDropdown"
            class="absolute right-0 top-full z-20 mt-2 w-max min-w-[300px] max-w-sm divide-gray-100 rounded-lg border bg-white shadow transition-all duration-300"
            data-testid="notifications-dropdown">
            <typography class="block rounded-t-lg bg-gray-50 px-4 py-2 text-center font-bold">
              Notifications ({{ $store.unreadNotifications?.length ?? 0 }})
            </typography>
            <span v-if="$store.unreadNotifications?.length">
              <ul class="divide-y divide-gray-100">
                <notification-item
                  v-for="notification in $store.unreadNotifications"
                  :key="notification.id"
                  :notification="(notification as ExtendedNotification)" />
              </ul>
              <div class="block rounded-b-lg bg-gray-50 px-4 py-2 text-center text-text">
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
              <typography
                class="text-center font-medium"
                variant="small">
                No new notifications
              </typography>
            </div>
          </div>
        </fade-transition>
      </div>
    </div>
  </nav>
</template>
