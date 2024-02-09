import type { Profile, Tables } from '@/types';

export type ExtendedCategoryItem = Tables<'category_items'> & {
  item: Tables<'items'>
};

export type ExtendedCategory = Tables<'categories'> & {
  [key: string]: any;
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

export type ExtendedPoll = Tables<'polls'> & {
  question: Tables<'questions'>;
  answers: Tables<'answers'>[];
  votes: Tables<'profile_answers'>[];
}

export type ExtendedReply = Tables<'replies'> & {
  profile: Profile;
}

export type ExtendedComment = Tables<'comments'> & {
  profile: Profile;
  replies: ExtendedReply[];
}

export interface PublicPack extends ExtendedPack {
  profile: Profile;
  comments: ExtendedComment[];
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

export type SelectOption = {
  label: string;
  value: string | number;
}

// Closet page CSV import results
export type ParsedResults = {
  data: any[];
  errors: string[];
  meta: {
    aborted: boolean;
    cursor: number;
    delimiter: string;
    fields: string[];
    linebreak: string;
    truncated: boolean;
  }
}

export type ImportClosetCsvResponse = {
  categories: ExtendedCategory[];
}