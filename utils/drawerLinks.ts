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
      disabled: false,
      icon: IconHome,
      requiresSubscription: false,
      title: 'Dashboard',
      to: 'index',
    },
    {
      disabled: false,
      icon: IconDoorOpen,
      requiresSubscription: false,
      title: 'Closet',
      to: 'closet',
    },
    {
      disabled: false,
      icon: IconListTodo,
      requiresSubscription: false,
      title: 'Planning',
      to: 'planning',
    },
    {
      disabled: false,
      icon: IconUsers,
      requiresSubscription: false,
      title: 'Friends',
      to: 'friends',
    },
    {
      comingSoon: true,
      comingSoonCopy: FORUMS_COMING_SOON,
      disabled: true,
      icon: IconMessagesSquare,
      requiresSubscription: true,
      requiresSubscriptionCopy: 'The forums are only available to paid members. Upgrade in Profile.',
      title: 'Forums',
      to: 'forums',
    },
    {
      disabled: false,
      icon: IconUserCircle2,
      requiresSubscription: false,
      title: 'Profile',
      to: 'profile',
    },
  ] satisfies LinkItem[];
};
