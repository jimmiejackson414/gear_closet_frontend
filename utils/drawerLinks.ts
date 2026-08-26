import { IconDoorOpen, IconHome, IconListTodo, IconMessagesSquare, IconUserCircle2, IconUsers } from '#components';
import { FORUMS_COMING_SOON } from '@/utils/forums';

export type LinkItem = {
  to: string;
  title: string;
  icon: typeof IconDoorOpen;
  disabled: boolean;
  requiresSubscription: boolean;
  requiresSubscriptionCopy?: string;
  comingSoon?: boolean;
  comingSoonCopy?: string;
};

export const drawerLinks = () => {
  return [
    {
      to: 'index',
      title: 'Dashboard',
      icon: IconHome,
      disabled: false,
      requiresSubscription: false,
    },
    {
      to: 'closet',
      title: 'Closet',
      icon: IconDoorOpen,
      disabled: false,
      requiresSubscription: false,
    },
    {
      to: 'planning',
      title: 'Planning',
      icon: IconListTodo,
      disabled: false,
      requiresSubscription: false,
    },
    {
      to: 'friends',
      title: 'Friends',
      icon: IconUsers,
      disabled: false,
      requiresSubscription: false,
    },
    {
      to: 'forums',
      title: 'Forums',
      icon: IconMessagesSquare,
      disabled: true,
      comingSoon: true,
      comingSoonCopy: FORUMS_COMING_SOON,
      requiresSubscription: true,
      requiresSubscriptionCopy: 'The forums are only available to paid members. Upgrade in Profile.',
    },
    {
      to: 'profile',
      title: 'Profile',
      icon: IconUserCircle2,
      disabled: false,
      requiresSubscription: false,
    },
  ] satisfies LinkItem[];
};
