-- Enable RLS on all public app tables and replace weak/missing policies with
-- ownership-based rules. Existing migrations created policies but never
-- ENABLE ROW LEVEL SECURITY, so they were never enforced.

CREATE SCHEMA IF NOT EXISTS private;

-- ---------------------------------------------------------------------------
-- Helper predicates (SECURITY DEFINER avoids RLS recursion across related tables)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION private.owns_pack(p_pack_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.packs p
    WHERE p.id = p_pack_id
      AND p.profile_id = (SELECT private.uid())
  );
$$;

CREATE OR REPLACE FUNCTION private.pack_is_public(p_pack_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.packs p
    WHERE p.id = p_pack_id
      AND p.private = false
  );
$$;

CREATE OR REPLACE FUNCTION private.can_read_pack(p_pack_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.packs p
    WHERE p.id = p_pack_id
      AND (
        p.private = false
        OR p.profile_id = (SELECT private.uid())
      )
  );
$$;

CREATE OR REPLACE FUNCTION private.owns_trip(p_trip_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trips t
    WHERE t.id = p_trip_id
      AND t.profile_id = (SELECT private.uid())
  );
$$;

CREATE OR REPLACE FUNCTION private.is_trip_invitee(p_trip_id bigint)
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
  );
$$;

CREATE OR REPLACE FUNCTION private.can_read_trip(p_trip_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.owns_trip(p_trip_id) OR private.is_trip_invitee(p_trip_id);
$$;

CREATE OR REPLACE FUNCTION private.can_read_poll(p_poll_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.polls po
    WHERE po.id = p_poll_id
      AND private.can_read_trip(po.trip_id)
  );
$$;

REVOKE ALL ON FUNCTION private.uid() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.owns_pack(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.pack_is_public(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.can_read_pack(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.owns_trip(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_trip_invitee(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.can_read_trip(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.can_read_poll(bigint) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION private.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.owns_pack(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.pack_is_public(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.can_read_pack(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.owns_trip(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_trip_invitee(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.can_read_trip(bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.can_read_poll(bigint) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Drop legacy policies (names from original dumps)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.trips;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.notifications;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.packs;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.trip_packs;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.categories;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.items;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.category_items;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.customers;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.friends;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.trip_friends;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.shopping_list_items;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.todos;
DROP POLICY IF EXISTS "Enable CRUD for authenticated profiles only" ON public.trip_details;
DROP POLICY IF EXISTS "Allow public read-only access." ON public.products;
DROP POLICY IF EXISTS "Allow public read-only access." ON public.prices;
DROP POLICY IF EXISTS "Can only view own subs data." ON public.subscriptions;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE POLICY profiles_select_authenticated
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY profiles_select_anon_public_authors
  ON public.profiles FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.comments c
      WHERE c.profile_id = profiles.id
        AND private.pack_is_public(c.pack_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.replies r
      JOIN public.comments c ON c.id = r.comment_id
      WHERE r.profile_id = profiles.id
        AND private.pack_is_public(c.pack_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.packs p
      WHERE p.profile_id = profiles.id
        AND p.private = false
    )
  );

CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE TO authenticated
  USING ((SELECT private.uid()) = id)
  WITH CHECK ((SELECT private.uid()) = id);

CREATE POLICY profiles_delete_own
  ON public.profiles FOR DELETE TO authenticated
  USING ((SELECT private.uid()) = id);

-- Inserts come from handle_new_user (SECURITY DEFINER), not clients.

-- ---------------------------------------------------------------------------
-- packs
-- ---------------------------------------------------------------------------
CREATE POLICY packs_select_own_or_public
  ON public.packs FOR SELECT TO anon, authenticated
  USING (private = false OR profile_id = (SELECT private.uid()));

CREATE POLICY packs_insert_own
  ON public.packs FOR INSERT TO authenticated
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY packs_update_own
  ON public.packs FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY packs_delete_own
  ON public.packs FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

-- ---------------------------------------------------------------------------
-- categories / category_items / items
-- ---------------------------------------------------------------------------
CREATE POLICY categories_select_readable_pack
  ON public.categories FOR SELECT TO anon, authenticated
  USING (private.can_read_pack(pack_id));

CREATE POLICY categories_insert_own_pack
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (private.owns_pack(pack_id));

CREATE POLICY categories_update_own_pack
  ON public.categories FOR UPDATE TO authenticated
  USING (private.owns_pack(pack_id))
  WITH CHECK (private.owns_pack(pack_id));

CREATE POLICY categories_delete_own_pack
  ON public.categories FOR DELETE TO authenticated
  USING (private.owns_pack(pack_id));

CREATE POLICY category_items_select_readable
  ON public.category_items FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = category_items.category_id
        AND private.can_read_pack(c.pack_id)
    )
  );

CREATE POLICY category_items_insert_own_pack
  ON public.category_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = category_items.category_id
        AND private.owns_pack(c.pack_id)
    )
  );

CREATE POLICY category_items_update_own_pack
  ON public.category_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = category_items.category_id
        AND private.owns_pack(c.pack_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = category_items.category_id
        AND private.owns_pack(c.pack_id)
    )
  );

CREATE POLICY category_items_delete_own_pack
  ON public.category_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = category_items.category_id
        AND private.owns_pack(c.pack_id)
    )
  );

CREATE POLICY items_select_own_or_public_pack
  ON public.items FOR SELECT TO anon, authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR EXISTS (
      SELECT 1
      FROM public.category_items ci
      JOIN public.categories c ON c.id = ci.category_id
      WHERE ci.item_id = items.id
        AND private.can_read_pack(c.pack_id)
    )
  );

CREATE POLICY items_insert_own
  ON public.items FOR INSERT TO authenticated
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY items_update_own
  ON public.items FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY items_delete_own
  ON public.items FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

-- ---------------------------------------------------------------------------
-- comments / replies
-- ---------------------------------------------------------------------------
CREATE POLICY comments_select_readable_pack
  ON public.comments FOR SELECT TO anon, authenticated
  USING (private.can_read_pack(pack_id));

CREATE POLICY comments_insert_allowed
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND (
      private.owns_pack(pack_id)
      OR EXISTS (
        SELECT 1
        FROM public.packs p
        WHERE p.id = pack_id
          AND p.private = false
          AND p.allow_comments = true
      )
    )
  );

CREATE POLICY comments_update_own
  ON public.comments FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY comments_delete_own
  ON public.comments FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY replies_select_readable
  ON public.replies FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.comments c
      WHERE c.id = replies.comment_id
        AND private.can_read_pack(c.pack_id)
    )
  );

CREATE POLICY replies_insert_allowed
  ON public.replies FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND EXISTS (
      SELECT 1
      FROM public.comments c
      JOIN public.packs p ON p.id = c.pack_id
      WHERE c.id = replies.comment_id
        AND (
          p.profile_id = (SELECT private.uid())
          OR (p.private = false AND p.allow_comments = true)
        )
    )
  );

CREATE POLICY replies_update_own
  ON public.replies FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY replies_delete_own
  ON public.replies FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

-- ---------------------------------------------------------------------------
-- trips + planning children
-- ---------------------------------------------------------------------------
CREATE POLICY trips_select_own_or_invitee
  ON public.trips FOR SELECT TO authenticated
  USING (private.can_read_trip(id));

CREATE POLICY trips_insert_own
  ON public.trips FOR INSERT TO authenticated
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY trips_update_own
  ON public.trips FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY trips_delete_own
  ON public.trips FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY trip_packs_select_readable
  ON public.trip_packs FOR SELECT TO authenticated
  USING (private.can_read_trip(trip_id));

CREATE POLICY trip_packs_insert_own
  ON public.trip_packs FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.owns_trip(trip_id)
  );

CREATE POLICY trip_packs_update_own
  ON public.trip_packs FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()) AND private.owns_trip(trip_id))
  WITH CHECK (profile_id = (SELECT private.uid()) AND private.owns_trip(trip_id));

CREATE POLICY trip_packs_delete_own
  ON public.trip_packs FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()) AND private.owns_trip(trip_id));

CREATE POLICY trip_details_select_readable
  ON public.trip_details FOR SELECT TO authenticated
  USING (private.can_read_trip(trip_id));

CREATE POLICY trip_details_write_owner
  ON public.trip_details FOR ALL TO authenticated
  USING (private.owns_trip(trip_id))
  WITH CHECK (private.owns_trip(trip_id));

CREATE POLICY todos_select_readable
  ON public.todos FOR SELECT TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_read_trip(trip_id))
  );

CREATE POLICY todos_insert_allowed
  ON public.todos FOR INSERT TO authenticated
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()) AND private.can_read_trip(trip_id))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  );

CREATE POLICY todos_update_allowed
  ON public.todos FOR UPDATE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  )
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  );

CREATE POLICY todos_delete_allowed
  ON public.todos FOR DELETE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  );

CREATE POLICY shopping_list_items_select_readable
  ON public.shopping_list_items FOR SELECT TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.can_read_trip(trip_id))
  );

CREATE POLICY shopping_list_items_insert_allowed
  ON public.shopping_list_items FOR INSERT TO authenticated
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()) AND private.can_read_trip(trip_id))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  );

CREATE POLICY shopping_list_items_update_allowed
  ON public.shopping_list_items FOR UPDATE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  )
  WITH CHECK (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  );

CREATE POLICY shopping_list_items_delete_allowed
  ON public.shopping_list_items FOR DELETE TO authenticated
  USING (
    (resource_type = 'USER' AND profile_id = (SELECT private.uid()))
    OR (resource_type = 'GROUP' AND private.owns_trip(trip_id))
  );

-- ---------------------------------------------------------------------------
-- trip_friends / friends / friend_invitations / notifications
-- ---------------------------------------------------------------------------
CREATE POLICY trip_friends_select_party
  ON public.trip_friends FOR SELECT TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR invited_by_id = (SELECT private.uid())
    OR private.owns_trip(trip_id)
  );

CREATE POLICY trip_friends_insert_owner
  ON public.trip_friends FOR INSERT TO authenticated
  WITH CHECK (
    invited_by_id = (SELECT private.uid())
    AND private.owns_trip(trip_id)
  );

CREATE POLICY trip_friends_update_invitee_or_owner
  ON public.trip_friends FOR UPDATE TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR invited_by_id = (SELECT private.uid())
  )
  WITH CHECK (
    profile_id = (SELECT private.uid())
    OR invited_by_id = (SELECT private.uid())
  );

CREATE POLICY trip_friends_delete_party
  ON public.trip_friends FOR DELETE TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR invited_by_id = (SELECT private.uid())
  );

CREATE POLICY friends_select_either_side
  ON public.friends FOR SELECT TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR friend_id = (SELECT private.uid())
  );

CREATE POLICY friends_insert_either_side
  ON public.friends FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    OR friend_id = (SELECT private.uid())
  );

CREATE POLICY friends_delete_either_side
  ON public.friends FOR DELETE TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR friend_id = (SELECT private.uid())
  );

CREATE POLICY friend_invitations_select_party
  ON public.friend_invitations FOR SELECT TO authenticated
  USING (
    sender_id = (SELECT private.uid())
    OR recipient_id = (SELECT private.uid())
  );

CREATE POLICY friend_invitations_insert_sender
  ON public.friend_invitations FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT private.uid()));

CREATE POLICY friend_invitations_update_party
  ON public.friend_invitations FOR UPDATE TO authenticated
  USING (
    sender_id = (SELECT private.uid())
    OR recipient_id = (SELECT private.uid())
  )
  WITH CHECK (
    sender_id = (SELECT private.uid())
    OR recipient_id = (SELECT private.uid())
  );

CREATE POLICY friend_invitations_delete_party
  ON public.friend_invitations FOR DELETE TO authenticated
  USING (
    sender_id = (SELECT private.uid())
    OR recipient_id = (SELECT private.uid())
  );

CREATE POLICY notifications_select_own
  ON public.notifications FOR SELECT TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY notifications_insert_as_sender
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = (SELECT private.uid())
    OR profile_id = (SELECT private.uid())
  );

CREATE POLICY notifications_update_own
  ON public.notifications FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY notifications_delete_own
  ON public.notifications FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

-- ---------------------------------------------------------------------------
-- polls / questions / answers / profile_answers
-- ---------------------------------------------------------------------------
CREATE POLICY polls_select_readable
  ON public.polls FOR SELECT TO authenticated
  USING (private.can_read_trip(trip_id));

CREATE POLICY polls_insert_own_trip
  ON public.polls FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.owns_trip(trip_id)
  );

CREATE POLICY polls_update_own
  ON public.polls FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY polls_delete_own
  ON public.polls FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY questions_select_readable
  ON public.questions FOR SELECT TO authenticated
  USING (private.can_read_poll(poll_id));

CREATE POLICY questions_insert_own
  ON public.questions FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.can_read_poll(poll_id)
  );

CREATE POLICY questions_update_own
  ON public.questions FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY questions_delete_own
  ON public.questions FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY answers_select_readable
  ON public.answers FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.questions q
      WHERE q.id = answers.question_id
        AND private.can_read_poll(q.poll_id)
    )
  );

CREATE POLICY answers_insert_own
  ON public.answers FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND EXISTS (
      SELECT 1
      FROM public.questions q
      WHERE q.id = answers.question_id
        AND private.can_read_poll(q.poll_id)
    )
  );

CREATE POLICY answers_update_own
  ON public.answers FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY answers_delete_own
  ON public.answers FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY profile_answers_select_readable
  ON public.profile_answers FOR SELECT TO authenticated
  USING (private.can_read_poll(poll_id));

CREATE POLICY profile_answers_insert_own
  ON public.profile_answers FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = (SELECT private.uid())
    AND private.can_read_poll(poll_id)
  );

CREATE POLICY profile_answers_update_own
  ON public.profile_answers FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY profile_answers_delete_own
  ON public.profile_answers FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));

-- ---------------------------------------------------------------------------
-- billing / catalog (client reads; Stripe webhook writes via service_role)
-- ---------------------------------------------------------------------------
CREATE POLICY products_select_public
  ON public.products FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY prices_select_public
  ON public.prices FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY customers_select_own
  ON public.customers FOR SELECT TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY subscriptions_select_own
  ON public.subscriptions FOR SELECT TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY subscriptions_update_own
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

-- ---------------------------------------------------------------------------
-- onboarding_steps
-- ---------------------------------------------------------------------------
CREATE POLICY onboarding_steps_select_own
  ON public.onboarding_steps FOR SELECT TO authenticated
  USING (profile_id = (SELECT private.uid()));

CREATE POLICY onboarding_steps_insert_own
  ON public.onboarding_steps FOR INSERT TO authenticated
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY onboarding_steps_update_own
  ON public.onboarding_steps FOR UPDATE TO authenticated
  USING (profile_id = (SELECT private.uid()))
  WITH CHECK (profile_id = (SELECT private.uid()));

CREATE POLICY onboarding_steps_delete_own
  ON public.onboarding_steps FOR DELETE TO authenticated
  USING (profile_id = (SELECT private.uid()));
