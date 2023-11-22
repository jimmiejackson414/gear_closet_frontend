//#region structure
type JsonPrimitive = null | number | string | boolean;
type Nested<V> = V | { [s: string]: V | Nested<V> } | Array<V | Nested<V>>;
type Json = Nested<JsonPrimitive>;
type Enum_auth_aal_level = 'aal1' | 'aal2' | 'aal3';
type Enum_auth_code_challenge_method = 'plain' | 's256';
type Enum_auth_factor_status = 'unverified' | 'verified';
type Enum_auth_factor_type = 'totp' | 'webauthn';
type Enum_net_request_status = 'ERROR' | 'PENDING' | 'SUCCESS';
type Enum_pgsodium_key_status = 'default' | 'expired' | 'invalid' | 'valid';
type Enum_pgsodium_key_type = 'aead-det' | 'aead-ietf' | 'auth' | 'generichash' | 'hmacsha256' | 'hmacsha512' | 'kdf' | 'secretbox' | 'secretstream' | 'shorthash' | 'stream_xchacha20';
type Enum_public_measuring_system = 'IMPERIAL' | 'METRIC';
type Enum_public_pricing_plan_interval = 'day' | 'month' | 'week' | 'year';
type Enum_public_pricing_type = 'one_time' | 'recurring';
type Enum_public_resource_type = 'GROUP' | 'USER';
type Enum_public_subscription_level = 'ANNUAL' | 'FREE' | 'LIFE' | 'MONTHLY';
type Enum_public_subscription_status = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
type Enum_public_theme = 'BLUE6' | 'BLUEGREEN6' | 'BREEZE6' | 'CELESTIAL6' | 'CIRCUIT6' | 'COLORBLIND10' | 'DAMASK6' | 'DEPTH6' | 'FLOW6' | 'FORTE6' | 'GENESIS6' | 'GRAYSCALE6' | 'HUECIRCLE19' | 'IONBOARDROOM6' | 'JEWELBRIGHT9' | 'KILTER6' | 'TABLEAU10';
type Enum_public_trip_friend_status = 'ACCEPTED' | 'DECLINED' | 'PENDING';
type Enum_public_trip_invitation_status = 'ACCEPTED' | 'DECLINED' | 'PENDING';
type Enum_public_user_role = 'ADMIN' | 'USER';
interface Table_net_http_response {
  id: number | null;
  status_code: number | null;
  content_type: string | null;
  headers: Json | null;
  content: string | null;
  timed_out: boolean | null;
  error_msg: string | null;
  created: string;
}
interface Table_public_answers {
  id: number;
  content: string | null;
  created_at: string | null;
  updated_at: string;
  user_id: string | null;
  question_id: number | null;
}
interface Table_auth_audit_log_entries {
  instance_id: string | null;
  id: string;
  payload: Json | null;
  created_at: string | null;
  ip_address: string;
}
interface Table_storage_buckets {
  id: string;
  name: string;
  owner: string | null;
  created_at: string | null;
  updated_at: string | null;
  public: boolean | null;
  avif_autodetection: boolean | null;
  file_size_limit: number | null;
  allowed_mime_types: string[] | null;
  owner_id: string | null;
}
interface Table_public_categories {
  id: number;
  created_at: string;
  name: string | null;
  unit: string | null;
  slug: string;
  pack_id: number | null;
  updated_at: string;
}
interface Table_public_category_items {
  id: number;
  category_id: number | null;
  item_id: number | null;
  position: number | null;
  created_at: string | null;
  updated_at: string | null;
}
interface Table_public_comments {
  id: number;
  text: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  pack_id: number;
}
interface Table_public_customers {
  id: string;
  stripe_customer_id: string | null;
  user_id: string;
}
interface Table_auth_flow_state {
  id: string;
  user_id: string | null;
  auth_code: string;
  code_challenge_method: Enum_auth_code_challenge_method;
  code_challenge: string;
  provider_type: string;
  provider_access_token: string | null;
  provider_refresh_token: string | null;
  created_at: string | null;
  updated_at: string | null;
  authentication_method: string;
}
interface Table_public_friends {
  id: number;
  invite_sent_on: string | null;
  invite_accepted_on: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  friend_id: string | null;
}
interface Table_supabase_functions_hooks {
  id: number;
  hook_table_id: number;
  hook_name: string;
  created_at: string;
  request_id: number | null;
}
interface Table_net_http_request_queue {
  id: number;
  method: string;
  url: string;
  headers: Json;
  body: string | null;
  timeout_milliseconds: number;
}
interface Table_auth_identities {
  id: string;
  user_id: string;
  identity_data: Json;
  provider: string;
  last_sign_in_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}
interface Table_auth_instances {
  id: string;
  uuid: string | null;
  raw_base_config: string | null;
  created_at: string | null;
  updated_at: string | null;
}
interface Table_public_items {
  id: number;
  name: string | null;
  generic_type: string | null;
  price: number | null;
  consumable: boolean | null;
  worn: boolean | null;
  quantity: number | null;
  unit: string | null;
  weight: string | null;
  url: string | null;
  slug: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
}
interface Table_pgsodium_key {
  id: string;
  status: Enum_pgsodium_key_status | null;
  created: string;
  expires: string | null;
  key_type: Enum_pgsodium_key_type | null;
  key_id: number | null;
  key_context: string | null;
  name: string | null;
  associated_data: string | null;
  raw_key: string | null;
  raw_key_nonce: string | null;
  parent_key: string | null;
  comment: string | null;
  user_data: string | null;
}
interface Table_analytics_log_events_01_d_9690_e_cd_0_a_4_e_98_a_2_d_9_d_01_a_09489_c_91 {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_6942_dc_85_c_452_4072_99_e_1_813_ff_24_aa_81_e {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_73_a_4_c_865_0_ffb_4641_b_8_d_9_c_923382_bb_700 {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_86_b_5_e_621_0_d_3_f_4_f_69_baf_0_f_3_ef_740_a_4_cec {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_aee_2_b_53_e_4_d_7_c_4706_b_84_d_2_ee_1_c_8_d_3_ea_55 {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_b_250_c_80_e_d_3_d_6_4_fa_4_a_086_eba_6_cc_9861_b_7 {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_c_714_c_694_d_63_c_4_d_4_e_aa_95_42_e_76_c_05_b_6_de {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_dd_523764_6_f_36_4_f_31_8_a_44_8_baaa_86_e_3805 {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_analytics_log_events_e_653981_f_d_1_bc_42_ce_b_15_e_dc_8_fe_56834_a_9 {
  id: string;
  body: Json | null;
  event_message: string | null;
  timestamp: string | null;
}
interface Table_auth_mfa_amr_claims {
  session_id: string;
  created_at: string;
  updated_at: string;
  authentication_method: string;
  id: string;
}
interface Table_auth_mfa_challenges {
  id: string;
  factor_id: string;
  created_at: string;
  verified_at: string | null;
  ip_address: string;
}
interface Table_auth_mfa_factors {
  id: string;
  user_id: string;
  friendly_name: string | null;
  factor_type: Enum_auth_factor_type;
  status: Enum_auth_factor_status;
  created_at: string;
  updated_at: string;
  secret: string | null;
}
interface Table_storage_migrations {
  id: number;
  name: string;
  hash: string;
  executed_at: string | null;
}
interface Table_supabase_functions_migrations {
  version: string;
  inserted_at: string;
}
interface Table_public_notifications {
  id: number;
  title: string | null;
  content: string | null;
  read_on_date: string | null;
  created_at: string | null;
  updated_at: string;
  user_id: string | null;
}
interface Table_storage_objects {
  id: string;
  bucket_id: string | null;
  name: string | null;
  owner: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_accessed_at: string | null;
  metadata: Json | null;
  version: string | null;
  owner_id: string | null;
}
interface Table_public_onboarding_steps {
  user_id: string;
  page: string;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}
interface Table_public_packs {
  id: number;
  name: string | null;
  slug: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  theme: Enum_public_theme | null;
  private: boolean;
  allow_comments: boolean;
}
interface Table_public_polls {
  id: number;
  created_at: string | null;
  updated_at: string;
  user_id: string | null;
  trip_id: number | null;
}
interface Table_public_prices {
  id: string;
  product_id: string | null;
  active: boolean | null;
  description: string | null;
  unit_amount: number | null;
  currency: string | null;
  type: Enum_public_pricing_type | null;
  interval: Enum_public_pricing_plan_interval | null;
  interval_count: number | null;
  trial_period_days: number | null;
  metadata: Json | null;
  identifier: Enum_public_subscription_level | null;
  environment: string | null;
}
interface Table_public_products {
  id: string;
  active: boolean;
  name: Enum_public_subscription_level | null;
  description: string | null;
  image: string | null;
  metadata: Json | null;
  environment: string | null;
}
interface Table_public_questions {
  id: number;
  title: string | null;
  poll_id: number | null;
  created_at: string | null;
  updated_at: string;
  user_id: string | null;
}
interface Table_auth_refresh_tokens {
  instance_id: string | null;
  id: number;
  token: string | null;
  user_id: string | null;
  revoked: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  parent: string | null;
  session_id: string | null;
}
interface Table_public_replies {
  id: number;
  comment_id: number;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  text: string | null;
}
interface Table_auth_saml_providers {
  id: string;
  sso_provider_id: string;
  entity_id: string;
  metadata_xml: string;
  metadata_url: string | null;
  attribute_mapping: Json | null;
  created_at: string | null;
  updated_at: string | null;
}
interface Table_auth_saml_relay_states {
  id: string;
  sso_provider_id: string;
  request_id: string;
  for_email: string | null;
  redirect_to: string | null;
  from_ip_address: string | null;
  created_at: string | null;
  updated_at: string | null;
  flow_state_id: string | null;
}
interface Table_auth_schema_migrations {
  version: string;
}
interface Table_supabase_migrations_schema_migrations {
  version: string;
  statements: string[] | null;
  name: string | null;
}
interface Table_analytics_schema_migrations_01_d_9690_e_cd_0_a_4_e_98_a_2_d_9_d_01_a_09489_c_91 {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_6942_dc_85_c_452_4072_99_e_1_813_ff_24_aa_81_e {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_73_a_4_c_865_0_ffb_4641_b_8_d_9_c_923382_bb_700 {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_86_b_5_e_621_0_d_3_f_4_f_69_baf_0_f_3_ef_740_a_4_cec {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_aee_2_b_53_e_4_d_7_c_4706_b_84_d_2_ee_1_c_8_d_3_ea_55 {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_b_250_c_80_e_d_3_d_6_4_fa_4_a_086_eba_6_cc_9861_b_7 {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_c_714_c_694_d_63_c_4_d_4_e_aa_95_42_e_76_c_05_b_6_de {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_dd_523764_6_f_36_4_f_31_8_a_44_8_baaa_86_e_3805 {
  version: number;
  inserted_at: string | null;
}
interface Table_analytics_schema_migrations_e_653981_f_d_1_bc_42_ce_b_15_e_dc_8_fe_56834_a_9 {
  version: number;
  inserted_at: string | null;
}
interface Table_vault_secrets {
  id: string;
  name: string | null;
  description: string;
  secret: string;
  key_id: string | null;
  nonce: string | null;
  created_at: string;
  updated_at: string;
}
interface Table_auth_sessions {
  id: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  factor_id: string | null;
  aal: Enum_auth_aal_level | null;
  not_after: string | null;
  refreshed_at: string | null;
  user_agent: string | null;
  ip: string | null;
}
interface Table_public_shopping_list_items {
  id: number;
  title: string | null;
  completed: boolean;
  quantity: number | null;
  trip_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  resource_type: Enum_public_resource_type;
  user_id: string | null;
}
interface Table_auth_sso_domains {
  id: string;
  sso_provider_id: string;
  domain: string;
  created_at: string | null;
  updated_at: string | null;
}
interface Table_auth_sso_providers {
  id: string;
  resource_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}
interface Table_public_subscriptions {
  id: string;
  user_id: string;
  status: Enum_public_subscription_status | null;
  metadata: Json | null;
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  created_at: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  stripe_subscription_id: string | null;
}
interface Table_public_todos {
  id: number;
  title: string | null;
  completed: boolean;
  trip_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  resource_type: Enum_public_resource_type;
  user_id: string | null;
}
interface Table_public_trip_details {
  id: number;
  title: string | null;
  url: string | null;
  value: string | null;
  type: string | null;
  trip_id: number | null;
  created_at: string | null;
  updated_at: string;
}
interface Table_public_trip_friends {
  id: number;
  trip_id: number | null;
  accepted_invite_on: string | null;
  created_at: string | null;
  status: Enum_public_trip_friend_status;
  user_id: string | null;
  updated_at: string;
}
interface Table_public_trip_packs {
  id: number;
  trip_id: number | null;
  pack_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
}
interface Table_public_trips {
  id: number;
  created_at: string | null;
  name: string | null;
  description: string | null;
  starting_point: string | null;
  ending_point: string | null;
  starting_date: string | null;
  ending_date: string | null;
  coordinates: Json | null;
  slug: string;
  updated_at: string;
  user_id: string;
}
interface Table_public_user_answers {
  id: number;
  answer_id: number | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string;
  poll_id: number | null;
}
interface Table_auth_users {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: string | null;
  invited_at: string | null;
  confirmation_token: string | null;
  confirmation_sent_at: string | null;
  recovery_token: string | null;
  recovery_sent_at: string | null;
  email_change_token_new: string | null;
  email_change: string | null;
  email_change_sent_at: string | null;
  last_sign_in_at: string | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  phone: string | null;
  phone_confirmed_at: string | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: string | null;
  email_change_token_current: string | null;
  email_change_confirm_status: number | null;
  banned_until: string | null;
  reauthentication_token: string | null;
  reauthentication_sent_at: string | null;
  is_sso_user: boolean;
  deleted_at: string | null;
}
interface Table_public_users {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  trail_name: string | null;
  image: string | null;
  role: Enum_public_user_role | null;
  subscription_level: Enum_public_subscription_level | null;
  measuring_system: Enum_public_measuring_system | null;
  onboard_date: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  created_at: string | null;
  updated_at: string | null;
  location: Json | null;
}
interface Schema_analytics {
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91: Table_analytics_log_events_01_d_9690_e_cd_0_a_4_e_98_a_2_d_9_d_01_a_09489_c_91;
  log_events_6942dc85_c452_4072_99e1_813ff24aa81e: Table_analytics_log_events_6942_dc_85_c_452_4072_99_e_1_813_ff_24_aa_81_e;
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700: Table_analytics_log_events_73_a_4_c_865_0_ffb_4641_b_8_d_9_c_923382_bb_700;
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: Table_analytics_log_events_86_b_5_e_621_0_d_3_f_4_f_69_baf_0_f_3_ef_740_a_4_cec;
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: Table_analytics_log_events_aee_2_b_53_e_4_d_7_c_4706_b_84_d_2_ee_1_c_8_d_3_ea_55;
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: Table_analytics_log_events_b_250_c_80_e_d_3_d_6_4_fa_4_a_086_eba_6_cc_9861_b_7;
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de: Table_analytics_log_events_c_714_c_694_d_63_c_4_d_4_e_aa_95_42_e_76_c_05_b_6_de;
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805: Table_analytics_log_events_dd_523764_6_f_36_4_f_31_8_a_44_8_baaa_86_e_3805;
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9: Table_analytics_log_events_e_653981_f_d_1_bc_42_ce_b_15_e_dc_8_fe_56834_a_9;
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91: Table_analytics_schema_migrations_01_d_9690_e_cd_0_a_4_e_98_a_2_d_9_d_01_a_09489_c_91;
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e: Table_analytics_schema_migrations_6942_dc_85_c_452_4072_99_e_1_813_ff_24_aa_81_e;
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700: Table_analytics_schema_migrations_73_a_4_c_865_0_ffb_4641_b_8_d_9_c_923382_bb_700;
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: Table_analytics_schema_migrations_86_b_5_e_621_0_d_3_f_4_f_69_baf_0_f_3_ef_740_a_4_cec;
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: Table_analytics_schema_migrations_aee_2_b_53_e_4_d_7_c_4706_b_84_d_2_ee_1_c_8_d_3_ea_55;
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: Table_analytics_schema_migrations_b_250_c_80_e_d_3_d_6_4_fa_4_a_086_eba_6_cc_9861_b_7;
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de: Table_analytics_schema_migrations_c_714_c_694_d_63_c_4_d_4_e_aa_95_42_e_76_c_05_b_6_de;
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805: Table_analytics_schema_migrations_dd_523764_6_f_36_4_f_31_8_a_44_8_baaa_86_e_3805;
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9: Table_analytics_schema_migrations_e_653981_f_d_1_bc_42_ce_b_15_e_dc_8_fe_56834_a_9;
}
interface Schema_realtime {

}
interface Schema_auth {
  audit_log_entries: Table_auth_audit_log_entries;
  flow_state: Table_auth_flow_state;
  identities: Table_auth_identities;
  instances: Table_auth_instances;
  mfa_amr_claims: Table_auth_mfa_amr_claims;
  mfa_challenges: Table_auth_mfa_challenges;
  mfa_factors: Table_auth_mfa_factors;
  refresh_tokens: Table_auth_refresh_tokens;
  saml_providers: Table_auth_saml_providers;
  saml_relay_states: Table_auth_saml_relay_states;
  schema_migrations: Table_auth_schema_migrations;
  sessions: Table_auth_sessions;
  sso_domains: Table_auth_sso_domains;
  sso_providers: Table_auth_sso_providers;
  users: Table_auth_users;
}
interface Schema_extensions {

}
interface Schema_graphql {

}
interface Schema_graphql_public {

}
interface Schema_net {
  _http_response: Table_net_http_response;
  http_request_queue: Table_net_http_request_queue;
}
interface Schema_pgsodium {
  key: Table_pgsodium_key;
}
interface Schema_pgsodium_masks {

}
interface Schema_public {
  answers: Table_public_answers;
  categories: Table_public_categories;
  category_items: Table_public_category_items;
  comments: Table_public_comments;
  customers: Table_public_customers;
  friends: Table_public_friends;
  items: Table_public_items;
  notifications: Table_public_notifications;
  onboarding_steps: Table_public_onboarding_steps;
  packs: Table_public_packs;
  polls: Table_public_polls;
  prices: Table_public_prices;
  products: Table_public_products;
  questions: Table_public_questions;
  replies: Table_public_replies;
  shopping_list_items: Table_public_shopping_list_items;
  subscriptions: Table_public_subscriptions;
  todos: Table_public_todos;
  trip_details: Table_public_trip_details;
  trip_friends: Table_public_trip_friends;
  trip_packs: Table_public_trip_packs;
  trips: Table_public_trips;
  user_answers: Table_public_user_answers;
  users: Table_public_users;
}
interface Schema_realtime {

}
interface Schema_storage {
  buckets: Table_storage_buckets;
  migrations: Table_storage_migrations;
  objects: Table_storage_objects;
}
interface Schema_supabase_functions {
  hooks: Table_supabase_functions_hooks;
  migrations: Table_supabase_functions_migrations;
}
interface Schema_supabase_migrations {
  schema_migrations: Table_supabase_migrations_schema_migrations;
}
interface Schema_vault {
  secrets: Table_vault_secrets;
}
interface Database {
  _analytics: Schema__analytics;
  _realtime: Schema__realtime;
  auth: Schema_auth;
  extensions: Schema_extensions;
  graphql: Schema_graphql;
  graphql_public: Schema_graphql_public;
  net: Schema_net;
  pgsodium: Schema_pgsodium;
  pgsodium_masks: Schema_pgsodium_masks;
  public: Schema_public;
  realtime: Schema_realtime;
  storage: Schema_storage;
  supabase_functions: Schema_supabase_functions;
  supabase_migrations: Schema_supabase_migrations;
  vault: Schema_vault;
}
interface Extension {
  extensions: "uuid-ossp" | "pgcrypto" | "pgjwt" | "pg_stat_statements" | "pg_net" | "address_standardizer" | "moddatetime";
  graphql: "pg_graphql";
  pgsodium: "pgsodium";
  vault: "supabase_vault";
}
interface Tables_relationships {
  "public.answers": {
    parent: {
       answers_question_id_fkey: "public.questions";
       answers_user_id_fkey: "public.users";
    };
    children: {
       user_answers_answer_id_fkey: "public.user_answers";
    };
  };
  "storage.buckets": {
    parent: {

    };
    children: {
       objects_bucketId_fkey: "storage.objects";
    };
  };
  "public.categories": {
    parent: {
       categories_pack_id_fkey: "public.packs";
    };
    children: {
       category_items_category_id_fkey: "public.category_items";
    };
  };
  "public.category_items": {
    parent: {
       category_items_category_id_fkey: "public.categories";
       category_items_item_id_fkey: "public.items";
    };
    children: {

    };
  };
  "public.comments": {
    parent: {
       comments_pack_id_fkey: "public.packs";
       comments_user_id_fkey: "public.users";
    };
    children: {
       replies_comment_id_fkey: "public.replies";
    };
  };
  "public.customers": {
    parent: {
       customers_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "auth.flow_state": {
    parent: {

    };
    children: {
       saml_relay_states_flow_state_id_fkey: "auth.saml_relay_states";
    };
  };
  "public.friends": {
    parent: {
       friends_friend_id_fkey: "public.users";
       friends_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "auth.identities": {
    parent: {
       identities_user_id_fkey: "auth.users";
    };
    children: {

    };
  };
  "public.items": {
    parent: {
       items_user_id_fkey: "public.users";
    };
    children: {
       category_items_item_id_fkey: "public.category_items";
    };
  };
  "pgsodium.key": {
    parent: {
       key_parent_key_fkey: "pgsodium.key";
    };
    children: {
       key_parent_key_fkey: "pgsodium.key";
       secrets_key_id_fkey: "vault.secrets";
    };
  };
  "auth.mfa_amr_claims": {
    parent: {
       mfa_amr_claims_session_id_fkey: "auth.sessions";
    };
    children: {

    };
  };
  "auth.mfa_challenges": {
    parent: {
       mfa_challenges_auth_factor_id_fkey: "auth.mfa_factors";
    };
    children: {

    };
  };
  "auth.mfa_factors": {
    parent: {
       mfa_factors_user_id_fkey: "auth.users";
    };
    children: {
       mfa_challenges_auth_factor_id_fkey: "auth.mfa_challenges";
    };
  };
  "public.notifications": {
    parent: {
       notifications_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "storage.objects": {
    parent: {
       objects_bucketId_fkey: "storage.buckets";
    };
    children: {

    };
  };
  "public.onboarding_steps": {
    parent: {
       onboarding_steps_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "public.packs": {
    parent: {
       packs_user_id_fkey: "public.users";
    };
    children: {
       categories_pack_id_fkey: "public.categories";
       comments_pack_id_fkey: "public.comments";
       trip_packs_pack_id_fkey: "public.trip_packs";
    };
  };
  "public.polls": {
    parent: {
       polls_trip_id_fkey: "public.trips";
       polls_user_id_fkey: "public.users";
    };
    children: {
       questions_poll_id_fkey: "public.questions";
       user_answers_poll_id_fkey: "public.user_answers";
    };
  };
  "public.prices": {
    parent: {
       prices_product_id_fkey: "public.products";
    };
    children: {
       subscriptions_price_id_fkey: "public.subscriptions";
    };
  };
  "public.products": {
    parent: {

    };
    children: {
       prices_product_id_fkey: "public.prices";
    };
  };
  "public.questions": {
    parent: {
       questions_poll_id_fkey: "public.polls";
       questions_user_id_fkey: "public.users";
    };
    children: {
       answers_question_id_fkey: "public.answers";
    };
  };
  "auth.refresh_tokens": {
    parent: {
       refresh_tokens_session_id_fkey: "auth.sessions";
    };
    children: {

    };
  };
  "public.replies": {
    parent: {
       replies_comment_id_fkey: "public.comments";
       replies_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "auth.saml_providers": {
    parent: {
       saml_providers_sso_provider_id_fkey: "auth.sso_providers";
    };
    children: {

    };
  };
  "auth.saml_relay_states": {
    parent: {
       saml_relay_states_flow_state_id_fkey: "auth.flow_state";
       saml_relay_states_sso_provider_id_fkey: "auth.sso_providers";
    };
    children: {

    };
  };
  "vault.secrets": {
    parent: {
       secrets_key_id_fkey: "pgsodium.key";
    };
    children: {

    };
  };
  "auth.sessions": {
    parent: {
       sessions_user_id_fkey: "auth.users";
    };
    children: {
       mfa_amr_claims_session_id_fkey: "auth.mfa_amr_claims";
       refresh_tokens_session_id_fkey: "auth.refresh_tokens";
    };
  };
  "public.shopping_list_items": {
    parent: {
       shopping_list_items_trip_id_fkey: "public.trips";
       shopping_list_items_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "auth.sso_domains": {
    parent: {
       sso_domains_sso_provider_id_fkey: "auth.sso_providers";
    };
    children: {

    };
  };
  "auth.sso_providers": {
    parent: {

    };
    children: {
       saml_providers_sso_provider_id_fkey: "auth.saml_providers";
       saml_relay_states_sso_provider_id_fkey: "auth.saml_relay_states";
       sso_domains_sso_provider_id_fkey: "auth.sso_domains";
    };
  };
  "public.subscriptions": {
    parent: {
       subscriptions_price_id_fkey: "public.prices";
       subscriptions_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "public.todos": {
    parent: {
       todos_trip_id_fkey: "public.trips";
       todos_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "public.trip_details": {
    parent: {
       trip_details_trip_id_fkey: "public.trips";
    };
    children: {

    };
  };
  "public.trip_friends": {
    parent: {
       trip_friends_trip_id_fkey: "public.trips";
       trip_friends_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "public.trip_packs": {
    parent: {
       trip_packs_pack_id_fkey: "public.packs";
       trip_packs_trip_id_fkey: "public.trips";
       trip_packs_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "public.trips": {
    parent: {
       trips_user_id_fkey: "public.users";
    };
    children: {
       polls_trip_id_fkey: "public.polls";
       shopping_list_items_trip_id_fkey: "public.shopping_list_items";
       todos_trip_id_fkey: "public.todos";
       trip_details_trip_id_fkey: "public.trip_details";
       trip_friends_trip_id_fkey: "public.trip_friends";
       trip_packs_trip_id_fkey: "public.trip_packs";
    };
  };
  "public.user_answers": {
    parent: {
       user_answers_answer_id_fkey: "public.answers";
       user_answers_poll_id_fkey: "public.polls";
       user_answers_user_id_fkey: "public.users";
    };
    children: {

    };
  };
  "auth.users": {
    parent: {

    };
    children: {
       identities_user_id_fkey: "auth.identities";
       mfa_factors_user_id_fkey: "auth.mfa_factors";
       sessions_user_id_fkey: "auth.sessions";
       users_id_fkey: "public.users";
    };
  };
  "public.users": {
    parent: {
       users_id_fkey: "auth.users";
    };
    children: {
       answers_user_id_fkey: "public.answers";
       comments_user_id_fkey: "public.comments";
       customers_user_id_fkey: "public.customers";
       friends_friend_id_fkey: "public.friends";
       friends_user_id_fkey: "public.friends";
       items_user_id_fkey: "public.items";
       notifications_user_id_fkey: "public.notifications";
       onboarding_steps_user_id_fkey: "public.onboarding_steps";
       packs_user_id_fkey: "public.packs";
       polls_user_id_fkey: "public.polls";
       questions_user_id_fkey: "public.questions";
       replies_user_id_fkey: "public.replies";
       shopping_list_items_user_id_fkey: "public.shopping_list_items";
       subscriptions_user_id_fkey: "public.subscriptions";
       todos_user_id_fkey: "public.todos";
       trip_friends_user_id_fkey: "public.trip_friends";
       trip_packs_user_id_fkey: "public.trip_packs";
       trips_user_id_fkey: "public.trips";
       user_answers_user_id_fkey: "public.user_answers";
    };
  };
}
//#endregion

//#region select
type SelectedTable = { id: string; schema: string; table: string };

type SelectDefault = {
  /**
   * Define the "default" behavior to use for the tables in the schema.
   * If true, select all tables in the schema.
   * If false, select no tables in the schema.
   * If "structure", select only the structure of the tables in the schema but not the data.
   * @defaultValue true
   */
  $default?: SelectObject;
};

type DefaultKey = keyof SelectDefault;

type SelectObject = boolean | "structure";

type ExtensionsSelect<TSchema extends keyof Database> =
  TSchema extends keyof Extension
    ? {
        /**
         * Define if you want to select the extension data.
         * @defaultValue false
         */
        $extensions?:
          | boolean
          | {
              [TExtension in Extension[TSchema]]?: boolean;
            };
      }
    : {};

type SelectConfig = SelectDefault & {
  [TSchema in keyof Database]?:
    | SelectObject
    | (SelectDefault &
        ExtensionsSelect<TSchema> & {
          [TTable in keyof Database[TSchema]]?: SelectObject;
        });
};

// Apply the __default key if it exists to each level of the select config (schemas and tables)
type ApplyDefault<TSelectConfig extends SelectConfig> = {
  [TSchema in keyof Database]-?: {
    [TTable in keyof Database[TSchema]]-?: TSelectConfig[TSchema] extends SelectObject
      ? TSelectConfig[TSchema]
      : TSelectConfig[TSchema] extends Record<any, any>
      ? TSelectConfig[TSchema][TTable] extends SelectObject
        ? TSelectConfig[TSchema][TTable]
        : TSelectConfig[TSchema][DefaultKey] extends SelectObject
        ? TSelectConfig[TSchema][DefaultKey]
        : TSelectConfig[DefaultKey] extends SelectObject
        ? TSelectConfig[DefaultKey]
        : true
      : TSelectConfig[DefaultKey] extends SelectObject
      ? TSelectConfig[DefaultKey]
      : true;
  };
};

type ExtractValues<T> = T extends object ? T[keyof T] : never;

type GetSelectedTable<TSelectSchemas extends SelectConfig> = ExtractValues<
  ExtractValues<{
    [TSchema in keyof TSelectSchemas]: {
      [TTable in keyof TSelectSchemas[TSchema] as TSelectSchemas[TSchema][TTable] extends true
        ? TTable
        : never]: TSchema extends string
        ? TTable extends string
          ? { id: `${TSchema}.${TTable}`; schema: TSchema; table: TTable }
          : never
        : never;
    };
  }>
>;
//#endregion

//#region transform
type TransformMode = "auto" | "strict" | "unsafe" | undefined;


type TransformOptions<TTransformMode extends TransformMode> = {
  /**
   * The type for defining the transform mode.
   *
   * There are three modes available:
   *
   * - "auto" - Automatically transform the data for any columns, tables or schemas that have not been specified in the config
   * - "strict" - In this mode, Snaplet expects a transformation to be given in the config for every column in the database. If any columns have not been provided in the config, Snaplet will not capture the snapshot, but instead tell you which columns, tables, or schemas have not been given
   * - "unsafe" - This mode copies over values without any transformation. If a transformation is given for a column in the config, the transformation will be used instead
   * @defaultValue "unsafe"
   */
  $mode?: TTransformMode;
  /**
   * If true, parse JSON objects during transformation.
   * @defaultValue false
   */
  $parseJson?: boolean;
};

// This type is here to turn a Table with scalars values (string, number, etc..) for columns into a Table
// with either scalar values or a callback function that returns the scalar value
type ColumnWithCallback<TSchema extends keyof Database, TTable extends keyof Database[TSchema]> = {
  [TColumn in keyof Database[TSchema][TTable]]:
    Database[TSchema][TTable][TColumn] |
    ((ctx: {
      row: Database[TSchema][TTable];
      value: Database[TSchema][TTable][TColumn];
    }) => Database[TSchema][TTable][TColumn])
};

type DatabaseWithCallback = {
  [TSchema in keyof Database]: {
    [TTable in keyof Database[TSchema]]:
      | ((ctx: {
          row: Database[TSchema][TTable];
          rowIndex: number;
        }) => ColumnWithCallback<TSchema, TTable>)
      | ColumnWithCallback<TSchema, TTable>
  };
};

type SelectDatabase<TSelectedTable extends SelectedTable> = {
  [TSchema in keyof DatabaseWithCallback as TSchema extends NonNullable<TSelectedTable>["schema"]
    ? TSchema
    : never]: {
    [TTable in keyof DatabaseWithCallback[TSchema] as TTable extends Extract<
      TSelectedTable,
      { schema: TSchema }
    >["table"]
      ? TTable
      : never]: DatabaseWithCallback[TSchema][TTable];
  };
};

type PartialTransform<T> = T extends (...args: infer P) => infer R
  ? (...args: P) => Partial<R>
  : Partial<T>;

type IsNever<T> = [T] extends [never] ? true : false;

type TransformConfig<
  TTransformMode extends TransformMode,
  TSelectedTable extends SelectedTable
> = TransformOptions<TTransformMode> &
  (IsNever<TSelectedTable> extends true
    ? never
    : SelectDatabase<TSelectedTable> extends infer TSelectedDatabase
    ? TTransformMode extends "strict"
      ? TSelectedDatabase
      : {
          [TSchema in keyof TSelectedDatabase]?: {
            [TTable in keyof TSelectedDatabase[TSchema]]?: PartialTransform<
              TSelectedDatabase[TSchema][TTable]
            >;
          };
        }
    : never);
//#endregion

//#region subset
type NonEmptyArray<T> = [T, ...T[]];

/**
 * Represents an exclusive row limit percent.
 */
type ExclusiveRowLimitPercent =
| {
  percent?: never;
  /**
   * Represents a strict limit of the number of rows captured on target
   */
  rowLimit: number
}
| {
  /**
   * Represents a random percent to be captured on target (1-100)
   */
  percent: number;
  rowLimit?: never
}

// Get the type of a target in the config.subset.targets array
type SubsetTarget<TSelectedTable extends SelectedTable> = {
  /**
   * The ID of the table to target
   */
  table: TSelectedTable["id"];
  /**
   * The order on which your target will be filtered useful with rowLimit parameter
   *
   * @example
   * orderBy: `"User"."createdAt" desc`
   */
  orderBy?: string;
} & (
  | {
    /**
     * The where filter to be applied on the target
     *
     * @example
     * where: `"_prisma_migrations"."name" IN ('migration1', 'migration2')`
     */
    where: string
  } & Partial<ExclusiveRowLimitPercent>
  | {
    /**
     * The where filter to be applied on the target
     */
    where?: string
  } & ExclusiveRowLimitPercent
);

type GetSelectedTableChildrenKeys<TTable extends keyof Tables_relationships> = keyof Tables_relationships[TTable]['children']
type GetSelectedTableParentKeys<TTable extends keyof Tables_relationships> = keyof Tables_relationships[TTable]['parent']
type GetSelectedTableRelationsKeys<TTable extends keyof Tables_relationships> = GetSelectedTableChildrenKeys<TTable> | GetSelectedTableParentKeys<TTable>
type SelectedTablesWithRelationsIds<TSelectedTable extends SelectedTable['id']> = TSelectedTable extends keyof Tables_relationships ? TSelectedTable : never

/**
 * Represents the options to choose the followNullableRelations of subsetting.
 */
type FollowNullableRelationsOptions<TSelectedTable extends SelectedTable> =
  // Type can be a global boolean definition
  boolean
  // Or can be a mix of $default and table specific definition
  | { $default: boolean } & ({
  // If it's a table specific definition and the table has relationships
  [TTable in SelectedTablesWithRelationsIds<TSelectedTable["id"]>]?:
    // It's either a boolean or a mix of $default and relationship specific definition
    boolean |
    {
      [Key in GetSelectedTableRelationsKeys<TTable> | '$default']?:  boolean
    }
});


/**
 * Represents the options to choose the maxCyclesLoop of subsetting.
 */
type MaxCyclesLoopOptions<TSelectedTable extends SelectedTable> =
// Type can be a global number definition
number
// Or can be a mix of $default and table specific definition
| { $default: number } & ({
  // If it's a table specific definition and the table has relationships
  [TTable in SelectedTablesWithRelationsIds<TSelectedTable["id"]>]?:
    // It's either a number or a mix of $default and relationship specific definition
    number |
    {
      [Key in GetSelectedTableRelationsKeys<TTable> | '$default']?:  number
    }
});


/**
 * Represents the options to choose the maxChildrenPerNode of subsetting.
 */
type MaxChildrenPerNodeOptions<TSelectedTable extends SelectedTable> =
// Type can be a global number definition
number
// Or can be a mix of $default and table specific definition
| { $default: number } & ({
  // If it's a table specific definition and the table has relationships
  [TTable in SelectedTablesWithRelationsIds<TSelectedTable["id"]>]?:
    // It's either a number or a mix of $default and relationship specific definition
    number |
    {
      [Key in GetSelectedTableRelationsKeys<TTable> | '$default']?:  number
    }
});

/**
 * Represents the configuration for subsetting the snapshot.
 */
type SubsetConfig<TSelectedTable extends SelectedTable> = {
  /**
   * Specifies whether subsetting is enabled.
   *  @defaultValue true
   */
  enabled?: boolean;

  /**
   * Specifies the version of the subsetting algorithm
   *
   * @defaultValue "3"
   * @deprecated
   */
  version?: "1" | "2" | "3";

  /**
   * Specifies whether to eagerly load related tables.
   * @defaultValue false
   */
  eager?: boolean;

  /**
   * Specifies whether to keep tables that are not connected to any other tables.
   * @defaultValue false
   */
  keepDisconnectedTables?: boolean;

  /**
   * Specifies whether to follow nullable relations.
   * @defaultValue false
   */
  followNullableRelations?: FollowNullableRelationsOptions<TSelectedTable>;

  /**
   *  Specifies the maximum number of children per node.
   *  @defaultValue unlimited
   */
  maxChildrenPerNode?: MaxChildrenPerNodeOptions<TSelectedTable>;

  /**
   * Specifies the maximum number of cycles in a loop.
   * @defaultValue 10
   */
  maxCyclesLoop?: MaxCyclesLoopOptions<TSelectedTable>;

  /**
   * Specifies the root targets for subsetting. Must be a non-empty array
   */
  targets: NonEmptyArray<SubsetTarget<TSelectedTable>>;

  /**
   * Specifies the task sorting algorithm.
   * By default, the algorithm will not sort the tasks.
   */
  taskSortAlgorithm?: "children" | "idsCount";
}
//#endregion


  //#region introspect
  type VirtualForeignKey<
    TTFkTable extends SelectedTable,
    TTargetTable extends SelectedTable
  > =
  {
    fkTable: TTFkTable['id'];
    targetTable: TTargetTable['id'];
    keys: NonEmptyArray<
      {
        // TODO: Find a way to strongly type this to provide autocomplete when writing the config
        /**
         * The column name present in the fkTable that is a foreign key to the targetTable
         */
        fkColumn: string;
        /**
         * The column name present in the targetTable that is a foreign key to the fkTable
         */
        targetColumn: string;
      }
    >
  }

  type IntrospectConfig<TSelectedTable extends SelectedTable> = {
    /**
     * Allows you to declare virtual foreign keys that are not present as foreign keys in the database.
     * But are still used and enforced by the application.
     */
    virtualForeignKeys?: Array<VirtualForeignKey<TSelectedTable, TSelectedTable>>;
  }
  //#endregion

type Validate<T, Target> = {
  [K in keyof T]: K extends keyof Target ? T[K] : never;
};

type TypedConfig<
  TSelectConfig extends SelectConfig,
  TTransformMode extends TransformMode
> =  GetSelectedTable<
  ApplyDefault<TSelectConfig>
> extends SelectedTable
  ? {
    /**
     * Parameter to configure the generation of data.
     * {@link https://docs.snaplet.dev/core-concepts/generate}
     */
      generate?: {
        alias?: import("./snaplet-client").Alias;
        models?: import("./snaplet-client").UserModels;
        run: (snaplet: import("./snaplet-client").SnapletClientBase) => Promise<any>;
      }
    /**
     * Parameter to configure the inclusion/exclusion of schemas and tables from the snapshot.
     * {@link https://docs.snaplet.dev/reference/configuration#select}
     */
      select?: Validate<TSelectConfig, SelectConfig>;
      /**
       * Parameter to configure the transformations applied to the data.
       * {@link https://docs.snaplet.dev/reference/configuration#transform}
       */
      transform?: TransformConfig<TTransformMode, GetSelectedTable<ApplyDefault<TSelectConfig>>>;
      /**
       * Parameter to capture a subset of the data.
       * {@link https://docs.snaplet.dev/reference/configuration#subset}
       */
      subset?: SubsetConfig<GetSelectedTable<ApplyDefault<TSelectConfig>>>;

      /**
       * Parameter to augment the result of the introspection of your database.
       * {@link https://docs.snaplet.dev/references/data-operations/introspect}
       */
      introspect?: IntrospectConfig<GetSelectedTable<ApplyDefault<TSelectConfig>>>;
    }
  : never;

declare module "snaplet" {
  class JsonNull {}
  type JsonClass = typeof JsonNull;
  /**
   * Use this value to explicitely set a json or jsonb column to json null instead of the database NULL value.
   */
  export const jsonNull: InstanceType<JsonClass>;
  /**
  * Define the configuration for Snaplet capture process.
  * {@link https://docs.snaplet.dev/reference/configuration}
  */
  export function defineConfig<
    TSelectConfig extends SelectConfig,
    TTransformMode extends TransformMode = undefined
  >(
    config: TypedConfig<TSelectConfig, TTransformMode>
  ): TypedConfig<TSelectConfig, TTransformMode>;
}