-- Issue #62: seed a real starter pack + dated trip so new Free users edit
-- those rows instead of hunting Create buttons. The seed is their Free quota.

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

  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Existing placeholder trips were hidden on the dashboard (null dates).
UPDATE public.trips
SET
  name = 'My first trip',
  description = 'Edit this trip to plan your next backpacking adventure.',
  starting_date = now() + interval '30 days',
  ending_date = now() + interval '33 days'
WHERE name IN ('My first trip!', 'My first trip')
  AND starting_date IS NULL
  AND ending_date IS NULL
  AND description = 'This is my first trip to plan.';

INSERT INTO public.packs (name, profile_id, theme, private, allow_comments)
SELECT DISTINCT ON (t.profile_id)
  'My first pack',
  t.profile_id,
  'BLUE6'::public.theme,
  true,
  false
FROM public.trips t
WHERE t.name IN ('My first trip!', 'My first trip')
  AND t.profile_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.packs p
    WHERE p.profile_id = t.profile_id
  )
ORDER BY t.profile_id, t.id;

INSERT INTO public.trip_packs (trip_id, pack_id, profile_id)
SELECT t.id, p.id, t.profile_id
FROM public.trips t
JOIN public.packs p
  ON p.profile_id = t.profile_id
 AND p.name = 'My first pack'
WHERE t.name IN ('My first trip!', 'My first trip')
  AND t.profile_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.trip_packs tp
    WHERE tp.trip_id = t.id
  );
