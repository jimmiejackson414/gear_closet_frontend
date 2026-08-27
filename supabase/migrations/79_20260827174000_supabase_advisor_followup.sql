-- Supabase advisor follow-up (security + performance lints).
--
-- Security (0008): service-role-only rate-limit tables had RLS enabled with no policies.
-- Security: friend_invitations missing a primary key (0004).
-- Performance (0009): comments/replies had redundant UNIQUE(id) beside PRIMARY KEY(id).
-- Performance (0006): trip_details had overlapping SELECT policies (read + write ALL).
-- Performance (0001): add covering indexes on foreign keys flagged by the linter.

-- ---------------------------------------------------------------------------
-- Service-role-only tables: explicit deny policies for API roles
-- ---------------------------------------------------------------------------
CREATE POLICY friend_invite_attempts_deny_api_roles
  ON public.friend_invite_attempts
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY trip_invite_attempts_deny_api_roles
  ON public.trip_invite_attempts
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- ---------------------------------------------------------------------------
-- Primary key
-- ---------------------------------------------------------------------------
ALTER TABLE public.friend_invitations
  ADD CONSTRAINT friend_invitations_pkey PRIMARY KEY (id);

-- ---------------------------------------------------------------------------
-- Duplicate indexes (PK already enforces uniqueness on id)
-- replies.comment_id FK was bound to comments_id_key; reattach to comments_pkey.
-- ---------------------------------------------------------------------------
ALTER TABLE public.replies
  DROP CONSTRAINT IF EXISTS replies_comment_id_fkey;

ALTER TABLE public.comments
  DROP CONSTRAINT IF EXISTS comments_id_key;

ALTER TABLE public.replies
  ADD CONSTRAINT replies_comment_id_fkey
  FOREIGN KEY (comment_id) REFERENCES public.comments (id);

ALTER TABLE public.replies
  DROP CONSTRAINT IF EXISTS replies_id_key;

-- ---------------------------------------------------------------------------
-- trip_details: split write policy so SELECT is not evaluated twice
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS trip_details_write_party ON public.trip_details;

CREATE POLICY trip_details_insert_party
  ON public.trip_details FOR INSERT TO authenticated
  WITH CHECK (private.can_access_planning_trip(trip_id));

CREATE POLICY trip_details_update_party
  ON public.trip_details FOR UPDATE TO authenticated
  USING (private.can_access_planning_trip(trip_id))
  WITH CHECK (private.can_access_planning_trip(trip_id));

CREATE POLICY trip_details_delete_party
  ON public.trip_details FOR DELETE TO authenticated
  USING (private.can_access_planning_trip(trip_id));

-- ---------------------------------------------------------------------------
-- Foreign key covering indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS answers_profile_id_idx
  ON public.answers (profile_id);

CREATE INDEX IF NOT EXISTS answers_question_id_idx
  ON public.answers (question_id);

CREATE INDEX IF NOT EXISTS category_items_category_id_idx
  ON public.category_items (category_id);

CREATE INDEX IF NOT EXISTS category_items_item_id_idx
  ON public.category_items (item_id);

CREATE INDEX IF NOT EXISTS comments_pack_id_idx
  ON public.comments (pack_id);

CREATE INDEX IF NOT EXISTS comments_profile_id_idx
  ON public.comments (profile_id);

CREATE INDEX IF NOT EXISTS customers_profile_id_idx
  ON public.customers (profile_id);

CREATE INDEX IF NOT EXISTS friend_invitations_recipient_id_idx
  ON public.friend_invitations (recipient_id);

CREATE INDEX IF NOT EXISTS friend_invitations_sender_id_idx
  ON public.friend_invitations (sender_id);

CREATE INDEX IF NOT EXISTS friends_profile_id_idx
  ON public.friends (profile_id);

CREATE INDEX IF NOT EXISTS items_profile_id_idx
  ON public.items (profile_id);

CREATE INDEX IF NOT EXISTS notifications_profile_id_idx
  ON public.notifications (profile_id);

CREATE INDEX IF NOT EXISTS notifications_sender_id_idx
  ON public.notifications (sender_id);

CREATE INDEX IF NOT EXISTS packs_profile_id_idx
  ON public.packs (profile_id);

CREATE INDEX IF NOT EXISTS polls_profile_id_idx
  ON public.polls (profile_id);

CREATE INDEX IF NOT EXISTS polls_trip_id_idx
  ON public.polls (trip_id);

CREATE INDEX IF NOT EXISTS prices_product_id_idx
  ON public.prices (product_id);

CREATE INDEX IF NOT EXISTS profile_answers_answer_id_idx
  ON public.profile_answers (answer_id);

CREATE INDEX IF NOT EXISTS profile_answers_poll_id_idx
  ON public.profile_answers (poll_id);

CREATE INDEX IF NOT EXISTS profile_answers_profile_id_idx
  ON public.profile_answers (profile_id);

CREATE INDEX IF NOT EXISTS questions_poll_id_idx
  ON public.questions (poll_id);

CREATE INDEX IF NOT EXISTS questions_profile_id_idx
  ON public.questions (profile_id);

CREATE INDEX IF NOT EXISTS replies_comment_id_idx
  ON public.replies (comment_id);

CREATE INDEX IF NOT EXISTS replies_profile_id_idx
  ON public.replies (profile_id);

CREATE INDEX IF NOT EXISTS shopping_list_items_profile_id_idx
  ON public.shopping_list_items (profile_id);

CREATE INDEX IF NOT EXISTS shopping_list_items_trip_id_idx
  ON public.shopping_list_items (trip_id);

CREATE INDEX IF NOT EXISTS subscriptions_price_id_idx
  ON public.subscriptions (price_id);

CREATE INDEX IF NOT EXISTS subscriptions_profile_id_idx
  ON public.subscriptions (profile_id);

CREATE INDEX IF NOT EXISTS todos_profile_id_idx
  ON public.todos (profile_id);

CREATE INDEX IF NOT EXISTS todos_trip_id_idx
  ON public.todos (trip_id);

CREATE INDEX IF NOT EXISTS trip_details_trip_id_idx
  ON public.trip_details (trip_id);

CREATE INDEX IF NOT EXISTS trip_friends_invited_by_id_idx
  ON public.trip_friends (invited_by_id);

CREATE INDEX IF NOT EXISTS trip_packs_profile_id_idx
  ON public.trip_packs (profile_id);

CREATE INDEX IF NOT EXISTS trips_profile_id_idx
  ON public.trips (profile_id);
