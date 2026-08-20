import { z } from 'zod';
import { sendMail, type SendMailInput } from '@/server/utils/mailer';
import { TripFriendStatus } from '@/types';
import { friendlyUsername } from '@/utils/displayName';
import { NotificationKind } from '@/utils/notifications';
import type { Database } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export class InviteError extends Error {
  statusCode: number;

  constructor (message: string, statusCode = 500) {
    super(message);
    this.name = 'InviteError';
    this.statusCode = statusCode;
  }
}

export const MAX_EMAILS_PER_REQUEST = 10;
export const MAX_INVITE_EMAILS_PER_HOUR = 20;
export const INVITE_RATE_WINDOW_MS = 60 * 60 * 1000;
export const GENERIC_INVITE_RESULT = { ok: true as const };

const emailSchema = z.string()
  .trim()
  .email();

type InviteClient = SupabaseClient<Database>;

type InviteProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  trail_name: string | null;
};

export type SendExistingUserTripInvitesInput = {
  tripId: number;
  inviterId: string;
  emails: string[];
  origin: string;
  userClient: InviteClient;
  admin: InviteClient;
  send?: (input: SendMailInput) => Promise<{ id: string }>;
};

export const escapeIlike = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');

export const isUniqueViolation = (error: { code?: string } | null | undefined) =>
  error?.code === '23505';

export const sumAttemptCounts = (
  rows: Array<{ email_count: number | null; trip_id?: number | null }>,
  tripId?: number,
) =>
  rows.reduce((sum, row) => {
    if (tripId != null && row.trip_id !== tripId) return sum;
    return sum + (row.email_count ?? 0);
  }, 0);

export const isInviteRateLimited = (
  sentInWindow: number,
  incomingCount: number,
  max = MAX_INVITE_EMAILS_PER_HOUR,
) => sentInWindow + incomingCount > max;

export const parseInviteEmailsBody = (body: unknown) => {
  if (!body || typeof body !== 'object' || !('emails' in body)) {
    return { error: 'Enter at least one email address.' };
  }

  const emailsRaw = (body as { emails: unknown }).emails;
  if (!Array.isArray(emailsRaw) || emailsRaw.length === 0) {
    return { error: 'Enter at least one email address.' };
  }
  if (emailsRaw.length > MAX_EMAILS_PER_REQUEST) {
    return { error: 'Too many email addresses in one invite.' };
  }

  const emails: string[] = [];
  const seen = new Set<string>();
  for (const raw of emailsRaw) {
    if (typeof raw !== 'string') {
      return { error: 'Enter a valid email address.' };
    }
    const parsed = emailSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: 'Enter a valid email address.' };
    }
    const email = parsed.data.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }

  return { emails };
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const buildTripInviteMessage = (input: {
  inviterName: string;
  tripName: string;
  acceptUrl: string;
}) => {
  const subject = `${input.inviterName} invited you to a trip`;
  const text = `${input.inviterName} invited you to ${input.tripName} on Gear Closet. Open ${input.acceptUrl} to accept from your dashboard.`;
  const html = `<p>${escapeHtml(input.inviterName)} invited you to <strong>${escapeHtml(input.tripName)}</strong> on Gear Closet.</p><p><a href="${escapeHtml(input.acceptUrl)}">View invitation</a></p>`;
  return {
    subject,
    text,
    html,
    templateId: 'trip-invite',
  };
};

const acceptUrlFromOrigin = (origin: string) => `${origin.replace(/\/$/, '')}/`;

export const sendExistingUserTripInvites = async (
  input: SendExistingUserTripInvitesInput,
) => {
  const { data: trip, error: tripError } = await input.userClient
    .from('trips')
    .select('id, name, profile_id')
    .eq('id', input.tripId)
    .maybeSingle();

  if (tripError) {
    throw new InviteError('Unable to send invites', 500);
  }
  if (!trip) {
    throw new InviteError('Not found', 404);
  }
  if (trip.profile_id !== input.inviterId) {
    throw new InviteError('Forbidden', 403);
  }

  const windowStart = new Date(Date.now() - INVITE_RATE_WINDOW_MS)
    .toISOString();

  const { data: attempts, error: attemptsError } = await input.admin
    .from('trip_invite_attempts')
    .select('email_count, trip_id')
    .eq('profile_id', input.inviterId)
    .gte('created_at', windowStart);

  if (attemptsError) {
    throw new InviteError('Unable to send invites', 500);
  }

  const rows = attempts ?? [];
  if (
    isInviteRateLimited(sumAttemptCounts(rows), input.emails.length)
    || isInviteRateLimited(sumAttemptCounts(rows, input.tripId), input.emails.length)
  ) {
    throw new InviteError('Too many invites. Try again later.', 429);
  }

  await input.admin.from('trip_invite_attempts')
    .insert({
      profile_id: input.inviterId,
      trip_id: input.tripId,
      email_count: input.emails.length,
    });

  const { data: inviter } = await input.userClient
    .from('profiles')
    .select('first_name, last_name, email, trail_name')
    .eq('id', input.inviterId)
    .maybeSingle();

  const inviterName = friendlyUsername(inviter) || 'A Gear Closet user';
  const tripName = trip.name?.trim() || 'a trip';
  const acceptUrl = acceptUrlFromOrigin(input.origin);
  const mail = input.send ?? sendMail;
  const message = buildTripInviteMessage({ inviterName, tripName, acceptUrl });

  for (const email of input.emails) {
    try {
      const { data: matches } = await input.admin
        .from('profiles')
        .select('id, email, first_name, last_name, trail_name')
        .ilike('email', escapeIlike(email))
        .limit(1);

      const profile = (matches?.[0] ?? null) as InviteProfile | null;
      if (!profile || profile.id === input.inviterId) continue;

      const { data: inserted, error: insertError } = await input.admin
        .from('trip_friends')
        .insert({
          trip_id: input.tripId,
          profile_id: profile.id,
          status: TripFriendStatus.PENDING,
          invited_by_id: input.inviterId,
        })
        .select('id');

      if (isUniqueViolation(insertError) || insertError || !inserted?.length) continue;

      await input.admin.from('notifications')
        .insert({
          title: NotificationKind.TRIP_INVITE,
          content: `${inviterName} invited you to a trip!`,
          read_on_date: null,
          profile_id: profile.id,
          sender_id: input.inviterId,
        });

      await mail({
        to: email,
        subject: message.subject,
        html: message.html,
        text: message.text,
        templateId: message.templateId,
      });
    } catch {
      // Keep a generic success even if lookup, insert, or mail fails for one address.
    }
  }

  return GENERIC_INVITE_RESULT;
};
