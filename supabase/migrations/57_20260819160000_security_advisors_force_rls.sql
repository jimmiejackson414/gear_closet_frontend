-- Issue #81: Supabase security advisor follow-through (parent #72).
--
-- Local/post-migration checks:
--   - public app tables: RLS enabled + forced (owner bypass closed)
--   - storage.objects: avatar CRUD scoped to authenticated (RLS already enabled by Supabase;
--     FORCE not alterable by migration role — owned by supabase_storage_admin)
--   - private.* trip/poll helpers: anon EXECUTE revoked (public packs keep pack helpers)
--   - SECURITY DEFINER RPCs: fixed search_path on closet + poll writers

-- ---------------------------------------------------------------------------
-- FORCE ROW LEVEL SECURITY on public app tables (postgres owner bypass)
-- ---------------------------------------------------------------------------
ALTER TABLE public.answers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.category_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.comments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.customers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.friend_invitations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.friends FORCE ROW LEVEL SECURITY;
ALTER TABLE public.items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps FORCE ROW LEVEL SECURITY;
ALTER TABLE public.packs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.polls FORCE ROW LEVEL SECURITY;
ALTER TABLE public.prices FORCE ROW LEVEL SECURITY;
ALTER TABLE public.products FORCE ROW LEVEL SECURITY;
ALTER TABLE public.profile_answers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.questions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.replies FORCE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.todos FORCE ROW LEVEL SECURITY;
ALTER TABLE public.trip_details FORCE ROW LEVEL SECURITY;
ALTER TABLE public.trip_friends FORCE ROW LEVEL SECURITY;
ALTER TABLE public.trip_packs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.trips FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Storage: avatar bucket — authenticated only (was ALL without role restriction)
-- storage.objects RLS is enabled by Supabase; policy changes work via postgres.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable full CRUD for users that match directory" ON storage.objects;

CREATE POLICY storage_avatars_crud_own_folder
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---------------------------------------------------------------------------
-- private helpers: anon only needs pack-read helpers for public pack RLS
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION private.owns_trip(bigint) FROM anon;
REVOKE ALL ON FUNCTION private.is_trip_invitee(bigint) FROM anon;
REVOKE ALL ON FUNCTION private.can_read_trip(bigint) FROM anon;
REVOKE ALL ON FUNCTION private.can_read_poll(bigint) FROM anon;
REVOKE ALL ON FUNCTION private.has_accepted_trip_invite(bigint) FROM anon;
REVOKE ALL ON FUNCTION private.can_access_planning_trip(bigint) FROM anon;

-- ---------------------------------------------------------------------------
-- SECURITY DEFINER RPCs: pin search_path (advisor: function_search_path_mutable)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_closet_page_data(p_pack_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  pack_data JSON;
  dynamic_pack_id BIGINT;
  user_packs JSON;
BEGIN
  IF p_pack_id = 0 THEN
    SELECT COALESCE((
      SELECT p.id FROM public.packs p
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
    FROM public.packs p
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
                FROM public.category_items ci
                JOIN public.items i ON ci.item_id = i.id
                WHERE ci.category_id = c.id
              ) t
            ) AS category_items
          FROM public.categories c
          WHERE c.pack_id = dynamic_pack_id
          ORDER BY c.position ASC
        ) AS sub
      )
    ),
    'packs', user_packs
  ) FROM public.packs pack WHERE pack.id = dynamic_pack_id ORDER BY pack.created_at DESC), '[]'::JSON) INTO pack_data;

  RETURN pack_data;
END;
$$;

REVOKE ALL ON FUNCTION public.get_closet_page_data(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_closet_page_data(bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_closet_page_data(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_closet_page_data(bigint) TO service_role;

CREATE OR REPLACE FUNCTION public.create_poll(
  trip_id bigint,
  question text,
  answers text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_poll_id integer;
  new_question_id integer;
  new_poll json;
  i integer;
BEGIN
  INSERT INTO public.polls (trip_id, profile_id)
  VALUES (trip_id, auth.uid())
  RETURNING id INTO new_poll_id;

  INSERT INTO public.questions (poll_id, profile_id, title)
  VALUES (new_poll_id, auth.uid(), question)
  RETURNING id INTO new_question_id;

  FOR i IN 1..array_length(answers, 1)
  LOOP
    INSERT INTO public.answers (question_id, profile_id, content)
    VALUES (new_question_id, auth.uid(), answers[i]);
  END LOOP;

  SELECT json_build_object(
    'id', p.id::integer,
    'trip_id', p.trip_id::integer,
    'profile_id', p.profile_id::uuid,
    'question', (SELECT row_to_json(q.*) FROM public.questions q WHERE q.id = new_question_id),
    'answers', COALESCE((
      SELECT json_agg(row_to_json(a.*))
      FROM public.answers a
      WHERE a.question_id = new_question_id
    ), '[]'),
    'votes', COALESCE((
      SELECT json_agg(row_to_json(pa.*))
      FROM public.profile_answers pa
      WHERE pa.poll_id = new_poll_id
    ), '[]')
  )
  INTO new_poll
  FROM public.polls p
  WHERE p.id = new_poll_id;

  RETURN new_poll;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_poll(
  poll_id bigint,
  question text,
  answers text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_poll json;
  i integer;
  answer_ids bigint[];
  question_id bigint;
BEGIN
  UPDATE public.questions
  SET title = question
  WHERE public.questions.poll_id = update_poll.poll_id;

  SELECT array_agg(id)
  INTO answer_ids
  FROM public.answers
  WHERE public.answers.question_id IN (
    SELECT id FROM public.questions WHERE public.questions.poll_id = update_poll.poll_id
  );

  SELECT id
  INTO question_id
  FROM public.questions
  WHERE public.questions.poll_id = update_poll.poll_id;

  FOR i IN 1..array_length(update_poll.answers, 1)
  LOOP
    IF i <= array_length(answer_ids, 1) THEN
      UPDATE public.answers
      SET content = update_poll.answers[i]
      WHERE id = answer_ids[i];
    ELSE
      INSERT INTO public.answers (content, question_id)
      VALUES (update_poll.answers[i], question_id);
    END IF;
  END LOOP;

  SELECT json_build_object(
    'id', p.id::integer,
    'trip_id', p.trip_id::integer,
    'profile_id', p.profile_id::uuid,
    'question', (
      SELECT row_to_json(q.*)
      FROM public.questions q
      WHERE q.poll_id = update_poll.poll_id
    ),
    'answers', COALESCE((
      SELECT json_agg(row_to_json(a.*))
      FROM public.answers a
      WHERE a.question_id IN (
        SELECT id FROM public.questions WHERE public.questions.poll_id = update_poll.poll_id
      )
    ), '[]'),
    'votes', COALESCE((
      SELECT json_agg(row_to_json(pa.*))
      FROM public.profile_answers pa
      WHERE pa.poll_id = update_poll.poll_id
    ), '[]')
  )
  INTO updated_poll
  FROM public.polls p
  WHERE p.id = update_poll.poll_id;

  RETURN updated_poll;
END;
$$;

REVOKE ALL ON FUNCTION public.create_poll(bigint, text, text[]) FROM anon;
REVOKE ALL ON FUNCTION public.update_poll(bigint, text, text[]) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_poll(bigint, text, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_poll(bigint, text, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_poll(bigint, text, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_poll(bigint, text, text[]) TO service_role;
