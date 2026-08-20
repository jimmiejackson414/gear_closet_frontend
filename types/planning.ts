import type { Tables } from '@/types';

export type ExtendedFriend = Tables<'friends'> & {
  profile?: Tables<'profiles'>;
  friend: Tables<'profiles'>;
};

/**
 * Plain trip_friends columns. Avoid `Tables<'trip_friends'>` here: spreading or
 * assigning that generated row into a nested type hits TS2589.
 */
export type TripFriendRecord = {
  id: number;
  trip_id: number | null;
  profile_id: string;
  invited_by_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  invite_token: string | null;
  accepted_invite_on: string | null;
  created_at: string | null;
  updated_at: string;
};

/** `get_planning_page_data` friend row: trip_friends plus nested `friend_profile`. */
export type ExtendedTripFriend = TripFriendRecord & {
  friend_profile: Tables<'profiles'> | null;
};

/** Owner-only pending email invites from `get_planning_page_data` (never includes token_hash). */
export type PendingTripInvite = {
  id: number;
  trip_id: number;
  email: string;
  status: 'PENDING' | 'CLAIMED' | 'CANCELED';
  expires_at: string;
  created_at: string;
};

export type TripInvitePreview =
  | { status: 'ok'; tripName: string; inviterName: string }
  | { status: 'expired' | 'used' | 'invalid' };

export type TripInviteClaimResult =
  | { ok: true; alreadyClaimed?: boolean }
  | { ok: false; reason: 'invalid' | 'expired' | 'used' | 'email_mismatch' };

export type InviteInviterProfile = Pick<
  Tables<'profiles'>,
  'id' | 'email' | 'first_name' | 'last_name' | 'trail_name' | 'image'
>;

/** `get_dashboard_data` invitation row: trip_friends plus trip name and inviter. */
export type DashboardTripInvite = Tables<'trip_friends'> & {
  trip_name: string | null;
  inviter_profile: InviteInviterProfile | null;
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
