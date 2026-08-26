import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildTripClaimInviteMessage,
  buildTripInviteMessage,
  claimUrlFromOrigin,
  createInviteToken,
  escapeHtml,
  escapeIlike,
  GENERIC_INVITE_RESULT,
  hashInviteToken,
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
      acceptUrl: 'https://app.gearcloset.io/',
      inviterName: 'Jimmie',
      tripName: 'AT Thru',
    }))
      .toMatchObject({
        subject: 'Jimmie invited you to a trip',
        templateId: 'trip-invite',
      });
    expect(buildTripClaimInviteMessage({
      claimUrl: 'https://app.gearcloset.io/invite/trip?token=abc',
      inviterName: 'Jimmie',
      tripName: 'AT Thru',
    }))
      .toMatchObject({
        subject: 'Jimmie invited you to a trip',
        templateId: 'trip-invite-claim',
      });
    expect(claimUrlFromOrigin('https://app.gearcloset.io', 'raw-token'))
      .toBe('https://app.gearcloset.io/invite/trip?token=raw-token');
    const minted = createInviteToken();
    expect(hashInviteToken(minted.token))
      .toBe(minted.tokenHash);
    expect(minted.tokenHash)
      .toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('sendExistingUserTripInvites', () => {
  const trip = { id: 2, name: 'My first trip', profile_id: OWNER_ID };
  const inviter = {
    email: 'owner@example.com',
    first_name: 'Jimmie',
    last_name: 'Jackson',
    trail_name: null,
  };
  const matched = {
    email: 'pat@example.com',
    first_name: 'Pat',
    id: OTHER_ID,
    last_name: 'Lee',
    trail_name: null,
  };

  let send: ReturnType<typeof vi.fn<(input: SendMailInput) => Promise<{ id: string }>>>;

  beforeEach(() => {
    send = vi.fn(async (_input: SendMailInput) => ({ id: 'email_1' }));
  });

  it('inserts a pending trip friend, notification, and email for a matched profile', async () => {
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
      trips: [createThenableQuery({ data: trip, error: null })],
    });
    const adminFrom = queuedFrom({
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
      profiles: [createThenableQuery({ data: [matched], error: null })],
      trip_friends: [createThenableQuery({ data: [{ id: 99 }], error: null })],
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
    });

    await expect(sendExistingUserTripInvites({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      emails: ['pat@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: userFrom })),
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);

    expect(adminFrom)
      .toHaveBeenCalledWith('trip_friends');
    expect(adminFrom)
      .toHaveBeenCalledWith('notifications');
    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        templateId: 'trip-invite',
        to: 'pat@example.com',
      }));
  });

  it('creates a pending invitation and claim email when the email does not match a profile', async () => {
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
      trips: [createThenableQuery({ data: trip, error: null })],
    });
    const adminFrom = queuedFrom({
      profiles: [createThenableQuery({ data: [], error: null })],
      trip_invitations: [
        createThenableQuery({ data: null, error: null }),
        createThenableQuery({ data: [{ id: 11 }], error: null }),
      ],
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
    });

    await expect(sendExistingUserTripInvites({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      createToken: () => ({
        token: 'raw-token',
        tokenHash: hashInviteToken('raw-token'),
      }),
      emails: ['nobody@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: userFrom })),
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);

    expect(adminFrom)
      .toHaveBeenCalledWith('trip_invitations');
    expect(adminFrom)
      .not
      .toHaveBeenCalledWith('trip_friends');
    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        templateId: 'trip-invite-claim',
        text: expect.stringContaining('/invite/trip?token=raw-token'),
        to: 'nobody@example.com',
      }));
  });

  it('resends a pending invitation by rotating the token', async () => {
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
      trips: [createThenableQuery({ data: trip, error: null })],
    });
    const adminFrom = queuedFrom({
      profiles: [createThenableQuery({ data: [], error: null })],
      trip_invitations: [
        createThenableQuery({ data: { id: 7 }, error: null }),
        createThenableQuery({ data: [{ id: 7 }], error: null }),
      ],
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
    });

    await expect(sendExistingUserTripInvites({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      createToken: () => ({
        token: 'rotated-token',
        tokenHash: hashInviteToken('rotated-token'),
      }),
      emails: ['nobody@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: userFrom })),
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);

    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        templateId: 'trip-invite-claim',
        text: expect.stringContaining('token=rotated-token'),
      }));
  });

  it('does not insert a second pending row when the unique constraint fires', async () => {
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
      trips: [createThenableQuery({ data: trip, error: null })],
    });
    const adminFrom = queuedFrom({
      profiles: [createThenableQuery({ data: [matched], error: null })],
      trip_friends: [createThenableQuery({
        data: null,
        error: { code: '23505', message: 'duplicate' },
      })],
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
    });

    await expect(sendExistingUserTripInvites({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      emails: ['pat@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: userFrom })),
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
      admin: asClient(createSupabaseMock()),
      emails: ['pat@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: otherOwner })),
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
      admin: asClient(createSupabaseMock({ from: limitedAdmin })),
      emails: ['pat@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: ownerFrom })),
    }))
      .rejects
      .toMatchObject({ name: 'InviteError', statusCode: 429 });

    expect(limitedAdmin)
      .not
      .toHaveBeenCalledWith('profiles');
  });

  it('allows accepted invitees to send invites', async () => {
    const limitedAdmin = queuedFrom({
      trip_invite_attempts: [createThenableQuery({
        data: [{ email_count: 20, trip_id: 2 }],
        error: null,
      })],
    });
    const inviteeFrom = queuedFrom({
      trip_friends: [createThenableQuery({
        data: { id: 1 },
        error: null,
      })],
      trips: [createThenableQuery({
        data: { ...trip, profile_id: OTHER_ID },
        error: null,
      })],
    });

    await expect(sendExistingUserTripInvites({
      admin: asClient(createSupabaseMock({ from: limitedAdmin })),
      emails: ['pat@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: inviteeFrom })),
    }))
      .rejects
      .toMatchObject({ name: 'InviteError', statusCode: 429 });
  });

  it('still returns generic success when mail delivery fails', async () => {
    send.mockRejectedValue(new Error('allowlist'));
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
      trips: [createThenableQuery({ data: trip, error: null })],
    });
    const adminFrom = queuedFrom({
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
      profiles: [createThenableQuery({ data: [matched], error: null })],
      trip_friends: [createThenableQuery({ data: [{ id: 99 }], error: null })],
      trip_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
    });

    await expect(sendExistingUserTripInvites({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      emails: ['pat@example.com'],
      inviterId: OWNER_ID,
      origin: 'https://app.gearcloset.io',
      send,
      tripId: 2,
      userClient: asClient(createSupabaseMock({ from: userFrom })),
    }))
      .resolves
      .toEqual(GENERIC_INVITE_RESULT);
  });
});
