-- Owner-only trip delete. Child FKs were NO ACTION, so a trips DELETE failed
-- when details/todos/etc existed. FORCE RLS also blocks client CASCADE when
-- invitees own USER todos, shopping rows, or attached packs — delete via a
-- SECURITY DEFINER RPC that checks private.owns_trip first.

ALTER TABLE public.trip_details
  DROP CONSTRAINT trip_details_trip_id_fkey,
  ADD CONSTRAINT trip_details_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

ALTER TABLE public.todos
  DROP CONSTRAINT todos_trip_id_fkey,
  ADD CONSTRAINT todos_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

ALTER TABLE public.shopping_list_items
  DROP CONSTRAINT shopping_list_items_trip_id_fkey,
  ADD CONSTRAINT shopping_list_items_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

ALTER TABLE public.polls
  DROP CONSTRAINT polls_trip_id_fkey,
  ADD CONSTRAINT polls_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

ALTER TABLE public.trip_packs
  DROP CONSTRAINT trip_packs_trip_id_fkey,
  ADD CONSTRAINT trip_packs_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

ALTER TABLE public.trip_friends
  DROP CONSTRAINT trip_friends_trip_id_fkey,
  ADD CONSTRAINT trip_friends_trip_id_fkey
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.delete_trip(p_trip_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_trip_id IS NULL OR p_trip_id <= 0 THEN
    RAISE EXCEPTION 'invalid trip' USING ERRCODE = '22023';
  END IF;

  IF NOT private.owns_trip(p_trip_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.trips
  WHERE id = p_trip_id;
END;
$$;

ALTER FUNCTION public.delete_trip(bigint) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.delete_trip(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_trip(bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.delete_trip(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_trip(bigint) TO service_role;
