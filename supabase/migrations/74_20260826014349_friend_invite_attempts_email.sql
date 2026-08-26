-- Persist recipient email so the Friends Sent tab can list and resend
-- off-platform invites. Table remains service-role only (no client grants).

ALTER TABLE public.friend_invite_attempts
  ADD COLUMN email text;

COMMENT ON COLUMN public.friend_invite_attempts.email IS
  'Recipient email for this attempt; null on rows created before this column existed.';
