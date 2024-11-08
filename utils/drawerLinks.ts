import { DoorOpen,  Home, ListTodo, MessagesSquare, Users, UserCircle2 } from 'lucide-vue-next';
// import type { Icon } from 'lucide-vue-next';

export type LinkItem = {
  to: string;
  title: string;
  icon: any;
  disabled: boolean;
  requiresSubscription: boolean;
  requiresSubscriptionCopy?: string;
  external: boolean;
}

export const drawerLinks = () => {
  const config = useRuntimeConfig();

  const $store = useUserStore();
  const { isPaidMember } = storeToRefs($store);

  return [
    {
      to: 'index',
      title: 'Dashboard',
      icon: Home,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: 'closet',
      title: 'Closet',
      icon: DoorOpen,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: 'planning',
      title: 'Planning',
      icon: ListTodo,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: 'friends',
      title: 'Friends',
      icon: Users,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
    {
      to: config.public.forumsUrl,
      title: 'Forums',
      icon: MessagesSquare,
      disabled: !isPaidMember.value,
      requiresSubscription: true,
      requiresSubscriptionCopy: 'The forums are only available to paid members.',
      external: true,
    },
    {
      to: 'profile',
      title: 'Profile',
      icon: UserCircle2,
      disabled: false,
      requiresSubscription: false,
      external: false,
    },
  ] satisfies LinkItem[];
};