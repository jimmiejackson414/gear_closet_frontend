<script lang='ts' setup>
  import { useUserStore } from '@/stores/user';

  interface Props {
    compactHeader?: boolean
    pageTitle?: string
  }

  withDefaults(defineProps<Props>(), {
    compactHeader: false,
    pageTitle: '',
  });

  const $store = useUserStore();
  const $appStore = useAppStore();

  const shouldShowBadge = computed(() => ( $store.unreadNotifications?.length ?? 0 ) > 0);

  const isDropdownOpen = ref(false);
  const notificationDropdown = ref<any | null>(null);
  onClickOutside(notificationDropdown, () => isDropdownOpen.value = false);

  const colorMode = useColorMode();
  const toggleColorMode = () => (colorMode.preference = (colorMode.value === 'light' ? 'dark' : 'light'));
</script>

<template>
  <nav class="z-50 flex lg:flex-row flex-col lg:items-start gap-4 lg:gap-2 p-0 w-full min-w-0">
    <div
      class="flex items-center lg:order-2 lg:ml-auto w-full lg:w-auto"
      data-testid="nav-toolbar">
      <button-root
        aria-controls="gc-drawer"
        :aria-expanded="$appStore.drawer"
        :aria-label="$appStore.drawer ? 'Close navigation' : 'Open navigation'"
        class="lg:hidden shrink-0"
        data-testid="nav-menu-button"
        size="icon"
        type="button"
        variant="ghost"
        @click="$appStore.toggleDrawer">
        <icon-x
          v-if="$appStore.drawer"
          aria-hidden="true"
          class="size-6!" />
        <icon-menu
          v-else
          aria-hidden="true"
          class="size-6!" />
      </button-root>
      <div class="lg:hidden grow" />
      <div class="flex items-center gap-3 sm:gap-8">
        <span
          v-tippy="{ content: 'Toggle color mode' }"
          class="flex">
          <button-root
            :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            size="icon"
            type="button"
            variant="ghost"
            @click="toggleColorMode">
            <icon-sun
              v-if="colorMode.value === 'dark'"
              class="size-6! dark:text-card-foreground text-accent-alt"
              :size="20" />
            <icon-moon
              v-else
              class="size-6! dark:text-card-foreground text-accent-alt"
              :size="40" />
          </button-root>
        </span>
        <div class="relative">
          <button-root
            :aria-expanded="isDropdownOpen"
            aria-label="Open notifications"
            data-testid="notifications-button"
            size="icon"
            type="button"
            variant="ghost"
            @click="isDropdownOpen = !isDropdownOpen">
            <icon-bell-ring
              aria-hidden="true"
              class="size-max! dark:text-card-foreground text-accent-alt" />
            <div
              v-if="shouldShowBadge"
              class="block top-1 absolute inset-e-1 bg-destructive border-2 border-white rounded-full w-3 h-3" />
          </button-root>
          <fade-transition>
            <div
              v-if="isDropdownOpen"
              ref="notificationDropdown"
              class="top-full right-0 z-20 absolute bg-white shadow-xs mt-2 border rounded-lg divide-gray-100 w-[min(18.75rem,calc(100vw-5.5rem))] max-w-[calc(100vw-5.5rem)] transition-all duration-300"
              data-testid="notifications-dropdown">
              <div class="block bg-gray-50 px-4 py-2 rounded-t-lg font-bold text-muted-foreground text-center">
                Notifications ({{ $store.unreadNotifications?.length ?? 0 }})
              </div>
              <span v-if="$store.unreadNotifications?.length">
                <ul class="divide-y divide-gray-100">
                  <notification-item
                    v-for="notification in $store.unreadNotifications"
                    :key="notification.id"
                    :notification="notification" />
                </ul>
                <div class="block bg-gray-50 px-4 py-2 rounded-b-lg text-muted-foreground text-center">
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
                class="px-4 py-3">
                <typography
                  class="text-muted-foreground text-center"
                  variant="small">
                  No new notifications
                </typography>
              </div>
            </div>
          </fade-transition>
        </div>
      </div>
    </div>
    <div
      v-if="!compactHeader && pageTitle"
      class="lg:flex-1 lg:order-1 min-w-0 page-title"
      data-testid="page-title">
      <h1 class="text-2xl sm:text-3xl">
        {{ pageTitle }}
      </h1>
    </div>
  </nav>
</template>
