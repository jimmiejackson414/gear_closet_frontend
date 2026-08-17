-- Issue #80: Tighten GRANT ALL to anon on public tables.
--
-- Legacy dumps granted ALL on every table/sequence/function to anon. RLS blocks
-- most abuse today, but table-level grants should fail closed if a policy is
-- ever dropped. Keep anon SELECT only on tables the logged-out public pack page
-- and pricing catalog need; revoke everything else.

-- ---------------------------------------------------------------------------
-- Default privileges: stop auto-granting ALL to anon on new objects
-- (migration author role; Supabase applies migrations as postgres)
-- ---------------------------------------------------------------------------
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon;

-- ---------------------------------------------------------------------------
-- Tables: read-only anon access on public-pack + catalog tables only
-- ---------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

GRANT SELECT ON TABLE public.packs TO anon;
GRANT SELECT ON TABLE public.categories TO anon;
GRANT SELECT ON TABLE public.category_items TO anon;
GRANT SELECT ON TABLE public.items TO anon;
GRANT SELECT ON TABLE public.comments TO anon;
GRANT SELECT ON TABLE public.replies TO anon;
GRANT SELECT ON TABLE public.profiles TO anon;
GRANT SELECT ON TABLE public.products TO anon;
GRANT SELECT ON TABLE public.prices TO anon;

-- ---------------------------------------------------------------------------
-- Sequences: anon never inserts; no sequence privileges needed
-- ---------------------------------------------------------------------------
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- ---------------------------------------------------------------------------
-- RPCs: anon must not invoke write paths or session-scoped aggregators
-- (get_* / handle_new_user already revoked in migrations 53–55)
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.create_category_and_item(text, bigint, jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.import_csv_data(jsonb, bigint) FROM anon;
REVOKE ALL ON FUNCTION public.update_positions(public.category_item_position[]) FROM anon;
REVOKE ALL ON FUNCTION public.create_poll(bigint, text, text[]) FROM anon;
REVOKE ALL ON FUNCTION public.update_poll(bigint, text, text[]) FROM anon;
REVOKE ALL ON FUNCTION public.generate_slug() FROM anon;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.get_dashboard_data() FROM anon;
REVOKE ALL ON FUNCTION public.get_planning_page_data(bigint) FROM anon;
REVOKE ALL ON FUNCTION public.get_closet_page_data(bigint) FROM anon;
