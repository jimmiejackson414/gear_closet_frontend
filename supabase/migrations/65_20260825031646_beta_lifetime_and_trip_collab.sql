-- Beta: grant LIFE to every new user, and let accepted trip members
-- collaborate on packs, hike/trip details, and group lists. Trip delete
-- stays owner-only. Trip ownership (profile_id) cannot be reassigned.

-- ---------------------------------------------------------------------------
-- Beta lifetime grant (email signup, OAuth, and any other auth.users insert)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.grant_beta_lifetime(p_profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  life_price_id text;
BEGIN
  IF p_profile_id IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.profile_id = p_profile_id
  ) THEN
    RETURN;
  END IF;

  SELECT p.id INTO life_price_id
  FROM public.prices p
  WHERE p.identifier = 'LIFE'::public.subscription_level
    AND p.active IS TRUE
  LIMIT 1;

  IF life_price_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.subscriptions (
    profile_id,
    status,
    metadata,
    price_id,
    quantity,
    cancel_at_period_end,
    current_period_start,
    current_period_end,
    ended_at,
    cancel_at,
    canceled_at,
    trial_start,
    trial_end,
    stripe_subscription_id
  ) VALUES (
    p_profile_id,
    'active'::public.subscription_status,
    jsonb_build_object('source', 'beta_lifetime'),
    life_price_id,
    1,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now() + interval '100 years'),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
END;
$$;

ALTER FUNCTION private.grant_beta_lifetime(uuid) OWNER TO postgres;

REVOKE ALL ON FUNCTION private.grant_beta_lifetime(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.grant_beta_lifetime(uuid)
  TO postgres, service_role;

-- Existing beta accounts that signed up before this grant (no subscriptions row).
INSERT INTO public.subscriptions (
  profile_id,
  status,
  metadata,
  price_id,
  quantity,
  cancel_at_period_end,
  current_period_start,
  current_period_end,
  ended_at,
  cancel_at,
  canceled_at,
  trial_start,
  trial_end,
  stripe_subscription_id
)
SELECT
  pr.id,
  'active'::public.subscription_status,
  jsonb_build_object('source', 'beta_lifetime'),
  p.id,
  1,
  false,
  timezone('utc'::text, now()),
  timezone('utc'::text, now() + interval '100 years'),
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
FROM public.profiles pr
CROSS JOIN LATERAL (
  SELECT prices.id
  FROM public.prices
  WHERE prices.identifier = 'LIFE'::public.subscription_level
    AND prices.active IS TRUE
  LIMIT 1
) p
WHERE NOT EXISTS (
  SELECT 1
  FROM public.subscriptions s
  WHERE s.profile_id = pr.id
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  starter_pack_id bigint;
  starter_trip_id bigint;
BEGIN
  INSERT INTO public.profiles (id, email, image, role, measuring_system)
  VALUES (
    NEW.id,
    NEW.email,
    NULL,
    'USER'::public.user_role,
    'IMPERIAL'::public.measuring_system
  )
  ON CONFLICT (id) DO UPDATE SET email = NEW.email;

  PERFORM private.grant_beta_lifetime(NEW.id);

  INSERT INTO public.notifications (title, content, read_on_date, profile_id, sender_id)
  VALUES (
    'Welcome!',
    'Welcome to Gear Closet! This is where you will receive all of your important updates.',
    NULL,
    NEW.id,
    '00000000-0000-0000-0000-000000000000'
  );

  INSERT INTO public.packs (name, profile_id, theme, private, allow_comments)
  VALUES (
    'My first pack',
    NEW.id,
    'BLUE6'::public.theme,
    true,
    false
  )
  RETURNING id INTO starter_pack_id;

  INSERT INTO public.trips (
    name,
    description,
    starting_point,
    ending_point,
    starting_date,
    ending_date,
    profile_id
  )
  VALUES (
    'My first trip',
    'Edit this trip to plan your next backpacking adventure.',
    'Starting point',
    'Ending point',
    now() + interval '30 days',
    now() + interval '33 days',
    NEW.id
  )
  RETURNING id INTO starter_trip_id;

  INSERT INTO public.trip_packs (trip_id, pack_id, profile_id)
  VALUES (starter_trip_id, starter_pack_id, NEW.id);

  PERFORM private.claim_pending_trip_invitations_by_email(NEW.id, NEW.email);

  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- ---------------------------------------------------------------------------
-- One attached pack per person per trip
-- ---------------------------------------------------------------------------
DELETE FROM public.trip_packs a
USING public.trip_packs b
WHERE a.trip_id IS NOT NULL
  AND a.profile_id IS NOT NULL
  AND a.trip_id = b.trip_id
  AND a.profile_id = b.profile_id
  AND a.id > b.id;

CREATE UNIQUE INDEX IF NOT EXISTS trip_packs_trip_profile_key
  ON public.trip_packs (trip_id, profile_id)
  WHERE trip_id IS NOT NULL AND profile_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Trip owner cannot be stolen via UPDATE
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.prevent_trip_owner_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.profile_id IS DISTINCT FROM OLD.profile_id THEN
    RAISE EXCEPTION 'Trip owner cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

ALTER FUNCTION private.prevent_trip_owner_change() OWNER TO postgres;

REVOKE ALL ON FUNCTION private.prevent_trip_owner_change() FROM PUBLIC;

DROP TRIGGER IF EXISTS prevent_trip_owner_change ON public.trips;
CREATE TRIGGER prevent_trip_owner_change
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION private.prevent_trip_owner_change();

-- ---------------------------------------------------------------------------
-- RLS: accepted invitees can edit trip content; delete trip stays owner-only
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS trips_update_own ON public.trips;
CREATE POLICY trips_update_party
  ON public.trips FOR UPDATE TO authenticated
  USING (private.can_access_planning_trip(id))
  WITH CHECK (private.can_access_planning_trip(id));

DROP POLICY IF EXISTS trip_packs_insert_own ON public.trip_packs;
CREATE POLICY trip_packs_insert_party
  ON public.trip_packs FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.can_access_planning_trip(trip_id)
  );

DROP POLICY IF EXISTS trip_packs_update_own ON public.trip_packs;
CREATE POLICY trip_packs_update_party
  ON public.trip_packs FOR UPDATE TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    AND private.can_access_planning_trip(trip_id)
  )
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.can_access_planning_trip(trip_id)
  );

DROP POLICY IF EXISTS trip_packs_delete_own ON public.trip_packs;
CREATE POLICY trip_packs_delete_party
  ON public.trip_packs FOR DELETE TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    AND private.can_access_planning_trip(trip_id)
  );

DROP POLICY IF EXISTS trip_details_write_owner ON public.trip_details;
CREATE POLICY trip_details_write_party
  ON public.trip_details FOR ALL TO authenticated
  USING (private.can_access_planning_trip(trip_id))
  WITH CHECK (private.can_access_planning_trip(trip_id));

DROP POLICY IF EXISTS todos_insert_allowed ON public.todos;
CREATE POLICY todos_insert_allowed
  ON public.todos FOR INSERT TO authenticated
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()) AND private.can_read_trip(trip_id))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  );

DROP POLICY IF EXISTS todos_update_allowed ON public.todos;
CREATE POLICY todos_update_allowed
  ON public.todos FOR UPDATE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  )
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  );

DROP POLICY IF EXISTS todos_delete_allowed ON public.todos;
CREATE POLICY todos_delete_allowed
  ON public.todos FOR DELETE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  );

DROP POLICY IF EXISTS shopping_list_items_insert_allowed ON public.shopping_list_items;
CREATE POLICY shopping_list_items_insert_allowed
  ON public.shopping_list_items FOR INSERT TO authenticated
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()) AND private.can_read_trip(trip_id))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  );

DROP POLICY IF EXISTS shopping_list_items_update_allowed ON public.shopping_list_items;
CREATE POLICY shopping_list_items_update_allowed
  ON public.shopping_list_items FOR UPDATE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  )
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  );

DROP POLICY IF EXISTS shopping_list_items_delete_allowed ON public.shopping_list_items;
CREATE POLICY shopping_list_items_delete_allowed
  ON public.shopping_list_items FOR DELETE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_access_planning_trip(trip_id))
  );

DROP POLICY IF EXISTS trip_friends_insert_owner ON public.trip_friends;
CREATE POLICY trip_friends_insert_party
  ON public.trip_friends FOR INSERT TO authenticated
  WITH CHECK (
    invited_by_id = (SELECT private.uid())
    AND private.can_access_planning_trip(trip_id)
  );

DROP POLICY IF EXISTS polls_insert_own_trip ON public.polls;
CREATE POLICY polls_insert_party
  ON public.polls FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.can_access_planning_trip(trip_id)
  );

DROP POLICY IF EXISTS trip_invitations_select_owner ON public.trip_invitations;
CREATE POLICY trip_invitations_select_party
  ON public.trip_invitations
  FOR SELECT
  TO authenticated
  USING (private.can_access_planning_trip(trip_id));

-- ---------------------------------------------------------------------------
-- Planning pack JSON for the logged-in user and every attached party pack
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.planning_pack_json(p_trip_id bigint, p_profile_id uuid)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
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
            )), '[]'::json)
            FROM public.category_items ci
            JOIN public.items i ON ci.item_id = i.id
            WHERE ci.category_id = c.id
          )
        )), '[]'::json)
        FROM public.categories c
        WHERE c.pack_id = pack.id
      )
    )
  ), '[]'::json) -> 0)
  FROM public.trip_packs tp
  JOIN public.packs pack ON tp.pack_id = pack.id
  WHERE p_trip_id <> 0
    AND tp.trip_id = p_trip_id
    AND tp.profile_id = p_profile_id;
$$;

ALTER FUNCTION private.planning_pack_json(bigint, uuid) OWNER TO postgres;

REVOKE ALL ON FUNCTION private.planning_pack_json(bigint, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.planning_pack_json(bigint, uuid)
  TO postgres, service_role;

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
    party_packs_data JSON;
    trip_details_data JSON;
    todos_data JSON;
    shopping_items_data JSON;
    friends_data JSON;
    pending_invites_data JSON;
    poll_data JSON;
    dynamic_trip_id BIGINT;
  BEGIN
    IF uid IS NULL THEN
      RETURN jsonb_build_object(
        'trips', '[]'::json,
        'pack', '[]'::json,
        'party_packs', '[]'::json,
        'trip_details', '[]'::json,
        'todos', '[]'::json,
        'shopping_items', '[]'::json,
        'friends', '[]'::json,
        'pending_invites', '[]'::json,
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

    SELECT private.planning_pack_json(dynamic_trip_id, uid) INTO trip_packs_data;

    IF dynamic_trip_id = 0 THEN
      party_packs_data := '[]'::json;
    ELSE
      SELECT COALESCE(json_agg(json_build_object(
        'profile_id', tp.profile_id,
        'display_name', COALESCE(
          NULLIF(trim(both from concat_ws(' ', p.first_name, p.last_name)), ''),
          NULLIF(trim(both from p.trail_name), ''),
          p.email,
          'Trip member'
        ),
        'pack', private.planning_pack_json(dynamic_trip_id, tp.profile_id)
      ) ORDER BY (tp.profile_id = uid) DESC, p.first_name ASC NULLS LAST), '[]'::json)
      INTO party_packs_data
      FROM public.trip_packs tp
      JOIN public.profiles p ON p.id = tp.profile_id
      WHERE tp.trip_id = dynamic_trip_id;
    END IF;

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

    IF dynamic_trip_id <> 0 THEN
      SELECT COALESCE(json_agg(json_build_object(
        'id', ti.id,
        'trip_id', ti.trip_id,
        'email', ti.email,
        'status', ti.status,
        'expires_at', ti.expires_at,
        'created_at', ti.created_at
      ) ORDER BY ti.created_at DESC), '[]'::JSON)
      INTO pending_invites_data
      FROM public.trip_invitations ti
      WHERE ti.trip_id = dynamic_trip_id
        AND ti.status = 'PENDING'::public.trip_invitation_status;
    ELSE
      pending_invites_data := '[]'::JSON;
    END IF;

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
      'party_packs', party_packs_data,
      'trip_details', trip_details_data,
      'todos', todos_data,
      'shopping_items', shopping_items_data,
      'friends', friends_data,
      'pending_invites', pending_invites_data,
      'poll', poll_data
    );
  END;
$$;

REVOKE ALL ON FUNCTION public.get_planning_page_data(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_planning_page_data(bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_planning_page_data(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_planning_page_data(bigint) TO service_role;
