-- Trip members can open a pack attached to a shared trip even when it is
-- private. Nested category/item/comment SELECT already uses can_read_pack,
-- so updating that helper plus packs SELECT is enough for /p/packs/[slug].

CREATE INDEX IF NOT EXISTS trip_packs_pack_id_idx
  ON public.trip_packs (pack_id);

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
        OR EXISTS (
          SELECT 1
          FROM public.trip_packs tp
          WHERE tp.pack_id = p.id
            AND tp.trip_id IS NOT NULL
            AND private.can_access_planning_trip(tp.trip_id)
        )
      )
  );
$$;

ALTER FUNCTION private.can_read_pack(bigint) OWNER TO postgres;

REVOKE ALL ON FUNCTION private.can_read_pack(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.can_read_pack(bigint) TO anon, authenticated;

DROP POLICY IF EXISTS packs_select_own_or_public ON public.packs;

CREATE POLICY packs_select_readable
  ON public.packs FOR SELECT TO anon, authenticated
  USING (private.can_read_pack(id));
