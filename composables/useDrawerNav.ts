import { drawerLinks, type LinkItem } from '@/utils/drawerLinks';

export function useDrawerNav () {
  const $route = useRoute();
  const $router = useRouter();
  const $appStore = useAppStore();
  const $store = useUserStore();
  const colorMode = useColorMode();

  const isLightMode = computed(() => colorMode.preference === 'light');
  const links = drawerLinks();

  const isActiveRoute = (link: LinkItem) => $route.name === link.to;

  const iconColor = (link: LinkItem) => {
    if (link.comingSoon || link.disabled) return tailwind.theme.colors.muted.foreground;
    if (!isLightMode.value) return tailwind.theme.colors.primary.light;
    return isActiveRoute(link)
      ? tailwind.theme.colors.primary.DEFAULT
      : tailwind.theme.colors.muted.foreground;
  };

  const linkTo = (link: LinkItem) => {
    if (link.comingSoon) return undefined;
    if (link.disabled && link.requiresSubscription) {
      return { path: '/profile', query: { tab: 'subscription' } };
    }
    return { name: link.to };
  };

  const linkLabel = (link: LinkItem) => {
    if (link.comingSoon) return link.comingSoonCopy ?? link.title;
    if (link.requiresSubscription && link.disabled) {
      return link.requiresSubscriptionCopy ?? link.title;
    }
    return link.title;
  };

  const onDrawerLinkClick = (link: LinkItem) => {
    if (link.comingSoon) return;
    $appStore.closeDrawer();
  };

  const handleLogout = async () => {
    $appStore.closeDrawer();
    const supabase = useSupabaseClient();
    await supabase.auth.signOut();
    await $router.push({ name: 'login' });
  };

  watch(() => $route.fullPath, () => {
    $appStore.closeDrawer();
  });

  return {
    $appStore,
    $store,
    handleLogout,
    iconColor,
    isActiveRoute,
    isLightMode,
    linkLabel,
    links,
    linkTo,
    onDrawerLinkClick,
  };
}
