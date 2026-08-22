import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { renderTripInviteClaimEmail, renderTripInviteEmail } from '@/server/emails/templates';
import { sendMail, type SendMailInput } from '@/server/utils/mailer';
import { TripFriendStatus, TripInvitationStatus } from '@/types';
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
export const INVITE_TTL_DAYS = 14;
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

export type InviteTokenPair = {
  token: string;
  tokenHash: string;
};

export type SendExistingUserTripInvitesInput = {
  tripId: number;
  inviterId: string;
  emails: string[];
  origin: string;
  userClient: InviteClient;
  admin: InviteClient;
  send?: (input: SendMailInput) => Promise<{ id: string }>;
  createToken?: () => InviteTokenPair;
  now?: () => Date;
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

export { escapeHtml } from '@/server/emails/html';

export const hashInviteToken = (token: string) =>
  createHash('sha256')
    .update(token)
    .digest('hex');

export const createInviteToken = (): InviteTokenPair => {
  const token = randomBytes(32)
    .toString('base64url');
  return { token, tokenHash: hashInviteToken(token) };
};

export const inviteExpiresAt = (now = new Date(), days = INVITE_TTL_DAYS) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    .toISOString();

export const acceptUrlFromOrigin = (origin: string) => `${origin.replace(/\/$/, '')}/`;

export const claimUrlFromOrigin = (origin: string, token: string) => {
  const url = new URL('/invite/trip', `${origin.replace(/\/$/, '')}/`);
  url.searchParams.set('token', token);
  return url.toString();
};

export const buildTripInviteMessage = renderTripInviteEmail;

export const buildTripClaimInviteMessage = renderTripInviteClaimEmail;

const upsertPendingTripInvitation = async (input: {
  admin: InviteClient;
  tripId: number;
  email: string;
  inviterId: string;
  tokenHash: string;
  expiresAt: string;
}) => {
  const { data: existing } = await input.admin
    .from('trip_invitations')
    .select('id')
    .eq('trip_id', input.tripId)
    .eq('status', TripInvitationStatus.PENDING)
    .ilike('email', escapeIlike(input.email))
    .maybeSingle();

  if (existing?.id) {
    const { error } = await input.admin
      .from('trip_invitations')
      .update({
        token_hash: input.tokenHash,
        expires_at: input.expiresAt,
        invited_by_id: input.inviterId,
        updated_at: new Date()
          .toISOString(),
      })
      .eq('id', existing.id);
    return !error;
  }

  const { error } = await input.admin
    .from('trip_invitations')
    .insert({
      trip_id: input.tripId,
      email: input.email,
      invited_by_id: input.inviterId,
      token_hash: input.tokenHash,
      status: TripInvitationStatus.PENDING,
      expires_at: input.expiresAt,
    });

  if (!error) return true;
  if (!isUniqueViolation(error)) return false;

  const { data: raced } = await input.admin
    .from('trip_invitations')
    .select('id')
    .eq('trip_id', input.tripId)
    .eq('status', TripInvitationStatus.PENDING)
    .ilike('email', escapeIlike(input.email))
    .maybeSingle();

  if (!raced?.id) return false;

  const { error: updateError } = await input.admin
    .from('trip_invitations')
    .update({
      token_hash: input.tokenHash,
      expires_at: input.expiresAt,
      invited_by_id: input.inviterId,
      updated_at: new Date()
        .toISOString(),
    })
    .eq('id', raced.id);

  return !updateError;
};

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
  const createToken = input.createToken ?? createInviteToken;
  const now = input.now ?? (() => new Date());
  const existingUserMessage = buildTripInviteMessage({ inviterName, tripName, acceptUrl });

  for (const email of input.emails) {
    try {
      const { data: matches } = await input.admin
        .from('profiles')
        .select('id, email, first_name, last_name, trail_name')
        .ilike('email', escapeIlike(email))
        .limit(1);

      const profile = (matches?.[0] ?? null) as InviteProfile | null;
      if (profile?.id === input.inviterId) continue;

      if (profile) {
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
          subject: existingUserMessage.subject,
          html: existingUserMessage.html,
          text: existingUserMessage.text,
          templateId: existingUserMessage.templateId,
        });
        continue;
      }

      const { token, tokenHash } = createToken();
      const saved = await upsertPendingTripInvitation({
        admin: input.admin,
        tripId: input.tripId,
        email,
        inviterId: input.inviterId,
        tokenHash,
        expiresAt: inviteExpiresAt(now()),
      });
      if (!saved) continue;

      const claimMessage = buildTripClaimInviteMessage({
        inviterName,
        tripName,
        claimUrl: claimUrlFromOrigin(input.origin, token),
      });
      await mail({
        to: email,
        subject: claimMessage.subject,
        html: claimMessage.html,
        text: claimMessage.text,
        templateId: claimMessage.templateId,
      });
    } catch {
      // Keep a generic success even if lookup, insert, or mail fails for one address.
    }
  }

  return GENERIC_INVITE_RESULT;
};
