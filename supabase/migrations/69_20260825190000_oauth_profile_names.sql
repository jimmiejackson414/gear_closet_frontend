-- Copy Google/Facebook names from auth.users.raw_user_meta_data into profiles
-- on first insert. Existing profiles that later link OAuth keep their names
-- (ON CONFLICT only updates email). Keep the split rules in sync with
-- utils/oauthProfileNames.ts.

CREATE OR REPLACE FUNCTION private.profile_names_from_auth_metadata(meta jsonb)
RETURNS TABLE (first_name text, last_name text)
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
SET search_path = ''
AS $$
  SELECT
    CASE
      WHEN src.given_name IS NOT NULL THEN src.given_name
      WHEN src.display_name IS NULL THEN NULL
      ELSE split_part(src.display_name, ' ', 1)
    END,
    CASE
      WHEN src.given_name IS NOT NULL THEN src.family_name
      WHEN src.display_name IS NULL OR strpos(src.display_name, ' ') = 0 THEN NULL
      ELSE btrim(substr(src.display_name, strpos(src.display_name, ' ') + 1))
    END
  FROM (
    SELECT
      NULLIF(btrim(COALESCE(meta->>'given_name', meta->>'first_name', '')), '') AS given_name,
      NULLIF(btrim(COALESCE(meta->>'family_name', meta->>'last_name', '')), '') AS family_name,
      NULLIF(btrim(COALESCE(meta->>'full_name', meta->>'name', '')), '') AS display_name
  ) AS src;
$$;

ALTER FUNCTION private.profile_names_from_auth_metadata(jsonb) OWNER TO postgres;

REVOKE ALL ON FUNCTION private.profile_names_from_auth_metadata(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.profile_names_from_auth_metadata(jsonb) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION private.profile_names_from_auth_metadata(jsonb)
  TO postgres, service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  starter_pack_id bigint;
  starter_trip_id bigint;
  oauth_first text;
  oauth_last text;
BEGIN
  SELECT names.first_name, names.last_name
  INTO oauth_first, oauth_last
  FROM private.profile_names_from_auth_metadata(NEW.raw_user_meta_data) AS names;

  INSERT INTO public.profiles (id, email, image, role, measuring_system, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NULL,
    'USER'::public.user_role,
    'IMPERIAL'::public.measuring_system,
    oauth_first,
    oauth_last
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

  PERFORM private.claim_pending_trip_invitations_by_email(NEW.id, NEW.email);

  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
