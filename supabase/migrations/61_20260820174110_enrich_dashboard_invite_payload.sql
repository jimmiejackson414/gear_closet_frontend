-- Issue #52: embed trip name + inviter profile on dashboard invitations so
-- InvitationsWidget does not N+1 trips/profiles after get_dashboard_data.

CREATE OR REPLACE FUNCTION public.get_dashboard_data()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := (SELECT private.uid());
  trip_friends json;
  trips json;
  friends json;
BEGIN
  IF uid IS NULL THEN
    RETURN json_build_object(
      'trip_friends', '[]'::json,
      'trips', '[]'::json,
      'friends', '[]'::json
    );
  END IF;

  SELECT COALESCE(
    json_agg(
      row_to_json(tf.*)::jsonb || jsonb_build_object(
        'trip_name', t.name,
        'inviter_profile', CASE
          WHEN p.id IS NULL THEN NULL
          ELSE jsonb_build_object(
            'id', p.id,
            'email', p.email,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'trail_name', p.trail_name,
            'image', p.image
          )
        END
      )
    )::json,
    '[]'::json
  )
  INTO trip_friends
  FROM public.trip_friends tf
  LEFT JOIN public.trips t ON t.id = tf.trip_id
  LEFT JOIN public.profiles p ON p.id = tf.invited_by_id
  WHERE tf.profile_id = uid;

  SELECT COALESCE(json_agg(row_to_json(t.*)), '[]'::json)
  INTO trips
  FROM public.trips t
  WHERE t.starting_date >= now()
    AND (
      t.profile_id = uid
      OR EXISTS (
        SELECT 1
        FROM public.trip_friends tf
        WHERE tf.trip_id = t.id
          AND tf.profile_id = uid
          AND tf.status = 'ACCEPTED'::public.trip_friend_status
      )
    );

  SELECT COALESCE(json_agg(row_to_json(sub.*)), '[]'::json)
  INTO friends
  FROM (
    SELECT f.*, row_to_json(p.*) AS friend
    FROM public.friends f
    JOIN public.profiles p ON f.friend_id = p.id
    WHERE f.profile_id = uid
  ) sub;

  RETURN json_build_object(
    'trip_friends', trip_friends,
    'trips', trips,
    'friends', friends
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_data() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_dashboard_data() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_data() TO service_role;
