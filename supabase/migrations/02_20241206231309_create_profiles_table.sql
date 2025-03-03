-- Define enums
------------------------
CREATE TYPE "public"."measuring_system" AS ENUM (
    'IMPERIAL',
    'METRIC'
);

-- Create profiles table
------------------------
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL,
    "email" text NOT NULL,
    "first_name" text,
    "last_name" text,
    "trail_name" text,
    "image" text,
    "role" "public"."user_role" DEFAULT 'USER'::"public"."user_role",
    "measuring_system" "public"."measuring_system" DEFAULT 'IMPERIAL'::"public"."measuring_system",
    "onboard_date" timestamp with time zone,
    "address_1" text,
    "address_2" text,
    "city" text,
    "state" text,
    "country" text,
    "location" jsonb,
    "slug" text NOT NULL UNIQUE,
    "deactivated_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Add fts column to profiles table
------------------------
ALTER TABLE "public"."profiles"
ADD COLUMN fts tsvector GENERATED ALWAYS AS (
  to_tsvector('simple', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(trail_name, ''))
) STORED;

-- Create indexes
------------------------
CREATE INDEX profiles_fts ON "public"."profiles" USING gin (fts);
CREATE INDEX profiles_slug_idx ON "public"."profiles" (slug);

-- Define triggers
------------------------
CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

-- Update profile image in storage bucket
------------------------
CREATE OR REPLACE FUNCTION "public"."update_profile_image"() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE "public"."profiles"
    SET "image" = NEW.name
    WHERE "id" = (storage.foldername(NEW.name))[1]::uuid;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE "public"."profiles"
    SET "image" = NULL
    WHERE "id" = (storage.foldername(OLD.name))[1]::uuid;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update profile image after insert or delete trigger
------------------------
CREATE TRIGGER update_profile_image_after_insert_or_delete
AFTER INSERT OR DELETE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION "public"."update_profile_image"();

-- Generate slug for profiles
------------------------
CREATE TRIGGER "generate_slug_for_profiles"
BEFORE INSERT ON "public"."profiles"
FOR EACH ROW
EXECUTE FUNCTION "public"."generate_slug"();

-- Search profiles function
------------------------
CREATE OR REPLACE FUNCTION "public"."search_profiles"(search_query text)
RETURNS SETOF "public"."profiles" AS $$
BEGIN
  RETURN QUERY SELECT *
  FROM "public"."profiles"
  WHERE fts @@ to_tsquery('simple', search_query)
  AND id <> '00000000-0000-0000-0000-000000000000' -- Exclude the Admin user
  AND deactivated_at IS NULL; -- Exclude deactivated profiles
END; $$
LANGUAGE plpgsql;

-- Enable RLS
------------------------
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- Create policies
------------------------
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON "public"."profiles"
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can view profiles of their friends
CREATE POLICY "Users can view friend profiles" ON "public"."profiles"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."friends"
    WHERE (profile_id = auth.uid() AND friend_id = profiles.id)
    OR (profile_id = profiles.id AND friend_id = auth.uid())
  )
);

-- Users can view profiles of users in their trips
CREATE POLICY "Users can view trip member profiles" ON "public"."profiles"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."trip_friends"
    WHERE trip_id IN (
      SELECT trip_id FROM "public"."trip_friends"
      WHERE profile_id = auth.uid()
    )
    AND profile_id = profiles.id
    AND profile_id != auth.uid()
  )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "public"."profiles"
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Service role has full access
CREATE POLICY "Service role can manage all profiles" ON "public"."profiles"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";
REVOKE ALL ON TABLE "public"."profiles" FROM "anon";