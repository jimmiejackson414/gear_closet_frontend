import { renderFriendRequestEmail } from '@/server/emails/templates';
import { sendMail, type SendMailInput } from '@/server/utils/mailer';
import {
  acceptUrlFromOrigin,
  escapeIlike,
  INVITE_RATE_WINDOW_MS,
  InviteError,
  isInviteRateLimited,
  isUniqueViolation,
  MAX_INVITE_EMAILS_PER_HOUR,
  sumAttemptCounts,
} from '@/server/utils/tripInvites';
import { FriendRequestStatus } from '@/types';
import { friendlyUsername } from '@/utils/displayName';
import { parseFriendSearchEmail } from '@/utils/friendsSearch';
import { NotificationKind } from '@/utils/notifications';
import type { Database } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const GENERIC_FRIEND_INVITE_RESULT = { ok: true as const };

type InviteClient = SupabaseClient<Database>;

export type SendFriendEmailInviteInput = {
  inviterId: string;
  email: string;
  origin: string;
  userClient: InviteClient;
  admin: InviteClient;
  send?: (input: SendMailInput) => Promise<{ id: string }>;
};

export const parseFriendInviteBody = (body: unknown) => {
  if (!body || typeof body !== 'object' || !('email' in body)) {
    return { error: 'Enter a valid email address.' };
  }

  const email = parseFriendSearchEmail((body as { email: unknown }).email as string);
  if (!email) {
    return { error: 'Enter a valid email address.' };
  }

  return { email };
};

export const friendsUrlFromOrigin = (origin: string) =>
  `${origin.replace(/\/$/, '')}/friends`;

export const sendFriendEmailInvite = async (input: SendFriendEmailInviteInput) => {
  const windowStart = new Date(Date.now() - INVITE_RATE_WINDOW_MS)
    .toISOString();

  const { data: attempts, error: attemptsError } = await input.admin
    .from('friend_invite_attempts')
    .select('email_count')
    .eq('profile_id', input.inviterId)
    .gte('created_at', windowStart);

  if (attemptsError) {
    throw new InviteError('Unable to send invites', 500);
  }

  if (isInviteRateLimited(sumAttemptCounts(attempts ?? []), 1, MAX_INVITE_EMAILS_PER_HOUR)) {
    throw new InviteError('Too many invites. Try again later.', 429);
  }

  const { error: insertError } = await input.admin.from('friend_invite_attempts')
    .insert({
      profile_id: input.inviterId,
      email_count: 1,
    });

  if (insertError) {
    throw new InviteError('Unable to send invites', 500);
  }

  const { data: inviter } = await input.userClient
    .from('profiles')
    .select('first_name, last_name, email, trail_name')
    .eq('id', input.inviterId)
    .maybeSingle();

  if (inviter?.email?.trim()
    .toLowerCase() === input.email) {
    return GENERIC_FRIEND_INVITE_RESULT;
  }

  const inviterName = friendlyUsername(inviter) || 'A Gear Closet user';
  const mail = input.send ?? sendMail;

  const { data: matches } = await input.admin
    .from('profiles')
    .select('id, email')
    .ilike('email', escapeIlike(input.email))
    .limit(1);

  const profile = matches?.[0] ?? null;
  if (profile?.id === input.inviterId) {
    return GENERIC_FRIEND_INVITE_RESULT;
  }

  if (profile) {
    const { data: friendship } = await input.admin
      .from('friends')
      .select('id')
      .eq('profile_id', input.inviterId)
      .eq('friend_id', profile.id)
      .maybeSingle();

    if (friendship?.id) {
      return GENERIC_FRIEND_INVITE_RESULT;
    }

    const { data: pending } = await input.admin
      .from('friend_invitations')
      .select('id')
      .eq('sender_id', input.inviterId)
      .eq('recipient_id', profile.id)
      .eq('status', FriendRequestStatus.PENDING)
      .maybeSingle();

    if (!pending?.id) {
      const { error: insertError } = await input.admin
        .from('friend_invitations')
        .insert({
          sender_id: input.inviterId,
          recipient_id: profile.id,
          status: FriendRequestStatus.PENDING,
        });

      if (insertError && !isUniqueViolation(insertError)) {
        throw new InviteError('Unable to send invites', 500);
      }

      await input.admin.from('notifications')
        .insert({
          title: NotificationKind.FRIEND_REQUEST,
          content: `You have a new friend request from ${inviterName}.`,
          read_on_date: null,
          profile_id: profile.id,
          sender_id: input.inviterId,
        });
    }

    const message = renderFriendRequestEmail({
      senderName: inviterName,
      actionUrl: friendsUrlFromOrigin(input.origin),
    });
    await mail({
      to: input.email,
      subject: message.subject,
      html: message.html,
      text: message.text,
      templateId: message.templateId,
    });

    return GENERIC_FRIEND_INVITE_RESULT;
  }

  const message = renderFriendRequestEmail({
    senderName: inviterName,
    actionUrl: acceptUrlFromOrigin(input.origin),
  });
  await mail({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    templateId: message.templateId,
  });

  return GENERIC_FRIEND_INVITE_RESULT;
};
