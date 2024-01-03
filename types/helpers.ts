import type { Database } from '@/types';

export type ExtendedNotification = Database['public']['Tables']['notifications']['Row'] & {
  sender: Database['public']['Tables']['profiles']['Row'];
};

export type ExtendedCategoryItem = Database['public']['Tables']['category_items']['Row'] & {
  item: Database['public']['Tables']['items']['Row'];
};

export type ExtendedCategory = Database['public']['Tables']['categories']['Row'] & {
  category_items: ExtendedCategoryItem[];
};

export type ExtendedPack = Database['public']['Tables']['packs']['Row'] & {
  categories: ExtendedCategory[];
};

export type ExtendedUser = Database['public']['Tables']['profiles']['Row'] & {
  onboarding_steps: Database['public']['Tables']['onboarding_steps']['Row'][];
};

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