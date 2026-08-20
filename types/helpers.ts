import type { Tables } from '@/types';
// Fully type-only: under verbatimModuleSyntax, `import { type Stripe }` still
// emits a bare `import {} from 'stripe'`, which would put the server-side
// Stripe SDK in the module graph of any client file importing this for a value.
import type { Stripe } from 'stripe';

export type SubscriptionType = Tables<'subscriptions'> & {
  prices: Tables<'prices'>;
};

export type ProfileLayoutResponse = Tables<'profiles'> & {
  subscriptions: SubscriptionType[];
};

export type ProfileApiResponse = ProfileLayoutResponse & {
  onboarding_steps?: Tables<'onboarding_steps'>[];
};

export type SubscriptionApiResponse = {
  customer?: Stripe.Customer;
  subscriptions: Stripe.Subscription[];
  nextBillingDate: number | null;
  paymentMethods: Stripe.PaymentMethod[];
  invoices: Stripe.Invoice[];
};

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

export type ExtendedFriend = Tables<'friends'> & {
  profile?: Tables<'profiles'>;
  friend: Tables<'profiles'>;
};

export type ExtendedFriendInvite = Tables<'friend_invitations'> & {
  recipient: Tables<'profiles'>;
  sender: Tables<'profiles'>;
};

/**
 * Minimal profile shape needed to render a display name or initials, so callers
 * can pass narrow selections instead of a full profile row.
 */
export type DisplayNameProfile = Pick<Tables<'profiles'>, 'email' | 'first_name' | 'last_name'> & {
  trail_name?: string | null;
};

export type NotificationSender = Pick<
  Tables<'profiles'>,
  'id' | 'image' | 'email' | 'first_name' | 'last_name' | 'slug'
>;

export type ExtendedNotification = Tables<'notifications'> & {
  sender: NotificationSender | null;
};

export type ExtendedPoll = Tables<'polls'> & {
  question: Tables<'questions'>;
  answers: Tables<'answers'>[];
  votes: Tables<'profile_answers'>[];
};

export type ExtendedReply = Tables<'replies'> & {
  profile: Tables<'profiles'>;
};

export type ExtendedComment = Tables<'comments'> & {
  profile: Tables<'profiles'>;
  replies: ExtendedReply[];
};

export interface PublicPack extends ExtendedPack {
  profile: Tables<'profiles'>;
  categories: ExtendedCategory[];
  comments: ExtendedComment[];
}

export type ForumPost = {
  avatar_template: string;
  category_id: number;
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
  categoryColor?: string;
};

export type ForumLatestPosts = {
  latest_posts: ForumPost[];
};

export type ForumCategory = {
  id: number;
  name: string;
  color: string;
  slug: string;
  topic_count: number;
  post_count: number;
  description: string;
  topic_url: string;
};

export type ForumCategories = {
  category_list: {
    categories: ForumCategory[];
  }
};

export type SelectOption = {
  label: string;
  value: string | number;
};

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
};