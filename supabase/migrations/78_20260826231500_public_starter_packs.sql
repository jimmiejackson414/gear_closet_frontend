-- Starter packs were seeded private, so shared /p/packs/[slug] links 404 for guests.
-- New signups get a public starter pack; existing default starter packs are opened.

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
    false,
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

UPDATE public.packs
SET private = false,
    updated_at = now()
WHERE name = 'My first pack'
  AND private = true;
