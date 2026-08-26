import { z } from 'zod';
import type { SentFriendEmail } from '@/types/planning';

const emailSchema = z.string()
  .trim()
  .email();

export const sharedTripSubtitle = (count: number) => {
  if (count <= 0) return 'No trips together yet';
  return `${count} shared trip${count === 1 ? '' : 's'}`;
};

export const friendDirectoryStatusLabel = (status: string) => {
  switch (status) {
    case 'Friend':
      return 'Friend';
    case 'Pending':
      return 'Pending';
    default:
      return status;
  }
};

export const friendDirectoryStatusVariant = (status: string) => {
  switch (status) {
    case 'Friend':
      return 'default' as const;
    default:
      return 'secondary' as const;
  }
};

export const parseFriendInviteChipEmail = (
  raw: string,
  alreadyQueued: string[],
  blocked: Map<string, string>,
) => {
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Enter a valid email address.' };
  }

  const email = parsed.data.toLowerCase();
  const blockedMessage = blocked.get(email);
  if (blockedMessage) {
    return { error: blockedMessage };
  }
  if (alreadyQueued.includes(email)) {
    return { duplicate: true, email };
  }
  return { email };
};

export const distinctLatestEmails = (
  rows: Array<{ email: string | null; created_at: string }>,
): SentFriendEmail[] => {
  const seen = new Set<string>();
  const out: SentFriendEmail[] = [];
  for (const row of rows) {
    const email = row.email?.trim()
      .toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push({ email, lastSentAt: row.created_at });
  }
  return out;
};

export const countSharedTripsByFriendId = (
  myId: string,
  friendIds: string[],
  trips: Array<{ id: number; profile_id: string | null }>,
  memberships: Array<{
    trip_id: number | null;
    profile_id: string | null;
    status: string;
  }>,
) => {
  const friendSet = new Set(friendIds);
  const tripIds = new Map<string, Set<number>>();

  const add = (friendId: string, tripId: number) => {
    if (!friendSet.has(friendId) || friendId === myId) return;
    let set = tripIds.get(friendId);
    if (!set) {
      set = new Set();
      tripIds.set(friendId, set);
    }
    set.add(tripId);
  };

  for (const trip of trips) {
    if (trip.profile_id) add(trip.profile_id, trip.id);
  }

  for (const row of memberships) {
    if (row.status !== 'ACCEPTED' || row.trip_id == null || !row.profile_id) continue;
    add(row.profile_id, row.trip_id);
  }

  const counts = new Map<string, number>();
  for (const [friendId, set] of tripIds) {
    counts.set(friendId, set.size);
  }
  return counts;
};

export const matchesCrewFilter = (
  query: string,
  friend: {
    first_name?: string | null;
    last_name?: string | null;
    trail_name?: string | null;
    email?: string | null;
  } | null | undefined,
) => {
  if (!query) return true;
  const haystack = [
    friend?.first_name,
    friend?.last_name,
    friend?.trail_name,
    friend?.email,
  ].filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
};

const nestedEmail = (value: unknown, key: string) => {
  const nested = asRecord(asRecord(value)?.[key])?.email;
  return typeof nested === 'string' ? nested.trim()
    .toLowerCase() : '';
};

export const matchingCrewIds = (rows: unknown, query: string) => {
  if (!Array.isArray(rows) || !query) return new Set<number>();
  const ids = new Set<number>();
  for (const row of rows) {
    const record = asRecord(row);
    if (!record || typeof record.id !== 'number') continue;
    const friend = asRecord(record.friend);
    if (matchesCrewFilter(query, {
      email: typeof friend?.email === 'string' ? friend.email : null,
      first_name: typeof friend?.first_name === 'string' ? friend.first_name : null,
      last_name: typeof friend?.last_name === 'string' ? friend.last_name : null,
      trail_name: typeof friend?.trail_name === 'string' ? friend.trail_name : null,
    })) {
      ids.add(record.id);
    }
  }
  return ids;
};

export const emailsFromNestedField = (rows: unknown, key: string) => {
  const emails = new Set<string>();
  if (!Array.isArray(rows)) return emails;
  for (const row of rows) {
    const email = nestedEmail(row, key);
    if (email) emails.add(email);
  }
  return emails;
};

export const idsFromField = (rows: unknown, key: string) => {
  const ids: string[] = [];
  if (!Array.isArray(rows)) return ids;
  for (const row of rows) {
    const value = asRecord(row)?.[key];
    if (typeof value === 'string' && value) ids.push(value);
  }
  return ids;
};

export const visibleSentEmails = (
  emails: SentFriendEmail[],
  ownEmail: string | null | undefined,
  friendEmails: Set<string>,
  pendingEmails: Set<string>,
) => {
  const own = ownEmail?.trim()
    .toLowerCase();
  return emails.filter((row) => {
    const email = row.email.trim()
      .toLowerCase();
    if (!email) return false;
    if (own && email === own) return false;
    if (friendEmails.has(email)) return false;
    if (pendingEmails.has(email)) return false;
    return true;
  });
};
