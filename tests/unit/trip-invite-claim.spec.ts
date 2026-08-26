import { describe, expect, it, vi } from 'vitest';
import { claimTripInvite, normalizeInviteToken, previewTripInvite } from '@/server/utils/tripInviteClaim';
import { hashInviteToken } from '@/server/utils/tripInvites';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import type { Database } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

const USER_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const OTHER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const OWNER_ID = '61b66be5-d199-48d5-898a-c521dd6b59cc';
const TOKEN = 'raw-token';
const NOW = new Date('2026-08-20T12:00:00.000Z');

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

const pendingInvite = {
  claimed_profile_id: null,
  email: 'pat@example.com',
  expires_at: '2026-09-03T12:00:00.000Z',
  id: 11,
  invited_by_id: OWNER_ID,
  status: 'PENDING' as const,
  trip_id: 2,
};

describe('trip invite claim helpers', () => {
  it('rejects empty or oversized tokens', () => {
    expect(normalizeInviteToken(''))
      .toBeNull();
    expect(normalizeInviteToken('  abc  '))
      .toBe('abc');
    expect(normalizeInviteToken('x'.repeat(201)))
      .toBeNull();
    expect(hashInviteToken(TOKEN))
      .toMatch(/^[0-9a-f]{64}$/);
  });

  it('previews a valid token without exposing the invitee email', async () => {
    const adminFrom = queuedFrom({
      profiles: [createThenableQuery({
        data: {
          email: 'owner@example.com',
          first_name: 'Jimmie',
          last_name: 'Jackson',
          trail_name: null,
        },
        error: null,
      })],
      trip_invitations: [createThenableQuery({ data: pendingInvite, error: null })],
      trips: [createThenableQuery({ data: { name: 'AT Thru' }, error: null })],
    });

    await expect(previewTripInvite(asClient(createSupabaseMock({ from: adminFrom })), TOKEN, NOW))
      .resolves
      .toEqual({
        inviterName: 'Jimmie Jackson',
        status: 'ok',
        tripName: 'AT Thru',
      });
  });

  it('previews expired and used tokens with distinct statuses', async () => {
    const expiredFrom = queuedFrom({
      trip_invitations: [createThenableQuery({
        data: { ...pendingInvite, expires_at: '2026-08-01T00:00:00.000Z' },
        error: null,
      })],
    });
    await expect(previewTripInvite(asClient(createSupabaseMock({ from: expiredFrom })), TOKEN, NOW))
      .resolves
      .toEqual({ status: 'expired' });

    const usedFrom = queuedFrom({
      trip_invitations: [createThenableQuery({
        data: {
          ...pendingInvite,
          claimed_profile_id: OTHER_ID,
          status: 'CLAIMED',
        },
        error: null,
      })],
    });
    await expect(previewTripInvite(asClient(createSupabaseMock({ from: usedFrom })), TOKEN, NOW))
      .resolves
      .toEqual({ status: 'used' });

    const missingFrom = queuedFrom({
      trip_invitations: [createThenableQuery({ data: null, error: null })],
    });
    await expect(previewTripInvite(asClient(createSupabaseMock({ from: missingFrom })), TOKEN, NOW))
      .resolves
      .toEqual({ status: 'invalid' });
  });

  it('claims a valid token once and accepts the trip friend', async () => {
    const adminFrom = queuedFrom({
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
      profiles: [createThenableQuery({
        data: {
          email: 'owner@example.com',
          first_name: 'Jimmie',
          last_name: 'Jackson',
          trail_name: null,
        },
        error: null,
      })],
      trip_friends: [createThenableQuery({ data: [{ id: 99 }], error: null })],
      trip_invitations: [
        createThenableQuery({ data: pendingInvite, error: null }),
        createThenableQuery({ data: { id: 11 }, error: null }),
      ],
      trips: [createThenableQuery({ data: { name: 'AT Thru' }, error: null })],
    });

    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      now: NOW,
      token: TOKEN,
      userEmail: 'Pat@example.com',
      userId: USER_ID,
    }))
      .resolves
      .toEqual({ ok: true, tripId: 2 });

    expect(adminFrom)
      .toHaveBeenCalledWith('trip_friends');
    expect(adminFrom)
      .toHaveBeenCalledWith('notifications');
  });

  it('rejects expired, reused, and email-mismatched claims', async () => {
    const expiredFrom = queuedFrom({
      trip_invitations: [createThenableQuery({
        data: { ...pendingInvite, expires_at: '2026-08-01T00:00:00.000Z' },
        error: null,
      })],
    });
    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: expiredFrom })),
      now: NOW,
      token: TOKEN,
      userEmail: 'pat@example.com',
      userId: USER_ID,
    }))
      .resolves
      .toEqual({ ok: false, reason: 'expired' });

    const usedFrom = queuedFrom({
      trip_invitations: [createThenableQuery({
        data: {
          ...pendingInvite,
          claimed_profile_id: OTHER_ID,
          status: 'CLAIMED',
        },
        error: null,
      })],
    });
    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: usedFrom })),
      now: NOW,
      token: TOKEN,
      userEmail: 'pat@example.com',
      userId: USER_ID,
    }))
      .resolves
      .toEqual({ ok: false, reason: 'used' });

    const mismatchFrom = queuedFrom({
      trip_invitations: [createThenableQuery({ data: pendingInvite, error: null })],
    });
    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: mismatchFrom })),
      now: NOW,
      token: TOKEN,
      userEmail: 'other@example.com',
      userId: USER_ID,
    }))
      .resolves
      .toEqual({ ok: false, reason: 'email_mismatch' });
  });

  it('treats a token already claimed by this user as success', async () => {
    const adminFrom = queuedFrom({
      trip_friends: [
        createThenableQuery({ data: null, error: { code: '23505' } }),
        createThenableQuery({ data: null, error: null }),
      ],
      trip_invitations: [createThenableQuery({
        data: {
          ...pendingInvite,
          claimed_profile_id: USER_ID,
          status: 'CLAIMED',
        },
        error: null,
      })],
    });

    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      now: NOW,
      token: TOKEN,
      userEmail: 'pat@example.com',
      userId: USER_ID,
    }))
      .resolves
      .toEqual({ alreadyClaimed: true, ok: true, tripId: 2 });

    expect(adminFrom)
      .toHaveBeenCalledWith('trip_friends');
  });
});
