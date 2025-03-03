-- Create customers table
------------------------
CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "stripe_customer_id" text NOT NULL,
    "profile_id" uuid NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
    CONSTRAINT "customers_stripe_customer_id_key" UNIQUE ("stripe_customer_id")
);

-- Create updated_at trigger
CREATE TRIGGER "set_public_customers_updated_at"
BEFORE UPDATE ON "public"."customers"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

-- Enable RLS
------------------------
ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

-- Define policies
------------------------
CREATE POLICY "Users can view their own customer data" ON "public"."customers"
FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Service role can manage all customers" ON "public"."customers"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";
REVOKE ALL ON TABLE "public"."customers" FROM "anon";
