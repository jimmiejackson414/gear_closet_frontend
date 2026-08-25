-- Issue #145: creating a trip 403s with
-- "new row violates row-level security policy for table trips".
--
-- PostgREST insert().select() uses INSERT ... RETURNING. Postgres also applies
-- SELECT policies to the new row. trips_select_own_or_invitee only called
-- private.can_read_trip(id), which looks the trip up in the table — the row is
-- not visible yet, so RETURNING fails even when trips_insert_own passed.
-- Packs already allow INSERT RETURNING because their SELECT policy reads
-- profile_id on the new row directly.

DROP POLICY IF EXISTS trips_select_own_or_invitee ON public.trips;

CREATE POLICY trips_select_own_or_invitee
  ON public.trips FOR SELECT TO authenticated
  USING (
    profile_id = (SELECT private.uid())
    OR private.can_read_trip(id)
  );
