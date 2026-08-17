import { describe, expect, it } from 'vitest';
import { resolveLockedFallback } from '@/utils/planLimits';
import { isOwnedTrip, isTripLockedForUser, ownedTrips } from '@/utils/trips';

const owned = { id: 1, profile_id: 'me', locked_at: null };
const invited = { id: 2, profile_id: 'them', locked_at: null };
const lockedOwned = { id: 3, profile_id: 'me', locked_at: '2026-01-01T00:00:00Z' };

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
});
