import { isResourceLocked } from '@/utils/planLimits';

export function isOwnedTrip (
  trip: { profile_id?: string | null } | null | undefined,
  userId: string | null | undefined,
): boolean {
  return Boolean(userId && trip?.profile_id === userId);
}

export function ownedTrips<T extends { profile_id?: string | null }> (
  trips: T[],
  userId: string | null | undefined,
): T[] {
  return trips.filter((trip) => isOwnedTrip(trip, userId));
}

/** Invitee trips are never the invitee's Free-quota lock. */
export function isTripLockedForUser (
  trip: { id?: number; profile_id?: string | null; locked_at?: string | null } | null | undefined,
  userId: string | null | undefined,
  isPaidMember: boolean,
): boolean {
  if (!isOwnedTrip(trip, userId)) return false;
  if (isPaidMember) return false;
  return isResourceLocked({ id: trip?.id ?? 0, locked_at: trip?.locked_at });
}
