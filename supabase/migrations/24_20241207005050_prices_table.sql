-- Define enums
------------------------
CREATE TYPE "public"."pricing_type" AS ENUM (
    'one_time',
    'recurring'
);

CREATE TYPE "public"."pricing_plan_interval" AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

-- Create prices table
------------------------
CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" "text" NOT NULL,
    "product_id" "text",
    "active" boolean,
    "description" "text",
    "unit_amount" bigint,
    "currency" "text",
    "type" "public"."pricing_type",
    "interval" "public"."pricing_plan_interval",
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" "jsonb",
    "identifier" "public"."subscription_level" DEFAULT 'FREE'::"public"."subscription_level",
    "environment" "text" DEFAULT 'development'::"text",
    CONSTRAINT "prices_currency_check" CHECK (("char_length"("currency") = 3))
);

-- Alter table statements
------------------------
ALTER TABLE "public"."prices" OWNER TO "postgres";
ALTER TABLE ONLY "public"."prices" ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."prices" ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");
ALTER TYPE "public"."pricing_type" OWNER TO "postgres";
ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";
ALTER TYPE "public"."subscription_level" OWNER TO "postgres";

-- Define policies
------------------------
CREATE POLICY "Allow public read-only access." ON "public"."prices" FOR SELECT USING (true);

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";


