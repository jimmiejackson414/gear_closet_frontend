import { Stripe } from 'stripe';
import type { Tables } from '@/types';

export type SubscriptionType = Tables<'subscriptions'> & {
  prices: Tables<'prices'>;
};

export type ProfileApiResponse = Tables<'profiles'> & {
  friend_invitations: number;
  notifications: ExtendedNotification[];
  onboarding_steps: Tables<'onboarding_steps'>[];
  subscriptions: SubscriptionType[];
};

export type SubscriptionApiResponse = {
  customer?: Stripe.Customer;
  invoices: Stripe.Invoice[];
  nextBillingDate: number | null;
  paymentMethods: Stripe.PaymentMethod[];
  subscriptions: Stripe.Subscription[];
};

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

export type ExtendedFriend = Tables<'friends'> & {
  friend: Tables<'profiles'>;
  profile?: Tables<'profiles'>;
};

export type ExtendedTripFriend = Tables<'trip_friends'> & {
  profile: Tables<'profiles'> & {
    trip_pack?: Tables<'packs'> & {
      pack?: Tables<'packs'>;
    };
  };
  trip?: Tables<'trips'>;
};

export type ExtendedFriendInvite = Tables<'friend_invitations'> & {
  recipient: Tables<'profiles'>;
  sender: Tables<'profiles'>;
}

export type ExtendedNotification = Tables<'notifications'> & {
  sender: Tables<'profiles'>;
}

export type ExtendedPoll = Tables<'polls'> & {
  answers: Tables<'answers'>[];
  question: Tables<'questions'>;
  votes: Tables<'profile_answers'>[];
}

export type ExtendedReply = Tables<'replies'> & {
  profile: Tables<'profiles'>;
}

export type ExtendedComment = Tables<'comments'> & {
  profile: Tables<'profiles'>;
  replies: ExtendedReply[];
}

export interface PublicPack extends ExtendedPack {
  categories: ExtendedCategory[];
  comments: ExtendedComment[];
  profile: Tables<'profiles'>;
}

export type ForumPost = {
  avatar_template: string;
  category_id: number;
  categoryColor?: string;
  cooked: string;
  created_at: string;
  display_username: string;
  id: number;
  name: string;
  raw: string;
  reads: number;
  reply_count: number;
  topic_slug: string;
  topic_title: string;
  updated_at: string;
  username: string;
}

export type ForumLatestPosts = {
  latest_posts: ForumPost[];
}

export type ForumCategory = {
  color: string;
  description: string;
  id: number;
  name: string;
  post_count: number;
  slug: string;
  topic_count: number;
  topic_url: string;
}

export type ForumCategories = {
  category_list: {
    categories: ForumCategory[];
  }
}

export type SelectOption = {
  [key: string]: any;
  label: string;
  value: number | string;
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