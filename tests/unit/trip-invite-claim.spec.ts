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
  id: 11,
  email: 'pat@example.com',
  status: 'PENDING' as const,
  expires_at: '2026-09-03T12:00:00.000Z',
  claimed_profile_id: null,
  trip_id: 2,
  invited_by_id: OWNER_ID,
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
      trip_invitations: [createThenableQuery({ data: pendingInvite, error: null })],
      trips: [createThenableQuery({ data: { name: 'AT Thru' }, error: null })],
      profiles: [createThenableQuery({
        data: {
          first_name: 'Jimmie',
          last_name: 'Jackson',
          email: 'owner@example.com',
          trail_name: null,
        },
        error: null,
      })],
    });

    await expect(previewTripInvite(asClient(createSupabaseMock({ from: adminFrom })), TOKEN, NOW))
      .resolves
      .toEqual({
        status: 'ok',
        tripName: 'AT Thru',
        inviterName: 'Jimmie Jackson',
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
          status: 'CLAIMED',
          claimed_profile_id: OTHER_ID,
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
      trip_invitations: [
        createThenableQuery({ data: pendingInvite, error: null }),
        createThenableQuery({ data: { id: 11 }, error: null }),
      ],
      trip_friends: [createThenableQuery({ data: [{ id: 99 }], error: null })],
      trips: [createThenableQuery({ data: { name: 'AT Thru' }, error: null })],
      profiles: [createThenableQuery({
        data: {
          first_name: 'Jimmie',
          last_name: 'Jackson',
          email: 'owner@example.com',
          trail_name: null,
        },
        error: null,
      })],
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
    });

    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      userId: USER_ID,
      userEmail: 'Pat@example.com',
      token: TOKEN,
      now: NOW,
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
      userId: USER_ID,
      userEmail: 'pat@example.com',
      token: TOKEN,
      now: NOW,
    }))
      .resolves
      .toEqual({ ok: false, reason: 'expired' });

    const usedFrom = queuedFrom({
      trip_invitations: [createThenableQuery({
        data: {
          ...pendingInvite,
          status: 'CLAIMED',
          claimed_profile_id: OTHER_ID,
        },
        error: null,
      })],
    });
    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: usedFrom })),
      userId: USER_ID,
      userEmail: 'pat@example.com',
      token: TOKEN,
      now: NOW,
    }))
      .resolves
      .toEqual({ ok: false, reason: 'used' });

    const mismatchFrom = queuedFrom({
      trip_invitations: [createThenableQuery({ data: pendingInvite, error: null })],
    });
    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: mismatchFrom })),
      userId: USER_ID,
      userEmail: 'other@example.com',
      token: TOKEN,
      now: NOW,
    }))
      .resolves
      .toEqual({ ok: false, reason: 'email_mismatch' });
  });

  it('treats a token already claimed by this user as success', async () => {
    const adminFrom = queuedFrom({
      trip_invitations: [createThenableQuery({
        data: {
          ...pendingInvite,
          status: 'CLAIMED',
          claimed_profile_id: USER_ID,
        },
        error: null,
      })],
      trip_friends: [
        createThenableQuery({ data: null, error: { code: '23505' } }),
        createThenableQuery({ data: null, error: null }),
      ],
    });

    await expect(claimTripInvite({
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      userId: USER_ID,
      userEmail: 'pat@example.com',
      token: TOKEN,
      now: NOW,
    }))
      .resolves
      .toEqual({ ok: true, tripId: 2, alreadyClaimed: true });

    expect(adminFrom)
      .toHaveBeenCalledWith('trip_friends');
  });
});
