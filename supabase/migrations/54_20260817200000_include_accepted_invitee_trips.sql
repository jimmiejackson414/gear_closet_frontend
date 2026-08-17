-- Issue #59: planning/dashboard RPCs listed only owned trips, so accepting an
-- invite was a dead end. Include ACCEPTED trip_friends trips, allow loading
-- that trip's nested rows, and scope the friends widget to the selected trip.

CREATE OR REPLACE FUNCTION private.has_accepted_trip_invite(p_trip_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trip_friends tf
    WHERE tf.trip_id = p_trip_id
      AND tf.profile_id = (SELECT private.uid())
      AND tf.status = 'ACCEPTED'::public.trip_friend_status
  );
$$;

CREATE OR REPLACE FUNCTION private.can_access_planning_trip(p_trip_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.owns_trip(p_trip_id) OR private.has_accepted_trip_invite(p_trip_id);
$$;

REVOKE ALL ON FUNCTION private.has_accepted_trip_invite(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.can_access_planning_trip(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_accepted_trip_invite(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_planning_trip(bigint) TO anon, authenticated;

CREATE INDEX IF NOT EXISTS trip_friends_accepted_profile_idx
  ON public.trip_friends (profile_id, trip_id)
  WHERE status = 'ACCEPTED';

-- ---------------------------------------------------------------------------
-- Dashboard upcoming trips: owned + accepted invites
-- ---------------------------------------------------------------------------
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

  SELECT COALESCE(json_agg(row_to_json(tf.*)), '[]'::json)
  INTO trip_friends
  FROM public.trip_friends tf
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

-- ---------------------------------------------------------------------------
-- Planning: owned trips + accepted invites; nested rows for accessible trips
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_planning_page_data(p_trip_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
  DECLARE
    uid uuid := (SELECT private.uid());
    trips_data JSON;
    trip_packs_data JSON;
    trip_details_data JSON;
    todos_data JSON;
    shopping_items_data JSON;
    friends_data JSON;
    poll_data JSON;
    dynamic_trip_id BIGINT;
    trip_owner_id uuid;
  BEGIN
    IF uid IS NULL THEN
      RETURN jsonb_build_object(
        'trips', '[]'::json,
        'pack', '[]'::json,
        'trip_details', '[]'::json,
        'todos', '[]'::json,
        'shopping_items', '[]'::json,
        'friends', '[]'::json,
        'poll', null
      );
    END IF;

    SELECT json_agg(row_to_json(sub.*)) INTO trips_data
    FROM (
      SELECT t.*
      FROM public.trips t
      WHERE t.profile_id = uid
        OR EXISTS (
          SELECT 1
          FROM public.trip_friends tf
          WHERE tf.trip_id = t.id
            AND tf.profile_id = uid
            AND tf.status = 'ACCEPTED'::public.trip_friend_status
        )
      ORDER BY (t.profile_id = uid) DESC, t.locked_at NULLS FIRST, t.created_at ASC
    ) sub;

    IF p_trip_id = 0 THEN
      SELECT COALESCE((
        SELECT t.id
        FROM public.trips t
        WHERE t.profile_id = uid
          OR EXISTS (
            SELECT 1
            FROM public.trip_friends tf
            WHERE tf.trip_id = t.id
              AND tf.profile_id = uid
              AND tf.status = 'ACCEPTED'::public.trip_friend_status
          )
        ORDER BY (t.profile_id = uid) DESC, t.locked_at NULLS FIRST, t.created_at ASC
        LIMIT 1
      ), 0) INTO dynamic_trip_id;
    ELSE
      dynamic_trip_id := p_trip_id;
    END IF;

    IF dynamic_trip_id <> 0 AND NOT private.can_access_planning_trip(dynamic_trip_id) THEN
      dynamic_trip_id := 0;
    END IF;

    SELECT t.profile_id INTO trip_owner_id
    FROM public.trips t
    WHERE t.id = dynamic_trip_id;

    SELECT (COALESCE(json_agg(
      json_build_object(
        'id', pack.id,
        'name', pack.name,
        'slug', pack.slug,
        'created_at', pack.created_at,
        'updated_at', pack.updated_at,
        'profile_id', pack.profile_id,
        'theme', pack.theme,
        'private', pack.private,
        'allow_comments', pack.allow_comments,
        'locked_at', pack.locked_at,
        'categories', (
          SELECT COALESCE(json_agg(json_build_object(
            'id', c.id,
            'created_at', c.created_at,
            'name', c.name,
            'unit', c.unit,
            'slug', c.slug,
            'pack_id', c.pack_id,
            'updated_at', c.updated_at,
            'category_items', (
              SELECT COALESCE(json_agg(json_build_object(
                'id', ci.id,
                'category_id', ci.category_id,
                'item_id', ci.item_id,
                'position', ci.position,
                'created_at', ci.created_at,
                'updated_at', ci.updated_at,
                'item', row_to_json(i.*)
              )), '[]'::JSON)
              FROM public.category_items ci
              JOIN public.items i ON ci.item_id = i.id
              WHERE ci.category_id = c.id
            )
          )), '[]'::JSON)
          FROM public.categories c
          WHERE c.pack_id = pack.id
        )
      )
    ), '[]'::JSON) -> 0) INTO trip_packs_data
    FROM public.trip_packs tp
    JOIN public.packs pack ON tp.pack_id = pack.id
    WHERE dynamic_trip_id <> 0
      AND tp.trip_id = dynamic_trip_id
      AND tp.profile_id = trip_owner_id;

    SELECT COALESCE(json_agg(row_to_json(td.*)), '[]'::JSON) INTO trip_details_data
    FROM public.trip_details td
    WHERE td.trip_id = dynamic_trip_id;

    SELECT COALESCE(json_agg(row_to_json(todo.*)), '[]'::JSON) INTO todos_data
    FROM public.todos todo
    WHERE todo.trip_id = dynamic_trip_id;

    SELECT COALESCE(json_agg(row_to_json(si.*)), '[]'::JSON) INTO shopping_items_data
    FROM public.shopping_list_items si
    WHERE si.trip_id = dynamic_trip_id;

    SELECT COALESCE(json_agg(json_build_object(
      'id', tf.id,
      'trip_id', tf.trip_id,
      'profile_id', tf.profile_id,
      'invited_by_id', tf.invited_by_id,
      'status', tf.status,
      'accepted_invite_on', tf.accepted_invite_on,
      'created_at', tf.created_at,
      'updated_at', tf.updated_at,
      'friend_profile', row_to_json(p.*),
      'friend_trip_packs', (
        SELECT COALESCE(json_agg(row_to_json(tp.*)), '[]'::JSON)
        FROM public.trip_packs tp
        WHERE tp.profile_id = tf.profile_id
          AND tp.trip_id = dynamic_trip_id
      )
    )), '[]'::JSON) INTO friends_data
    FROM public.trip_friends tf
    JOIN public.profiles p ON tf.profile_id = p.id
    WHERE dynamic_trip_id <> 0
      AND tf.trip_id = dynamic_trip_id;

    SELECT json_build_object(
      'id', p.id::integer,
      'trip_id', p.trip_id::integer,
      'profile_id', p.profile_id::uuid,
      'question', (SELECT row_to_json(q.*) FROM public.questions q WHERE q.poll_id = p.id),
      'answers', COALESCE((SELECT json_agg(row_to_json(a.*)) FROM public.answers a WHERE a.question_id = q.id), '[]'),
      'votes', COALESCE((SELECT json_agg(row_to_json(pa.*)) FROM public.profile_answers pa WHERE pa.poll_id = p.id), '[]')
    ) INTO poll_data
    FROM public.polls p
    JOIN public.questions q ON p.id = q.poll_id
    WHERE p.trip_id = dynamic_trip_id
    LIMIT 1;

    RETURN jsonb_build_object(
      'trips', trips_data,
      'pack', trip_packs_data,
      'trip_details', trip_details_data,
      'todos', todos_data,
      'shopping_items', shopping_items_data,
      'friends', friends_data,
      'poll', poll_data
    );
  END;
$$;

REVOKE ALL ON FUNCTION public.get_planning_page_data(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_planning_page_data(bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_planning_page_data(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_planning_page_data(bigint) TO service_role;
