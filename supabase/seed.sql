-- supabase/seed.sql
--
-- create test users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'service_role',
    'service_role', -- Role for admin
    'admin@gearcloset.com',
    extensions.crypt('password', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    TRUE,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    "extensions"."uuid_generate_v4"(),
    'authenticated',
    'authenticated', -- Role for regular user
    'jimmiejackson414@gmail.com',
    extensions.crypt('password', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    FALSE,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  );

-- Common INSERT for auth.identities
INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES 
  (
    "extensions"."uuid_generate_v4"(),
    "extensions"."uuid_generate_v4"(),
    (SELECT id FROM auth.users WHERE email = 'admin@gearcloset.com'), -- Use a subquery to get the correct user id
    format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'admin@gearcloset.com')::text, 'admin@gearcloset.com')::jsonb,
    'email',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    "extensions"."uuid_generate_v4"(),
    "extensions"."uuid_generate_v4"(),
    (SELECT id FROM auth.users WHERE email = 'jimmiejackson414@gmail.com'), -- Use a subquery to get the correct user id
    format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'jimmiejackson414@gmail.com')::text, 'jimmiejackson414@gmail.com')::jsonb,
    'email',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );

-- Insert Stripe products for subscriptions
INSERT INTO "public"."products" ("id", "active", "name", "description", "image", "metadata", "environment") VALUES
('prod_MBUoVUuqPMhSzr', 't', 'LIFE', 'Life Subscription', NULL, NULL, 'development'),
('prod_MBUp4I7PECSUt8', 't', 'FREE', 'Free Subscription', NULL, NULL, 'development'),
('prod_MBUqTPNMOEXkud', 't', 'ANNUAL', 'Anual Subscription', NULL, NULL, 'development'),
('prod_MBUqb4q7Fmbr5w', 't', 'MONTHLY', 'Monthly Subscription', NULL, NULL, 'development');

-- Insert Stripe prices for products
INSERT INTO "public"."prices" ("id", "product_id", "active", "description", "unit_amount", "currency", "type", "interval", "interval_count", "trial_period_days", "metadata", "identifier", "environment") VALUES
('price_1LT7p4ETbN7lq0iRI7h3f6yt', 'prod_MBUoVUuqPMhSzr', 't', 'Life price', 0, NULL, 'recurring', 'year', NULL, NULL, NULL, 'LIFE', 'development'),
('price_1LT7q3ETbN7lq0iRkA2h6Pz9', 'prod_MBUp4I7PECSUt8', 't', 'Free price', 0, NULL, 'recurring', 'year', NULL, NULL, NULL, 'FREE', 'development'),
('price_1LT7qZETbN7lq0iR8XATvvWr', 'prod_MBUqb4q7Fmbr5w', 't', 'Monthly price', 199, NULL, 'recurring', 'month', NULL, NULL, NULL, 'MONTHLY', 'development'),
('price_1LT7r2ETbN7lq0iRRyXeOjcw', 'prod_MBUqTPNMOEXkud', 't', 'Annual price', 1999, NULL, 'recurring', 'year', NULL, NULL, NULL, 'ANNUAL', 'development');