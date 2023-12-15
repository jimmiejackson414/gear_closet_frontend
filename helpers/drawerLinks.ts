import { DoorOpen,  Home, ListTodo, MessagesSquare, Users, UserCircle2 } from 'lucide-vue-next';
import type { Icon } from 'lucide-vue-next';

export type LinkItem = {
  to: string;
  title: string;
  icon: Icon;
  disabled: boolean;
  requiresSubscription: boolean;
}

export const drawerLinks = [
  {
    to: 'dashboard',
    title: 'Dashboard',
    icon: Home,
    disabled: false,
    requiresSubscription: false,
  },
  {
    to: 'closet',
    title: 'Closet',
    icon: DoorOpen,
    disabled: false,
    requiresSubscription: false,
  },
  {
    to: 'planning',
    title: 'Planning',
    icon: ListTodo,
    disabled: false,
    requiresSubscription: false,
  },
  {
    to: 'friends',
    title: 'Friends',
    icon: Users,
    disabled: false,
    requiresSubscription: false,
  },
  {
    to: import.meta.env.NUXT_FORUMS_URL,
    title: 'Forums',
    icon: MessagesSquare,
    disabled: false,
    requiresSubscription: true,
  },
  {
    to: 'profile',
    title: 'Profile',
    icon: UserCircle2,
    disabled: false,
    requiresSubscription: false,
  },
] as LinkItem[];
