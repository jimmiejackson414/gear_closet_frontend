-- insert auth.users
INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user") VALUES
('00000000-0000-0000-0000-000000000000', 'd0fc7e46-a8a5-4fd4-8ba7-af485013e6fa', 'authenticated', 'authenticated', 'jimmiejackson414@gmail.com', crypt('password', gen_salt('bf')), '2023-02-18 23:31:13.017218+00', NULL, '', '2023-02-18 23:31:12.757017+00', '', NULL, '', '', NULL, '2023-02-18 23:31:13.01781+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-02-18 23:31:12.752281+00', '2023-02-18 23:31:13.019418+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, 'f'),
('00000000-0000-0000-0000-000000000000', '4c6ed4d5-746c-4124-9d3e-b32e5f769476', 'authenticated', 'authenticated', 'shelly.borga@gmail.com', crypt('password', gen_salt('bf')), '2023-02-19 00:01:51.351735+00', NULL, '', '2023-02-19 00:01:51.147035+00', '', NULL, '', '', NULL, '2023-02-19 00:01:51.352369+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-02-19 00:01:51.142802+00', '2023-02-19 00:01:51.353896+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, 'f');

UPDATE "public"."users" SET
  "email" = 'jimmiejackson414@gmail.com',
  "first_name" = 'Jimmie',
  "last_name" = 'Jackson',
  "trail_name" = 'Walk and Eats',
  "image" = NULL,
  "role" = 'USER',
  "subscription_level" = 'LIFE',
  "measuring_system" = 'IMPERIAL',
  "onboard_date" = NULL,
  "address_1" = NULL,
  "address_2" = NULL,
  "city" = 'Issaquah',
  "state" = 'WA',
  "country" = 'US',
  "location" = NULL,
  "created_at" = '2023-11-22 23:09:58.052849+00',
  "updated_at" = '2023-11-29 05:59:56.636325+00'
WHERE id = 'd0fc7e46-a8a5-4fd4-8ba7-af485013e6fa';

UPDATE "public"."users" SET
  "email" = 'shelly.borga@gmail.com',
  "first_name" = 'Shelly',
  "last_name" = 'Borga',
  "trail_name" = NULL,
  "image" = NULL,
  "role" = 'USER',
  "subscription_level" = 'LIFE',
  "measuring_system" = 'IMPERIAL',
  "onboard_date" = NULL,
  "address_1" = NULL,
  "address_2" = NULL,
  "city" = 'Issaquah',
  "state" = 'WA',
  "country" = 'US',
  "location" = NULL,
  "created_at" = '2023-11-22 23:09:58.052849+00',
  "updated_at" = '2023-11-29 05:59:56.636325+00'
WHERE id = '4c6ed4d5-746c-4124-9d3e-b32e5f769476';
