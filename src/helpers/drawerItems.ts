interface Item {
  href: string;
  title: string;
  icon: string;
  disabled: boolean;
  requiresSubscription: boolean;
}

const items = [
  {
    href: '/dashboard',
    title: 'Dashboard',
    icon: 'bi-house',
    disabled: false,
    requiresSubscription: false,
  },
  {
    href: '/closet',
    title: 'Closet',
    icon: 'bi-door-open',
    disabled: false,
    requiresSubscription: false,
  },
  {
    href: '/planning',
    title: 'Planning',
    icon: 'bi-journal-check',
    disabled: false,
    requiresSubscription: false,
  },
  {
    href: '/friends',
    title: 'Friends',
    icon: 'bi-people',
    disabled: false,
    requiresSubscription: false,
  },
  {
    href: import.meta.env.VITE_FORUMS_URL,
    title: 'Forums',
    icon: 'bi-chat-right',
    disabled: false,
    requiresSubscription: true,
  },
] as Item[];

export default items;
