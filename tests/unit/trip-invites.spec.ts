import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildTripInviteMessage,
  escapeHtml,
  escapeIlike,
  GENERIC_INVITE_RESULT,
  isInviteRateLimited,
  isUniqueViolation,
  MAX_EMAILS_PER_REQUEST,
  parseInviteEmailsBody,
  sendExistingUserTripInvites,
  sumAttemptCounts,
} from '@/server/utils/tripInvites';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import type { SendMailInput } from '@/server/utils/mailer';
import type { Database } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

const OWNER_ID = '61b66be5-d199-48d5-898a-c521dd6b59cc';
const OTHER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

function asClient (mock: ReturnType<typeof createSupabaseMock>) {
  return mock as unknown as SupabaseClient<Database>;
}

function queuedFrom (
  queues: Record<string, Array<ReturnType<typeof createThenableQuery>>>,
) {
  const indexes: Record<string, number> = {};
  return vi.fn((table: string) => {
    const queue = queues[table] ?? [];
    const index = indexes[table] ?? 0;
    indexes[table] = index + 1;
    return queue[Math.min(index, Math.max(queue.length - 1, 0))]
      ?? createThenableQuery({ data: null, error: null });
  });
}

describe('invite email helpers', () => {
  it('parses, lowercases, and dedupes emails', () => {
    expect(parseInviteEmailsBody({ emails: ['  Pat@Example.com ', 'pat@example.com'] }))
      .toEqual({ emails: ['pat@example.com'] });
  });

  it('rejects empty, invalid, or oversized payloads without mentioning accounts', () => {
    expect(parseInviteEmailsBody({}))
      .toEqual({ error: 'Enter at least one email address.' });
    expect(parseInviteEmailsBody({ emails: ['not-an-email'] }))
      .toEqual({ error: 'Enter a valid email address.' });
    expect(parseInviteEmailsBody({
      emails: Array.from({ length: MAX_EMAILS_PER_REQUEST + 1 }, (_, i) => `u${i}@example.com`),
    }))
      .toEqual({ error: 'Too many email addresses in one invite.' });
  });

  it('rate-limits by rolling send count', () => {
    expect(isInviteRateLimited(19, 1))
      .toBe(false);
    expect(isInviteRateLimited(19, 2))
      .toBe(true);
    expect(sumAttemptCounts([
      { email_count: 4, trip_id: 2 },
      { email_count: 3, trip_id: 9 },
    ], 2))
      .toBe(4);
  });

  it('treats Postgres unique violations as idempotent', () => {
    expect(isUniqueViolation({ code: '23505' }))
      .toBe(true);
    expect(isUniqueViolation({ code: '42501' }))
      .toBe(false);
    expect(escapeIlike('a%b_c'))
      .toBe('a\\%b\\_c');
  });

  it('builds a trip-invite message with escaped copy and a template id', () => {
    expect(escapeHtml('<script>"x"'))
      .toBe('&lt;script&gt;&quot;x&quot;');
    expect(buildTripInviteMessage({
      inviterName: 'Jimmie',
      tripName: 'AT Thru',
      acceptUrl: 'https://app.gearcloset.io/',
    }))
      .toMatchObject({
        templateId: 'trip-invite',
        subject: 'Jimmie invited you to a trip',
      });
  });
});

describe('sendExistingUserTripInvites', () => {
  const trip = { id: 2, name: 'My first trip', profile_id: OWNER_ID };
  const inviter = {
    first_name: 'Jimmie',
    last_name: 'Jackson',
    email: 'owner@example.com',
    trail_name: null,
  };
  const matched = {
    id: OTHER_ID,
    email: 'pat@example.com',
    first_name: 'Pat',
    last_name: 'Lee',
    trail_name: null,
  };

  let send: ReturnType<typeof vi.fn<(input: SendMailInput) => Promise<{ id: string }>>>;

  beforeEach(() => {
    send = vi.fn(async (_input: SendMailInput) => ({ id: 'email_1' }));
  });

  it('inserts a pending trip friend, notification, and email for a matched profile', async () => {
    const userFrom = queuedFrom({
      trips: [createThenableQuery({ data: trip, error: null })],
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
      profiles: [createThenableQuery({ data: [matched], error: null })],
      trip_friends: [createThenableQuery({ data: [{ id: 99 }], error: null })],
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
    });

    await expect(sendExistingUserTripInvites({
      tripId: 2,
      inviterId: OWNER_ID,
      emails: ['pat@example.com'],
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);

    expect(adminFrom)
      .toHaveBeenCalledWith('trip_friends');
    expect(adminFrom)
      .toHaveBeenCalledWith('notifications');
    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        to: 'pat@example.com',
        templateId: 'trip-invite',
      }));
  });

  it('returns the same generic success when the email does not match a profile', async () => {
    const userFrom = queuedFrom({
      trips: [createThenableQuery({ data: trip, error: null })],
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
      profiles: [createThenableQuery({ data: [], error: null })],
    });

    await expect(sendExistingUserTripInvites({
      tripId: 2,
      inviterId: OWNER_ID,
      emails: ['nobody@example.com'],
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);

    expect(adminFrom)
      .not
      .toHaveBeenCalledWith('trip_friends');
    expect(send)
      .not
      .toHaveBeenCalled();
  });

  it('does not insert a second pending row when the unique constraint fires', async () => {
    const userFrom = queuedFrom({
      trips: [createThenableQuery({ data: trip, error: null })],
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
      profiles: [createThenableQuery({ data: [matched], error: null })],
      trip_friends: [createThenableQuery({
        data: null,
        error: { code: '23505', message: 'duplicate' },
      })],
    });

    await expect(sendExistingUserTripInvites({
      tripId: 2,
      inviterId: OWNER_ID,
      emails: ['pat@example.com'],
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);

    expect(adminFrom)
      .not
      .toHaveBeenCalledWith('notifications');
    expect(send)
      .not
      .toHaveBeenCalled();
  });

  it('rejects non-owners and rate-limited senders before looking up emails', async () => {
    const otherOwner = queuedFrom({
      trips: [createThenableQuery({
        data: { ...trip, profile_id: OTHER_ID },
        error: null,
      })],
    });

    await expect(sendExistingUserTripInvites({
      tripId: 2,
      inviterId: OWNER_ID,
      emails: ['pat@example.com'],
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: otherOwner })),
      admin: asClient(createSupabaseMock()),
      send,
    }))
      .rejects
      .toMatchObject({ name: 'InviteError', statusCode: 403 });

    const limitedAdmin = queuedFrom({
      trip_invite_attempts: [createThenableQuery({
        data: [{ email_count: 20, trip_id: 2 }],
        error: null,
      })],
    });
    const ownerFrom = queuedFrom({
      trips: [createThenableQuery({ data: trip, error: null })],
    });

    await expect(sendExistingUserTripInvites({
      tripId: 2,
      inviterId: OWNER_ID,
      emails: ['pat@example.com'],
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: ownerFrom })),
      admin: asClient(createSupabaseMock({ from: limitedAdmin })),
      send,
    }))
      .rejects
      .toMatchObject({ name: 'InviteError', statusCode: 429 });

    expect(limitedAdmin)
      .not
      .toHaveBeenCalledWith('profiles');
  });

  it('still returns generic success when mail delivery fails', async () => {
    send.mockRejectedValue(new Error('allowlist'));
    const userFrom = queuedFrom({
      trips: [createThenableQuery({ data: trip, error: null })],
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
      profiles: [createThenableQuery({ data: [matched], error: null })],
      trip_friends: [createThenableQuery({ data: [{ id: 99 }], error: null })],
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
    });

    await expect(sendExistingUserTripInvites({
      tripId: 2,
      inviterId: OWNER_ID,
      emails: ['pat@example.com'],
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);
  });
});
