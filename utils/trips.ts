import { TripDetailsType } from '@/types';
import { isResourceLocked } from '@/utils/planLimits';

/** Keep in sync with private.seed_starter_trip_details (migration 68). */
export const STARTER_DETAIL_TITLE = 'New detail';

export function starterDetailValue (type: TripDetailsType): string {
  return type === TripDetailsType.HIKE
    ? 'New hike detail description'
    : 'New trip detail description';
}

export const STARTER_TRIP_DETAILS = [
  {
    title: STARTER_DETAIL_TITLE,
    type: TripDetailsType.TRIP,
    value: starterDetailValue(TripDetailsType.TRIP),
  },
  {
    title: STARTER_DETAIL_TITLE,
    type: TripDetailsType.HIKE,
    value: starterDetailValue(TripDetailsType.HIKE),
  },
] as const;

export function parsePositiveTripId (value: unknown): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export function findTripById<T extends { id?: number | string | null }> (
  trips: T[],
  id: unknown,
): T | undefined {
  const parsed = parsePositiveTripId(id);
  if (parsed == null) return undefined;
  return trips.find((trip) => parsePositiveTripId(trip.id) === parsed);
}

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
