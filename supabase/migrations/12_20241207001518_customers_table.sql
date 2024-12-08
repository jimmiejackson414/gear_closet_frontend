-- Create customers table
------------------------
CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "stripe_customer_id" "text",
    "profile_id" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone
);

-- Alter table statements
------------------------
ALTER TABLE "public"."customers" OWNER TO "postgres";
ALTER TABLE ONLY "public"."customers" ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."customers" ADD CONSTRAINT "customers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

-- Define policies
------------------------
CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."customers" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";
