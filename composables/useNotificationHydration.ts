/** Lazy-load notifications and subscribe to Realtime after the layout shell renders. */
export function useNotificationHydration () {
  const user = useSupabaseUser();
  const $store = useUserStore();

  onMounted(async () => {
    if (!user.value) return;

    await $store.fetchNotifications();
    await $store.subscribeToNotifications();
  });

  onUnmounted(async () => {
    if (!user.value) return;

    await $store.unsubscribeFromNotifications();
  });
}
