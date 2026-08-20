import { describe, expect, it } from 'vitest';
import { tripFriends } from '@/tests/unit/mocks/planning.mock';
import {
  parseInviteEmail,
  toExtendedTripFriend,
  toFriendSelectOptions,
  tripFriendEmailSet,
  tripFriendStatusByProfileId,
  tripFriendStatusLabel,
  tripFriendStatusVariant,
} from '@/utils/tripFriends';

describe('trip friend helpers', () => {
  it('labels and variants pending, accepted, and declined', () => {
    expect(tripFriendStatusLabel('PENDING'))
      .toBe('Pending');
    expect(tripFriendStatusLabel('ACCEPTED'))
      .toBe('Accepted');
    expect(tripFriendStatusLabel('DECLINED'))
      .toBe('Declined');
    expect(tripFriendStatusVariant('PENDING'))
      .toBe('secondary');
    expect(tripFriendStatusVariant('ACCEPTED'))
      .toBe('default');
    expect(tripFriendStatusVariant('DECLINED'))
      .toBe('destructive');
  });

  it('disables people already on the trip', () => {
    const onTrip = tripFriendStatusByProfileId([
      { profile_id: 'on-trip', status: 'PENDING' },
    ]);
    const options = toFriendSelectOptions(
      [
        { id: 'on-trip', image: null },
        { id: 'available', image: null },
      ],
      onTrip,
      profile => profile.id,
    );

    expect(options)
      .toEqual([
        {
          label: 'on-trip',
          value: 'on-trip',
          image: null,
          disabled: true,
          status: 'PENDING',
        },
        {
          label: 'available',
          value: 'available',
          image: null,
          disabled: false,
          status: undefined,
        },
      ]);
  });

  it('rejects invalid or already-on-trip emails and queues new ones', () => {
    const onTripEmails = tripFriendEmailSet([
      { friend_profile: { email: 'Already.On@example.com' } },
    ]);

    expect(parseInviteEmail('not-an-email', [], onTripEmails))
      .toEqual({ error: 'Enter a valid email address.' });
    expect(parseInviteEmail('already.on@example.com', [], onTripEmails))
      .toEqual({ error: 'That person is already on this trip.' });
    expect(parseInviteEmail('new.person@example.com', ['new.person@example.com'], onTripEmails))
      .toEqual({ email: 'new.person@example.com', duplicate: true });
    expect(parseInviteEmail('  New.Person@example.com  ', [], onTripEmails))
      .toEqual({ email: 'new.person@example.com' });
  });

  it('attaches friend_profile onto a trip_friends row', () => {
    const [invite] = tripFriends;
    if (!invite) throw new Error('expected fixture');
    const { friend_profile: profile, ...row } = invite;

    expect(toExtendedTripFriend(row, profile))
      .toEqual(invite);
    expect(toExtendedTripFriend(row, null).friend_profile)
      .toBeNull();
  });
});
