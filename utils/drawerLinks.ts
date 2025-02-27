import { IconDoorOpen,  IconHome, IconListTodo, IconMessagesSquare, IconUserCircle2, IconUsers } from '#components';

export type LinkItem = {
  disabled: boolean;
  external: boolean;
  icon: typeof IconDoorOpen;
  requiresSubscription: boolean;
  requiresSubscriptionCopy?: string;
  title: string;
  to: string;
}

export const drawerLinks = () => {
  const config = useRuntimeConfig();

  const $store = useUserStore();

  return [
    {
      disabled: false,
      external: false,
      icon: IconHome,
      requiresSubscription: false,
      title: 'Dashboard',
      to: 'index',
    },
    {
      disabled: false,
      external: false,
      icon: IconDoorOpen,
      requiresSubscription: false,
      title: 'Closet',
      to: 'closet',
    },
    {
      disabled: false,
      external: false,
      icon: IconListTodo,
      requiresSubscription: false,
      title: 'Planning',
      to: 'planning',
    },
    {
      disabled: false,
      external: false,
      icon: IconUsers,
      requiresSubscription: false,
      title: 'Friends',
      to: 'friends',
    },
    {
      disabled: !$store.isPaidMember,
      external: true,
      icon: IconMessagesSquare,
      requiresSubscription: true,
      requiresSubscriptionCopy: 'The forums are only available to paid members.',
      title: 'Forums',
      to: config.public.forumsUrl,
    },
    {
      disabled: false,
      external: false,
      icon: IconUserCircle2,
      requiresSubscription: false,
      title: 'Profile',
      to: 'profile',
    },
  ] satisfies LinkItem[];
};