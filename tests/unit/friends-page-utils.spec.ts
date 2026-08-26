import { describe, expect, it } from 'vitest';
import {
  countSharedTripsByFriendId,
  distinctLatestEmails,
  matchesCrewFilter,
  matchingCrewIds,
  parseFriendInviteChipEmail,
  sharedTripSubtitle,
  visibleSentEmails,
} from '@/utils/friendsPage';

describe('friends page helpers', () => {
  it('keeps the latest email when rows are newest-first', () => {
    expect(distinctLatestEmails([
      { created_at: '2026-08-26T12:00:00.000Z', email: 'Pat@Example.com' },
      { created_at: '2026-08-26T10:00:00.000Z', email: 'pat@example.com' },
      { created_at: '2026-08-25T09:00:00.000Z', email: '  other@example.com ' },
      { created_at: '2026-08-24T09:00:00.000Z', email: null },
    ]))
      .toEqual([
        { email: 'pat@example.com', lastSentAt: '2026-08-26T12:00:00.000Z' },
        { email: 'other@example.com', lastSentAt: '2026-08-25T09:00:00.000Z' },
      ]);
  });

  it('counts shared trips from owned trips and accepted memberships', () => {
    const counts = countSharedTripsByFriendId(
      'me',
      ['friend-a', 'friend-b'],
      [
        { id: 1, profile_id: 'friend-a' },
        { id: 2, profile_id: 'me' },
      ],
      [
        { profile_id: 'friend-a', status: 'ACCEPTED', trip_id: 2 },
        { profile_id: 'friend-b', status: 'ACCEPTED', trip_id: 2 },
        { profile_id: 'friend-b', status: 'PENDING', trip_id: 3 },
      ],
    );

    expect(counts.get('friend-a'))
      .toBe(2);
    expect(counts.get('friend-b'))
      .toBe(1);
    expect(sharedTripSubtitle(2))
      .toBe('2 shared trips');
    expect(sharedTripSubtitle(1))
      .toBe('1 shared trip');
    expect(sharedTripSubtitle(0))
      .toBe('No trips together yet');
  });

  it('blocks own, friend, and pending emails when chipping invites', () => {
    const blocked = new Map([
      ['me@example.com', "That's your email."],
      ['friend@example.com', 'That person is already a friend.'],
    ]);

    expect(parseFriendInviteChipEmail('nope', [], blocked))
      .toEqual({ error: 'Enter a valid email address.' });
    expect(parseFriendInviteChipEmail('me@example.com', [], blocked))
      .toEqual({ error: "That's your email." });
    expect(parseFriendInviteChipEmail('friend@example.com', [], blocked))
      .toEqual({ error: 'That person is already a friend.' });
    expect(parseFriendInviteChipEmail('pat@example.com', ['pat@example.com'], blocked))
      .toEqual({ duplicate: true, email: 'pat@example.com' });
    expect(parseFriendInviteChipEmail('  Pat@Example.com ', [], blocked))
      .toEqual({ email: 'pat@example.com' });
  });

  it('filters crew by name, trail name, or email', () => {
    const friend = {
      email: 'shelly.borga@gmail.com',
      first_name: 'Shelly',
      last_name: 'Borga',
      trail_name: 'Junebug',
    };
    expect(matchesCrewFilter('june', friend))
      .toBe(true);
    expect(matchesCrewFilter('shelly.borga', friend))
      .toBe(true);
    expect(matchesCrewFilter('pat', friend))
      .toBe(false);
    expect([...matchingCrewIds([
      { friend, id: 1 },
      { friend: { email: 'pat@example.com', first_name: 'Pat', last_name: 'Lee', trail_name: null }, id: 2 },
    ], 'june')])
      .toEqual([1]);
  });

  it('hides sent emails that are already friends, pending, or the current user', () => {
    expect(visibleSentEmails(
      [
        { email: 'me@example.com', lastSentAt: '1' },
        { email: 'friend@example.com', lastSentAt: '1' },
        { email: 'pending@example.com', lastSentAt: '1' },
        { email: 'new@example.com', lastSentAt: '1' },
      ],
      'me@example.com',
      new Set(['friend@example.com']),
      new Set(['pending@example.com']),
    ))
      .toEqual([{ email: 'new@example.com', lastSentAt: '1' }]);
  });
});
