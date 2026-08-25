-- Issue #147: every new trip gets placeholder Trip + Hike detail rows so
-- Planning widgets look started. Copy must stay in sync with
-- STARTER_DETAIL_TITLE / starterDetailValue in utils/trips.ts.
-- Signup (handle_new_user) and Create Trip both INSERT into trips, so the
-- trigger covers both. Seed dumps use session_replication_role = replica
-- and do not fire this trigger.

CREATE OR REPLACE FUNCTION private.seed_starter_trip_details()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.trip_details (trip_id, title, type, value)
  VALUES
    (
      NEW.id,
      'New detail',
      'TRIP'::public.trip_details_type,
      'New trip detail description'
    ),
    (
      NEW.id,
      'New detail',
      'HIKE'::public.trip_details_type,
      'New hike detail description'
    );
  RETURN NEW;
END;
$$;

ALTER FUNCTION private.seed_starter_trip_details() OWNER TO postgres;

REVOKE ALL ON FUNCTION private.seed_starter_trip_details() FROM PUBLIC;

DROP TRIGGER IF EXISTS seed_starter_trip_details ON public.trips;
CREATE TRIGGER seed_starter_trip_details
  AFTER INSERT ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION private.seed_starter_trip_details();
