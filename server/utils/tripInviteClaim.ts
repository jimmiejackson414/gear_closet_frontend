import { hashInviteToken, isUniqueViolation } from '@/server/utils/tripInvites';
import { TripFriendStatus, TripInvitationStatus } from '@/types';
import { friendlyUsername } from '@/utils/displayName';
import { NotificationKind } from '@/utils/notifications';
import type { Database } from '@/types';
import type { TripInviteClaimResult, TripInvitePreview } from '@/types/planning';
import type { SupabaseClient } from '@supabase/supabase-js';

type InviteClient = SupabaseClient<Database>;

const MAX_TOKEN_LENGTH = 200;

type InvitationRow = {
  id: number;
  email: string;
  status: Database['public']['Enums']['trip_invitation_status'];
  expires_at: string;
  claimed_profile_id: string | null;
  trip_id: number;
  invited_by_id: string;
};

export const normalizeInviteToken = (raw: unknown) => {
  if (typeof raw !== 'string') return null;
  const token = raw.trim();
  if (!token || token.length > MAX_TOKEN_LENGTH) return null;
  return token;
};

const loadInvitationByToken = async (admin: InviteClient, token: string) => {
  const { data } = await admin
    .from('trip_invitations')
    .select('id, email, status, expires_at, claimed_profile_id, trip_id, invited_by_id')
    .eq('token_hash', hashInviteToken(token))
    .maybeSingle();

  return (data ?? null) as InvitationRow | null;
};

const invitationState = (invite: InvitationRow, now: Date): 'ok' | 'expired' | 'used' => {
  if (invite.status === TripInvitationStatus.CLAIMED || invite.status === TripInvitationStatus.CANCELED) {
    return 'used';
  }
  if (new Date(invite.expires_at)
    .getTime() <= now.getTime()) {
    return 'expired';
  }
  return 'ok';
};

const tripSummary = async (admin: InviteClient, invite: InvitationRow) => {
  const { data: trip } = await admin
    .from('trips')
    .select('name')
    .eq('id', invite.trip_id)
    .maybeSingle();

  const { data: inviter } = await admin
    .from('profiles')
    .select('first_name, last_name, email, trail_name')
    .eq('id', invite.invited_by_id)
    .maybeSingle();

  return {
    tripName: trip?.name?.trim() || 'a trip',
    inviterName: friendlyUsername(inviter) || 'A Gear Closet user',
  };
};

export const previewTripInvite = async (
  admin: InviteClient,
  token: string,
  now = new Date(),
): Promise<TripInvitePreview> => {
  const invite = await loadInvitationByToken(admin, token);
  if (!invite) return { status: 'invalid' };

  const state = invitationState(invite, now);
  if (state !== 'ok') return { status: state };

  const summary = await tripSummary(admin, invite);
  return { status: 'ok', ...summary };
};

export const claimTripInvite = async (input: {
  admin: InviteClient;
  userId: string;
  userEmail: string | null | undefined;
  token: string;
  now?: Date;
}): Promise<TripInviteClaimResult> => {
  const now = input.now ?? new Date();
  const invite = await loadInvitationByToken(input.admin, input.token);
  if (!invite) return { ok: false, reason: 'invalid' };

  if (invite.claimed_profile_id === input.userId) {
    return { ok: true, alreadyClaimed: true };
  }

  const state = invitationState(invite, now);
  if (state !== 'ok') return { ok: false, reason: state };

  const userEmail = input.userEmail?.trim()
    .toLowerCase();
  if (!userEmail || userEmail !== invite.email.trim()
    .toLowerCase()) {
    return { ok: false, reason: 'email_mismatch' };
  }

  const { data: inserted, error: insertError } = await input.admin
    .from('trip_friends')
    .insert({
      trip_id: invite.trip_id,
      profile_id: input.userId,
      status: TripFriendStatus.PENDING,
      invited_by_id: invite.invited_by_id,
    })
    .select('id');

  if (insertError && !isUniqueViolation(insertError)) {
    return { ok: false, reason: 'invalid' };
  }

  if (!insertError && inserted?.length) {
    const summary = await tripSummary(input.admin, invite);
    await input.admin.from('notifications')
      .insert({
        title: NotificationKind.TRIP_INVITE,
        content: `${summary.inviterName} invited you to a trip!`,
        read_on_date: null,
        profile_id: input.userId,
        sender_id: invite.invited_by_id,
      });
  }

  const { data: consumed, error: consumeError } = await input.admin
    .from('trip_invitations')
    .update({
      status: TripInvitationStatus.CLAIMED,
      claimed_profile_id: input.userId,
      updated_at: now.toISOString(),
    })
    .eq('id', invite.id)
    .eq('status', TripInvitationStatus.PENDING)
    .select('id')
    .maybeSingle();

  if (consumeError) return { ok: false, reason: 'invalid' };
  if (!consumed) {
    const latest = await loadInvitationByToken(input.admin, input.token);
    if (latest?.claimed_profile_id === input.userId) {
      return { ok: true, alreadyClaimed: true };
    }
    return { ok: false, reason: 'used' };
  }

  return { ok: true };
};
