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
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "active" boolean NOT NULL DEFAULT true,
    "image" text,
    "metadata" jsonb,
    "environment" text NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Create updated_at trigger
CREATE TRIGGER "set_public_products_updated_at"
BEFORE UPDATE ON "public"."products"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

-- Enable RLS
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products" ON "public"."products"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Service role can manage products" ON "public"."products"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";
