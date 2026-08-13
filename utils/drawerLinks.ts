import { IconDoorOpen,  IconHome, IconListTodo, IconMessagesSquare, IconUserCircle2, IconUsers } from '#components';

export type LinkItem = {
  to: string;
  title: string;
  icon: typeof IconDoorOpen;
  disabled: boolean;
  requiresSubscription: boolean;
  requiresSubscriptionCopy?: string;
  external: boolean;
};

export const drawerLinks = () => {
  const config = useRuntimeConfig();

  const $store = useUserStore();

  return [
    {
      to: 'index',
      title: 'Dashboard',
      icon: IconHome,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: 'closet',
      title: 'Closet',
      icon: IconDoorOpen,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: 'planning',
      title: 'Planning',
      icon: IconListTodo,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: 'friends',
      title: 'Friends',
      icon: IconUsers,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: config.public.forumsUrl,
      title: 'Forums',
      icon: IconMessagesSquare,
      disabled: !$store.isPaidMember,
      requiresSubscription: true,
      requiresSubscriptionCopy: 'The forums are only available to paid members.',
      external: true,
    },
    {
      to: 'profile',
      title: 'Profile',
      icon: IconUserCircle2,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
  ] satisfies LinkItem[];
};