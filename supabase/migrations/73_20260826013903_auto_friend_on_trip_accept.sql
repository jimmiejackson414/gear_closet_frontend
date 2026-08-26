-- Accepting a trip invite also creates a bidirectional friends row with the
-- inviter. Covers dashboard accept, email claim, and signup auto-claim.

CREATE OR REPLACE FUNCTION private.ensure_friends_for_accepted_trip_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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

  INSERT INTO public.friends (profile_id, friend_id)
  VALUES
    (NEW.profile_id, NEW.invited_by_id),
    (NEW.invited_by_id, NEW.profile_id)
  ON CONFLICT (friend_id, profile_id) DO NOTHING;

  UPDATE public.friend_invitations
  SET
    status = 'ACCEPTED'::public.friend_request_status,
    request_responded_at = COALESCE(request_responded_at, now()),
    updated_at = now()
  WHERE status = 'PENDING'::public.friend_request_status
    AND (
      (sender_id = NEW.profile_id AND recipient_id = NEW.invited_by_id)
      OR (sender_id = NEW.invited_by_id AND recipient_id = NEW.profile_id)
    );

  RETURN NEW;
END;
$$;

ALTER FUNCTION private.ensure_friends_for_accepted_trip_member() OWNER TO postgres;

REVOKE ALL ON FUNCTION private.ensure_friends_for_accepted_trip_member() FROM PUBLIC;

DROP TRIGGER IF EXISTS trip_friends_ensure_friends ON public.trip_friends;
CREATE TRIGGER trip_friends_ensure_friends
  AFTER INSERT OR UPDATE OF status
  ON public.trip_friends
  FOR EACH ROW
  EXECUTE FUNCTION private.ensure_friends_for_accepted_trip_member();

-- Existing accepted trip members who were never added to Friends.
INSERT INTO public.friends (profile_id, friend_id)
SELECT tf.profile_id, tf.invited_by_id
FROM public.trip_friends tf
WHERE tf.status = 'ACCEPTED'::public.trip_friend_status
  AND tf.profile_id IS DISTINCT FROM tf.invited_by_id
UNION
SELECT tf.invited_by_id, tf.profile_id
FROM public.trip_friends tf
WHERE tf.status = 'ACCEPTED'::public.trip_friend_status
  AND tf.profile_id IS DISTINCT FROM tf.invited_by_id
ON CONFLICT (friend_id, profile_id) DO NOTHING;
