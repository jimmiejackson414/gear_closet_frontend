import { describe, expect, it, vi } from 'vitest';
import {
  friendsUrlFromOrigin,
  GENERIC_FRIEND_INVITE_RESULT,
  parseFriendInviteBody,
  sendFriendEmailInvite,
} from '@/server/utils/friendInvites';
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

describe('friend email invite helpers', () => {
  it('parses and lowercases a single email', () => {
    expect(parseFriendInviteBody({ email: '  Pat@Example.com ' }))
      .toEqual({ email: 'pat@example.com' });
    expect(parseFriendInviteBody({}))
      .toEqual({ error: 'Enter a valid email address.' });
    expect(parseFriendInviteBody({ email: 'not-an-email' }))
      .toEqual({ error: 'Enter a valid email address.' });
  });

  it('builds a friends URL from the request origin', () => {
    expect(friendsUrlFromOrigin('https://app.gearcloset.io/'))
      .toBe('https://app.gearcloset.io/friends');
  });
});

describe('sendFriendEmailInvite', () => {
  const inviter = {
    first_name: 'Jimmie',
    last_name: 'Jackson',
    email: 'owner@example.com',
    trail_name: null,
  };
  const matched = {
    id: OTHER_ID,
    email: 'pat@example.com',
  };

  it('creates a friend request and emails an existing user', async () => {
    const send = vi.fn(async (_input: SendMailInput) => ({ id: 'email_1' }));
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      friend_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
      profiles: [createThenableQuery({ data: [matched], error: null })],
      friends: [createThenableQuery({ data: null, error: null })],
      friend_invitations: [
        createThenableQuery({ data: null, error: null }),
        createThenableQuery({ data: [{ id: 42 }], error: null }),
      ],
      notifications: [createThenableQuery({ data: [{ id: 1 }], error: null })],
    });

    await expect(sendFriendEmailInvite({
      inviterId: OWNER_ID,
      email: 'pat@example.com',
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_FRIEND_INVITE_RESULT);

    expect(adminFrom)
      .toHaveBeenCalledWith('friend_invitations');
    expect(adminFrom)
      .toHaveBeenCalledWith('notifications');
    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        to: 'pat@example.com',
        templateId: 'friend-request',
      }));
    expect(send.mock.calls[0]?.[0].html)
      .toContain('/friends');
  });

  it('emails a join link when no profile matches', async () => {
    const send = vi.fn(async (_input: SendMailInput) => ({ id: 'email_1' }));
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      friend_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
      profiles: [createThenableQuery({ data: [], error: null })],
    });

    await expect(sendFriendEmailInvite({
      inviterId: OWNER_ID,
      email: 'new.friend@example.com',
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_FRIEND_INVITE_RESULT);

    expect(adminFrom)
      .not
      .toHaveBeenCalledWith('friend_invitations');
    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        to: 'new.friend@example.com',
        templateId: 'friend-request',
      }));
    expect(send.mock.calls[0]?.[0].html)
      .toContain('https://app.gearcloset.io/');
    expect(send.mock.calls[0]?.[0].html)
      .not
      .toMatch(/account exists|don't have an account|sign up/i);
  });

  it('is a no-op when the email belongs to the current user', async () => {
    const send = vi.fn(async (_input: SendMailInput) => ({ id: 'email_1' }));
    const userFrom = queuedFrom({
      profiles: [createThenableQuery({ data: inviter, error: null })],
    });
    const adminFrom = queuedFrom({
      friend_invite_attempts: [
        createThenableQuery({ data: [], error: null }),
        createThenableQuery({ data: [{ id: 1 }], error: null }),
      ],
    });

    await expect(sendFriendEmailInvite({
      inviterId: OWNER_ID,
      email: 'owner@example.com',
      origin: 'https://app.gearcloset.io',
      userClient: asClient(createSupabaseMock({ from: userFrom })),
      admin: asClient(createSupabaseMock({ from: adminFrom })),
      send,
    }))
      .resolves
      .toEqual(GENERIC_FRIEND_INVITE_RESULT);

    expect(send)
      .not
      .toHaveBeenCalled();
  });
});
