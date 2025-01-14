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

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."onboarding_steps" TO "anon";
GRANT ALL ON TABLE "public"."onboarding_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."onboarding_steps" TO "service_role";
