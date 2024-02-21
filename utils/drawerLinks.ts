import { DoorOpen,  Home, ListTodo, MessagesSquare, Users, UserCircle2 } from 'lucide-vue-next';
import type { Icon } from 'lucide-vue-next';

export type LinkItem = {
  to: string;
  title: string;
  icon: Icon;
  disabled: boolean;
  requiresSubscription: boolean;
  external: boolean;
}

export const drawerLinks = () => {
  const config = useRuntimeConfig();
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
      disabled: false,
      requiresSubscription: true,
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