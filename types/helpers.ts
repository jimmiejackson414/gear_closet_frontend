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