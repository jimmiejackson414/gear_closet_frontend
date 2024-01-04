import type { Tables } from '@/types';

export type ExtendedCategoryItem = Tables<'category_items'> & {
  item: Tables<'items'>
};

export type ExtendedCategory = Tables<'categories'> & {
  category_items: ExtendedCategoryItem[];
};

export type ExtendedPack = Tables<'packs'> & {
  categories: ExtendedCategory[];
};

export type ExtendedUser = Tables<'profiles'> & {
  onboarding_steps: Tables<'onboarding_steps'>[];
};

export type ExtendedNotification = Tables<'notifications'> & {
  sender: Tables<'profiles'>;
}

export type ForumPost = {
  id: number;
  name: string;
  username: string;
  created_at: string;
  updated_at: string;
  reply_count: number;
  topic_title: string;
  topic_slug: string;
  display_username: string;
}

export type ForumLatestPosts = {
  latest_posts: ForumPost[];
}