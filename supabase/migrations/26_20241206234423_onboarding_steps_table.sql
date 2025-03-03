-- Create onboarding_steps table
------------------------
CREATE TABLE IF NOT EXISTS "public"."onboarding_steps" (
    "profile_id" "uuid" NOT NULL,
    "page" "text" NOT NULL,
    "completion_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- Alter table statements
------------------------
ALTER TABLE "public"."onboarding_steps" OWNER TO "postgres";
ALTER TABLE ONLY "public"."onboarding_steps" ADD CONSTRAINT "onboarding_completion_pkey" PRIMARY KEY ("profile_id", "page");
ALTER TABLE ONLY "public"."onboarding_steps" ADD CONSTRAINT "onboarding_steps_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

-- Define triggers
------------------------
CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."onboarding_steps" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();

-- Enable RLS
------------------------
ALTER TABLE "public"."onboarding_steps" ENABLE ROW LEVEL SECURITY;

-- Define policies
------------------------
CREATE POLICY "Users can view own onboarding steps" ON "public"."onboarding_steps"
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
);

CREATE POLICY "Users can manage own onboarding steps" ON "public"."onboarding_steps"
FOR ALL
TO authenticated
USING (
  profile_id = auth.uid()
)
WITH CHECK (
  profile_id = auth.uid()
);

CREATE POLICY "Service role can manage onboarding steps" ON "public"."onboarding_steps"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."onboarding_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."onboarding_steps" TO "service_role";
