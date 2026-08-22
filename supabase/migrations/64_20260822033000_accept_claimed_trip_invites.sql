-- Issue #64: claiming an email invite is accepting it, so Planning can open
-- the trip after register/login/onboarding. Signup auto-claim used PENDING.

CREATE OR REPLACE FUNCTION private.claim_pending_trip_invitations_by_email(
  p_profile_id uuid,
  p_email text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  invite record;
BEGIN
  IF p_profile_id IS NULL OR p_email IS NULL OR length(trim(p_email)) = 0 THEN
    RETURN;
  END IF;

  FOR invite IN
    SELECT ti.id, ti.trip_id, ti.invited_by_id
    FROM public.trip_invitations ti
    WHERE lower(ti.email) = lower(p_email)
      AND ti.status = 'PENDING'::public.trip_invitation_status
      AND ti.expires_at > now()
  LOOP
    INSERT INTO public.trip_friends (
      trip_id,
      profile_id,
      status,
      invited_by_id,
      accepted_invite_on
    )
    VALUES (
      invite.trip_id,
      p_profile_id,
      'ACCEPTED'::public.trip_friend_status,
      invite.invited_by_id,
      now()
    )
    ON CONFLICT (trip_id, profile_id) DO UPDATE SET
      status = 'ACCEPTED'::public.trip_friend_status,
      accepted_invite_on = COALESCE(public.trip_friends.accepted_invite_on, now()),
      updated_at = now()
    WHERE public.trip_friends.status <> 'DECLINED'::public.trip_friend_status;

    UPDATE public.trip_invitations
    SET
      status = 'CLAIMED'::public.trip_invitation_status,
      claimed_profile_id = p_profile_id,
      updated_at = now()
    WHERE id = invite.id
      AND status = 'PENDING'::public.trip_invitation_status;

    INSERT INTO public.notifications (title, content, read_on_date, profile_id, sender_id)
    VALUES (
      'You''ve been invited to a trip!',
      'You were invited to a trip on Gear Closet.',
      NULL,
      p_profile_id,
      invite.invited_by_id
    );
  END LOOP;
END;
$$;

ALTER FUNCTION private.claim_pending_trip_invitations_by_email(uuid, text) OWNER TO postgres;

REVOKE ALL ON FUNCTION private.claim_pending_trip_invitations_by_email(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.claim_pending_trip_invitations_by_email(uuid, text)
  TO postgres, service_role;
