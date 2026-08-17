-- Issue #79: get_dashboard_data(p_user_id) is SECURITY DEFINER and filtered by
-- the caller-supplied UUID, so any authenticated user could RPC another profile
-- and read their trips/friends/invites.
--
-- Drop the argument and key off private.uid() (auth.uid()). Also close the same
-- class of hole on get_planning_page_data / get_closet_page_data: lists already
-- used auth.uid(), but nested rows trusted p_trip_id / p_pack_id. Invitee trip
-- access remains issue #59 (private.can_read_trip).

-- ---------------------------------------------------------------------------
-- Dashboard: session user only
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_dashboard_data(uuid);

CREATE FUNCTION public.get_dashboard_data()
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
  WHERE t.profile_id = uid
    AND t.starting_date >= now();

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
-- Planning: ignore p_trip_id unless the session user owns that trip
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_planning_page_data(p_trip_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  DECLARE
    trips_data JSON;
    trip_packs_data JSON;
    trip_details_data JSON;
    todos_data JSON;
    shopping_items_data JSON;
    friends_data JSON;
    poll_data JSON;
    dynamic_trip_id BIGINT;
  BEGIN
    SELECT json_agg(row_to_json(sub.*)) INTO trips_data
    FROM (
      SELECT * FROM trips t
      WHERE t.profile_id = auth.uid()
      ORDER BY t.locked_at NULLS FIRST, t.created_at ASC
    ) sub;

    IF p_trip_id = 0 THEN
      SELECT COALESCE((
        SELECT t.id FROM trips t
        WHERE t.profile_id = auth.uid()
        ORDER BY t.locked_at NULLS FIRST, t.created_at ASC
        LIMIT 1
      ), 0) INTO dynamic_trip_id;
    ELSE
      dynamic_trip_id := p_trip_id;
    END IF;

    IF dynamic_trip_id <> 0 AND NOT private.owns_trip(dynamic_trip_id) THEN
      dynamic_trip_id := 0;
    END IF;

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
              FROM category_items ci
              JOIN items i ON ci.item_id = i.id
              WHERE ci.category_id = c.id
            )
          )), '[]'::JSON)
          FROM categories c
          WHERE c.pack_id = pack.id
        )
      )
    ), '[]'::JSON) -> 0) INTO trip_packs_data
    FROM trip_packs tp
    JOIN packs pack ON tp.pack_id = pack.id
    WHERE tp.profile_id = auth.uid()
      AND (p_trip_id = 0 OR tp.trip_id = dynamic_trip_id);

    SELECT COALESCE(json_agg(row_to_json(td.*)), '[]'::JSON) INTO trip_details_data
    FROM trip_details td
    WHERE td.trip_id = dynamic_trip_id;

    SELECT COALESCE(json_agg(row_to_json(todo.*)), '[]'::JSON) INTO todos_data
    FROM todos todo
    WHERE todo.trip_id = dynamic_trip_id;

    SELECT COALESCE(json_agg(row_to_json(si.*)), '[]'::JSON) INTO shopping_items_data
    FROM shopping_list_items si
    WHERE si.trip_id = dynamic_trip_id;

    SELECT COALESCE(json_agg(json_build_object(
      'friend_profile', row_to_json(p.*),
      'friend_trip_packs', (
        SELECT COALESCE(json_agg(row_to_json(tp.*)), '[]'::JSON)
        FROM trip_packs tp
        WHERE tp.profile_id = tf.profile_id
          AND (p_trip_id = 0 OR tp.trip_id = dynamic_trip_id)
      )
    )), '[]'::JSON) INTO friends_data
    FROM trip_friends tf
    JOIN profiles p ON tf.profile_id = p.id
    WHERE tf.invited_by_id = auth.uid();

    SELECT json_build_object(
      'id', p.id::integer,
      'trip_id', p.trip_id::integer,
      'profile_id', p.profile_id::uuid,
      'question', (SELECT row_to_json(q.*) FROM questions q WHERE q.poll_id = p.id),
      'answers', COALESCE((SELECT json_agg(row_to_json(a.*)) FROM answers a WHERE a.question_id = q.id), '[]'),
      'votes', COALESCE((SELECT json_agg(row_to_json(pa.*)) FROM profile_answers pa WHERE pa.poll_id = p.id), '[]')
    ) INTO poll_data
    FROM polls p
    JOIN questions q ON p.id = q.poll_id
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

-- ---------------------------------------------------------------------------
-- Closet: ignore p_pack_id unless the session user owns that pack
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_closet_page_data(p_pack_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  DECLARE
    pack_data JSON;
    dynamic_pack_id BIGINT;
    user_packs JSON;
  BEGIN
    IF p_pack_id = 0 THEN
      SELECT COALESCE((
        SELECT p.id FROM packs p
        WHERE p.profile_id = auth.uid()
        ORDER BY p.locked_at NULLS FIRST, p.created_at ASC
        LIMIT 1
      ), 0) INTO dynamic_pack_id;
    ELSE
      dynamic_pack_id := p_pack_id;
    END IF;

    IF dynamic_pack_id <> 0 AND NOT private.owns_pack(dynamic_pack_id) THEN
      dynamic_pack_id := 0;
    END IF;

    SELECT COALESCE((
      SELECT json_agg(json_build_object(
        'id', p.id,
        'name', p.name,
        'slug', p.slug,
        'locked_at', p.locked_at
      ) ORDER BY p.locked_at NULLS FIRST, p.created_at ASC)
      FROM packs p
      WHERE p.profile_id = auth.uid()
    ), '[]'::JSON) INTO user_packs;

    SELECT COALESCE((SELECT json_build_object(
      'pack', json_build_object(
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
            'id', sub.id,
            'created_at', sub.created_at,
            'name', sub.name,
            'unit', sub.unit,
            'slug', sub.slug,
            'pack_id', sub.pack_id,
            'updated_at', sub.updated_at,
            'category_items', sub.category_items
          )), '[]'::JSON)
          FROM (
            SELECT
              c.id,
              c.created_at,
              c.name,
              c.unit,
              c.slug,
              c.pack_id,
              c.updated_at,
              (
                SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.position), '[]'::JSON)
                FROM (
                  SELECT
                    ci.id,
                    ci.category_id,
                    ci.item_id,
                    ci.position,
                    ci.created_at,
                    ci.updated_at,
                    row_to_json(i.*) AS item
                  FROM category_items ci
                  JOIN items i ON ci.item_id = i.id
                  WHERE ci.category_id = c.id
                ) t
              ) AS category_items
            FROM categories c
            WHERE c.pack_id = dynamic_pack_id
            ORDER BY c.position ASC
          ) AS sub
        )
      ),
      'packs', user_packs
    ) FROM packs pack WHERE pack.id = dynamic_pack_id ORDER BY pack.created_at DESC), '[]'::JSON) INTO pack_data;

    RETURN pack_data;
  END;
$$;

REVOKE ALL ON FUNCTION public.get_closet_page_data(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_closet_page_data(bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_closet_page_data(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_closet_page_data(bigint) TO service_role;
