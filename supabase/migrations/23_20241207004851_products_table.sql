-- Define enums
------------------------
CREATE TYPE "public"."subscription_level" AS ENUM (
    'FREE',
    'MONTHLY',
    'ANNUAL',
    'LIFE'
);

-- Create products table
------------------------
CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "name" "public"."subscription_level",
    "description" "text",
    "image" "text",
    "metadata" "jsonb",
    "environment" "text"
);

-- Alter table statements
------------------------
ALTER TABLE "public"."products" OWNER TO "postgres";
ALTER TABLE ONLY "public"."products" ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- Define policies
------------------------
CREATE POLICY "Allow public read-only access." ON "public"."products" FOR SELECT USING (true);

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

