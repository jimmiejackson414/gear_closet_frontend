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
    "id" text NOT NULL,
    "product_id" text NOT NULL,
    "active" boolean NOT NULL DEFAULT true,
    "description" text,
    "unit_amount" integer NOT NULL,
    "currency" text NOT NULL DEFAULT 'usd',
    "type" text NOT NULL DEFAULT 'recurring',
    "interval" text,
    "interval_count" integer,
    "metadata" jsonb,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "prices_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE
);

-- Create updated_at trigger
CREATE TRIGGER "set_public_prices_updated_at"
BEFORE UPDATE ON "public"."prices"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

-- Enable RLS
ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view prices" ON "public"."prices"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Service role can manage prices" ON "public"."prices"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";
