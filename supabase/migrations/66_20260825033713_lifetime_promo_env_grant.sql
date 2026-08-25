-- Gate beta LIFE on NUXT_PUBLIC_LIFETIME_PROMO. Signup no longer grants LIFE;
-- the app calls this RPC from onboarding when the promo flag is true.

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

  PERFORM private.claim_pending_trip_invitations_by_email(NEW.id, NEW.email);

  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

CREATE OR REPLACE FUNCTION public.grant_beta_lifetime_for_profile(p_profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_profile_id IS NULL THEN
    RETURN;
  END IF;

  PERFORM private.grant_beta_lifetime(p_profile_id);
END;
$$;

ALTER FUNCTION public.grant_beta_lifetime_for_profile(uuid) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.grant_beta_lifetime_for_profile(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.grant_beta_lifetime_for_profile(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_beta_lifetime_for_profile(uuid)
  TO service_role;
