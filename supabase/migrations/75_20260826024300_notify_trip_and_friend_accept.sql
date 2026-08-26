-- In-app notifications when a trip invite is accepted (inviter) or a friend
-- request is accepted (original sender). Covers dashboard accept, email claim,
-- signup auto-claim, and Friends-page accept.

CREATE OR REPLACE FUNCTION private.profile_display_name (p_profile_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    NULLIF(trim(both from concat_ws(' ', p.first_name, p.last_name)), ''),
    NULLIF(trim(both from p.trail_name), ''),
    p.email,
    'Someone'
  )
  FROM public.profiles p
  WHERE p.id = p_profile_id;
$$;

ALTER FUNCTION private.profile_display_name (uuid) OWNER TO postgres;

REVOKE ALL ON FUNCTION private.profile_display_name (uuid) FROM PUBLIC;

CREATE OR REPLACE FUNCTION private.notify_trip_invite_accepted ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  acceptor_name text;
  trip_name text;
BEGIN
  IF NEW.status IS DISTINCT FROM 'ACCEPTED'::public.trip_friend_status THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
    AND OLD.status = 'ACCEPTED'::public.trip_friend_status THEN
    RETURN NEW;
  END IF;

  IF NEW.profile_id IS NULL
    OR NEW.invited_by_id IS NULL
    OR NEW.profile_id = NEW.invited_by_id THEN
    RETURN NEW;
  END IF;

  acceptor_name := COALESCE(private.profile_display_name(NEW.profile_id), 'Someone');

  SELECT NULLIF(trim(both from t.name), '')
  INTO trip_name
  FROM public.trips t
  WHERE t.id = NEW.trip_id;

  INSERT INTO public.notifications (title, content, read_on_date, profile_id, sender_id)
  VALUES (
    'Trip invite accepted',
    CASE
      WHEN trip_name IS NULL THEN
        acceptor_name || ' accepted your trip invite.'
      ELSE
        acceptor_name || ' accepted your invite to ' || trip_name || '.'
    END,
    NULL,
    NEW.invited_by_id,
    NEW.profile_id
  );

  RETURN NEW;
END;
$$;

ALTER FUNCTION private.notify_trip_invite_accepted () OWNER TO postgres;

REVOKE ALL ON FUNCTION private.notify_trip_invite_accepted () FROM PUBLIC;

DROP TRIGGER IF EXISTS trip_friends_notify_accepted ON public.trip_friends;
CREATE TRIGGER trip_friends_notify_accepted
  AFTER INSERT OR UPDATE OF status
  ON public.trip_friends
  FOR EACH ROW
  WHEN (NEW.status = 'ACCEPTED'::public.trip_friend_status)
  EXECUTE FUNCTION private.notify_trip_invite_accepted();

CREATE OR REPLACE FUNCTION private.notify_friend_request_accepted ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recipient_name text;
BEGIN
  IF NEW.status IS DISTINCT FROM 'ACCEPTED'::public.friend_request_status THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
    AND OLD.status IS DISTINCT FROM 'PENDING'::public.friend_request_status THEN
    RETURN NEW;
  END IF;

  IF NEW.sender_id IS NULL
    OR NEW.recipient_id IS NULL
    OR NEW.sender_id = NEW.recipient_id THEN
    RETURN NEW;
  END IF;

  recipient_name := COALESCE(private.profile_display_name(NEW.recipient_id), 'Someone');

  INSERT INTO public.notifications (title, content, read_on_date, profile_id, sender_id)
  VALUES (
    'Friend request accepted',
    recipient_name || ' accepted your friend request.',
    NULL,
    NEW.sender_id,
    NEW.recipient_id
  );

  RETURN NEW;
END;
$$;

ALTER FUNCTION private.notify_friend_request_accepted () OWNER TO postgres;

REVOKE ALL ON FUNCTION private.notify_friend_request_accepted () FROM PUBLIC;

DROP TRIGGER IF EXISTS friend_invitations_notify_accepted ON public.friend_invitations;
CREATE TRIGGER friend_invitations_notify_accepted
  AFTER UPDATE OF status
  ON public.friend_invitations
  FOR EACH ROW
  WHEN (
    NEW.status = 'ACCEPTED'::public.friend_request_status
    AND OLD.status IS DISTINCT FROM NEW.status
  )
  EXECUTE FUNCTION private.notify_friend_request_accepted();
