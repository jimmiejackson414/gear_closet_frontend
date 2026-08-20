import type { Tables } from '@/types';

export type ExtendedFriend = Tables<'friends'> & {
  profile?: Tables<'profiles'>;
  friend: Tables<'profiles'>;
};

/** `get_planning_page_data` friend row: trip_friends plus nested `friend_profile`. */
export type ExtendedTripFriend = Tables<'trip_friends'> & {
  friend_profile: Tables<'profiles'> | null;
};

export type ExtendedFriendInvite = Tables<'friend_invitations'> & {
  recipient: Tables<'profiles'>;
  sender: Tables<'profiles'>;
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
