-- Define enums
------------------------
CREATE TYPE "public"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
);

-- Create subscriptions table
------------------------
CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" uuid NOT NULL,
    "stripe_subscription_id" text NOT NULL,
    "price_id" text NOT NULL,
    "status" text NOT NULL,
    "quantity" integer,
    "cancel_at" timestamp with time zone,
    "cancel_at_period_end" boolean NOT NULL DEFAULT false,
    "canceled_at" timestamp with time zone,
    "current_period_end" timestamp with time zone NOT NULL,
    "current_period_start" timestamp with time zone NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "subscriptions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
    CONSTRAINT "subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id")
);

-- Create updated_at trigger
CREATE TRIGGER "set_public_subscriptions_updated_at"
BEFORE UPDATE ON "public"."subscriptions"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

-- Enable RLS
------------------------
ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;

-- Create policies
------------------------
CREATE POLICY "Users can view their own subscriptions" ON "public"."subscriptions"
FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Service role can manage all subscriptions" ON "public"."subscriptions"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
------------------------
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";
REVOKE ALL ON TABLE "public"."subscriptions" FROM "anon";