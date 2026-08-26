import { describe, expect, it } from 'vitest';
import { TripDetailsType } from '@/types';
import { resolveLockedFallback } from '@/utils/planLimits';
import {
  isOwnedTrip,
  isTripLockedForUser,
  ownedTrips,
  STARTER_TRIP_DETAILS,
  starterDetailValue,
} from '@/utils/trips';

const owned = { id: 1, locked_at: null, profile_id: 'me' };
const invited = { id: 2, locked_at: null, profile_id: 'them' };
const lockedOwned = { id: 3, locked_at: '2026-01-01T00:00:00Z', profile_id: 'me' };

describe('utils/trips', () => {
  it('detects owned vs invitee trips', () => {
    expect(isOwnedTrip(owned, 'me'))
      .toBe(true);
    expect(isOwnedTrip(invited, 'me'))
      .toBe(false);
    expect(isOwnedTrip(owned, undefined))
      .toBe(false);
  });

  it('filters owned trips for Free quota', () => {
    expect(ownedTrips([owned, invited], 'me')
      .map((t) => t.id))
      .toEqual([1]);
  });

  it('does not treat invitee trips as locked Free resources', () => {
    expect(isTripLockedForUser(lockedOwned, 'me', false))
      .toBe(true);
    expect(isTripLockedForUser(lockedOwned, 'me', true))
      .toBe(false);
    expect(isTripLockedForUser({ ...invited, locked_at: '2026-01-01T00:00:00Z' }, 'me', false))
      .toBe(false);
  });

  it('does not fall back from a locked invitee trip', () => {
    const lockedInvite = { ...invited, locked_at: '2026-01-01T00:00:00Z' };
    expect(resolveLockedFallback(
      lockedInvite,
      [owned, lockedInvite],
      (trip) => isTripLockedForUser(trip, 'me', false),
    ))
      .toEqual({ needed: false });
    expect(resolveLockedFallback(
      lockedOwned,
      [owned, lockedOwned],
      (trip) => isTripLockedForUser(trip, 'me', false),
    ))
      .toEqual({ needed: true, unlocked: owned });
  });

  it('seeds one Trip and one Hike placeholder detail', () => {
    expect(STARTER_TRIP_DETAILS.map((detail) => detail.type))
      .toEqual([TripDetailsType.TRIP, TripDetailsType.HIKE]);
    expect(starterDetailValue(TripDetailsType.TRIP))
      .toBe('New trip detail description');
    expect(starterDetailValue(TripDetailsType.HIKE))
      .toBe('New hike detail description');
  });
});
