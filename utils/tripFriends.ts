import { z } from 'zod';
import { TripFriendStatus } from '@/types';
import type { Tables } from '@/types';
import type { ExtendedTripFriend, TripFriendRecord } from '@/types/planning';
import type { SelectOption } from '@/types/ui';

const emailSchema = z.string()
  .trim()
  .email();

export type FriendSelectOption = SelectOption & {
  image: string | null;
  status?: string;
};

export const tripFriendStatusLabel = (status: string) => {
  switch (status) {
    case TripFriendStatus.ACCEPTED:
      return 'Accepted';
    case TripFriendStatus.DECLINED:
      return 'Declined';
    case TripFriendStatus.PENDING:
    default:
      return 'Pending';
  }
};

export const tripFriendStatusVariant = (status: string) => {
  switch (status) {
    case TripFriendStatus.ACCEPTED:
      return 'default' as const;
    case TripFriendStatus.DECLINED:
      return 'destructive' as const;
    default:
      return 'secondary' as const;
  }
};

export const tripFriendStatusByProfileId = (
  friends: Array<{ profile_id: string | null; status: string }>,
) => {
  const map = new Map<string, string>();
  for (const friend of friends) {
    if (friend.profile_id) map.set(friend.profile_id, friend.status);
  }
  return map;
};

export const tripFriendEmailSet = (
  friends: Array<{ friend_profile?: { email: string | null } | null }>,
) => {
  const emails = new Set<string>();
  for (const friend of friends) {
    const email = friend.friend_profile?.email?.trim()
      .toLowerCase();
    if (email) emails.add(email);
  }
  return emails;
};

export const pendingInviteEmailSet = (
  invites: Array<{ email?: string | null }>,
) => {
  const emails = new Set<string>();
  for (const invite of invites) {
    const email = invite.email?.trim()
      .toLowerCase();
    if (email) emails.add(email);
  }
  return emails;
};

export const toFriendSelectOptions = <T extends { id: string; image: string | null }>(
  profiles: T[],
  onTripByProfileId: Map<string, string>,
  labelFor: (profile: T) => string,
): FriendSelectOption[] =>
  profiles.map((profile) => {
    const status = onTripByProfileId.get(profile.id);
    return {
      disabled: Boolean(status),
      image: profile.image,
      label: labelFor(profile),
      status,
      value: profile.id,
    };
  });

/** Copy fields instead of spreading a generated row — a spread hits TS2589. */
export const toExtendedTripFriend = (
  friend: TripFriendRecord,
  friendProfile: Tables<'profiles'> | null,
): ExtendedTripFriend => ({
  accepted_invite_on: friend.accepted_invite_on,
  created_at: friend.created_at,
  friend_profile: friendProfile,
  id: friend.id,
  invite_token: friend.invite_token,
  invited_by_id: friend.invited_by_id,
  profile_id: friend.profile_id,
  status: friend.status,
  trip_id: friend.trip_id,
  updated_at: friend.updated_at,
});

export const parseInviteEmail = (
  raw: string,
  alreadyQueued: string[],
  onTripEmails: Set<string>,
) => {
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Enter a valid email address.' };
  }

  const email = parsed.data.toLowerCase();
  if (onTripEmails.has(email)) {
    return { error: 'That person is already on this trip.' };
  }
  if (alreadyQueued.includes(email)) {
    return { duplicate: true, email };
  }
  return { email };
};
