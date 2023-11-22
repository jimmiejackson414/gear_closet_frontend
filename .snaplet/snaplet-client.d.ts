type JsonPrimitive = null | number | string | boolean;
type Nested<V> = V | { [s: string]: V | Nested<V> } | Array<V | Nested<V>>;
type Json = Nested<JsonPrimitive>;

type ColumnValueCallbackContext = {
  /**
   * The seed of the field's model.
   *
   * \@example
   * ```ts
   * "<hash>/0/users/0"
   * ```
   */
  modelSeed: string;
  /**
   * The seed of the field.
   *
   * \@example
   * ```ts
   * "<hash>/0/users/0/email"
   * ```
   */
  seed: string;
};

/**
 * helper type to get the possible values of a scalar field
 */
type ColumnValue<T> = T | ((ctx: ColumnValueCallbackContext) => T);

/**
 * helper type to map a record of scalars to a record of ColumnValue
 */
type MapToColumnValue<T> = { [K in keyof T]: ColumnValue<T[K]> };

/**
 * Create an array of `n` models.
 *
 * Can be read as "Generate `model` times `n`".
 *
 * @param `n` The number of models to generate.
 * @param `callbackFn` The `x` function calls the `callbackFn` function one time for each element in the array.
 *
 * @example Generate 10 users:
 * ```ts
 * snaplet.users((x) => x(10));
 * ```
 *
 * @example Generate 3 projects with a specific name:
 * ```ts
 * snaplet.projects((x) => x(3, (index) => ({ name: `Project ${index}` })));
 * ```
 */
declare function xCallbackFn<T>(
  n: number | MinMaxOption,
  callbackFn?: (index: number) => T
): Array<T>;

type ChildCallbackInputs<T> = (
  x: typeof xCallbackFn<T>,
) => Array<T>;

/**
 * all the possible types for a child field
 */
type ChildInputs<T> = Array<T> | ChildCallbackInputs<T>;

/**
 * omit some keys TKeys from a child field
 * @example we remove ExecTask from the Snapshot child field values as we're coming from ExecTask
 * type ExecTaskChildrenInputs<TPath extends string[]> = {
 *   Snapshot: OmitChildInputs<SnapshotChildInputs<[...TPath, "Snapshot"]>, "ExecTask">;
 * };
 */
type OmitChildInputs<T, TKeys extends string> = T extends ChildCallbackInputs<
  infer U
>
  ? ChildCallbackInputs<Omit<U, TKeys>>
  : T extends Array<infer U>
  ? Array<Omit<U, TKeys>>
  : never;

type ConnectCallbackContext<TGraph, TPath extends string[]> = {
  /**
   * The branch of the current iteration for the relationship field.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#branch | documentation}.
   */
  branch: GetBranch<TGraph, TPath>;
  /**
   * The plan's graph.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#graph | documentation}.
   */
  graph: TGraph;
  /**
   * The index of the current iteration.
   */
  index: number;
  /**
   * The seed of the relationship field.
   */
  seed: string;
  /**
   * The plan's store.
   */
  store: Store;
};

/**
 * the callback function we can pass to a parent field to connect it to another model
 * @example
 * snaplet.Post({ User: (ctx) => ({ id: ctx.store.User[0] }) })
 */
type ConnectCallback<T, TGraph, TPath extends string[]> = (
  ctx: ConnectCallbackContext<TGraph, TPath>
) => T;

/**
 * compute the Graph type and the tracked path to pass to the connect callback
 */
type ParentCallbackInputs<T, TPath extends string[]> = TPath extends [
  infer TRoot,
  ...infer TRest extends string[],
]
  ? TRoot extends keyof Graph
    ? MergeGraphParts<Graph[TRoot]> extends infer TGraph
      ? ConnectCallback<T, TGraph, TRest>
      : never
    : never
  : never;

type ParentInputs<T, TPath extends string[]> =
  | T
  | ParentCallbackInputs<T, TPath>;

/**
 * omit some keys TKeys from a parent field
 * @example we remove Member from the Organization and User parent fields values as we're coming from Member
 * type MemberParentsInputs<TPath extends string[]> = {
 *   Organization: OmitParentInputs<OrganizationParentInputs<[...TPath, "Organization"]>, "Member", [...TPath, "Organization"]>;
 *   User: OmitParentInputs<UserParentInputs<[...TPath, "User"]>, "Member", [...TPath, "User"]>;
 * };
 */
type OmitParentInputs<
  T,
  TKeys extends string,
  TPath extends string[],
> = T extends ConnectCallback<infer U, any, any>
  ? ParentCallbackInputs<Omit<U, TKeys>, TPath>
  : Omit<T, TKeys>;

/**
 * compute the inputs type for a given model
 */
type Inputs<TScalars, TParents, TChildren> = Partial<
  MapToColumnValue<TScalars> & TParents & TChildren
>;

type OmitChildGraph<
  T extends Array<unknown>,
  TKeys extends string,
> = T extends Array<
  infer TGraph extends { Scalars: any; Parents: any; Children: any }
>
  ? Array<{
      Scalars: TGraph["Scalars"];
      Parents: TGraph["Parents"];
      Children: Omit<TGraph["Children"], TKeys>;
    }>
  : never;

type OmitParentGraph<
  T extends Array<unknown>,
  TKeys extends string,
> = T extends Array<
  infer TGraph extends { Scalars: any; Parents: any; Children: any }
>
  ? Array<{
      Scalars: TGraph["Scalars"];
      Parents: Omit<TGraph["Parents"], TKeys>;
      Children: TGraph["Children"];
    }>
  : never;

type UnwrapArray<T> = T extends Array<infer U> ? U : T;

type DeepUnwrapKeys<TGraph, TKeys extends any[]> = TKeys extends [
  infer THead,
  ...infer TTail,
]
  ? TTail extends any[]
    ? {
        [P in keyof TGraph]: P extends THead
          ? DeepUnwrapKeys<UnwrapArray<TGraph[P]>, TTail>
          : TGraph[P];
      }
    : TGraph
  : TGraph;

type GetBranch<T, K extends any[]> = T extends Array<infer U>
  ? DeepUnwrapKeys<U, K>
  : T;

type MergeGraphParts<T> = T extends Array<
  infer U extends { Scalars: unknown; Parents: unknown; Children: unknown }
>
  ? Array<
      U["Scalars"] & {
        [K in keyof U["Children"]]: MergeGraphParts<U["Children"][K]>;
      } & {
        [K in keyof U["Parents"]]: MergeGraphParts<
          U["Parents"][K]
        > extends Array<infer TParent>
          ? TParent
          : never;
      }
    >
  : never;

/**
 * the configurable map of models' generate and connect functions
 */
export type UserModels = {
  [KStore in keyof Store]?: Store[KStore] extends Array<
    infer TFields extends Record<string, any>
  >
    ? {
        connect?: (ctx: { store: Store }) => TFields;
        data?: Partial<MapToColumnValue<TFields>>;
      }
    : never;
};

type PlanOptions = {
  /**
   * Connect the missing relationships to one of the corresponding models in the store.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-autoconnect-option | documentation}.
   */
  autoConnect?: boolean;
  /**
   * Provide custom data generation and connect functions for this plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-autoconnect-option | documentation}.
   */
  models?: UserModels;
  /**
   * Pass a custom store instance to use for this plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#augmenting-external-data-with-createstore | documentation}.
   */
  store?: StoreInstance;
  /**
   * Use a custom seed for this plan.
   */
  seed?: string;
};

/**
 * the plan is extending PromiseLike so it can be awaited
 * @example
 * await snaplet.User({ name: "John" });
 */
export interface Plan extends PromiseLike<any> {
  generate: (initialStore?: Store) => Promise<Store>;
  /**
   * Compose multiple plans together, injecting the store of the previous plan into the next plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-pipe | documentation}.
   */
  pipe: Pipe;
  /**
   * Compose multiple plans together, without injecting the store of the previous plan into the next plan.
   * All stores stay independent and are merged together once all the plans are generated.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-merge | documentation}.
   */
  merge: Merge;
}

type Pipe = (plans: Plan[], options?: { models?: UserModels, seed?: string }) => Plan;

type Merge = (plans: Plan[], options?: { models?: UserModels, seed?: string }) => Plan;

type StoreInstance<T extends Partial<Store> = {}> = {
  _store: T;
  toSQL: () => string[];
};

type CreateStore = <T extends Partial<Store>>(
  initialData?: T,
  options?: { external: boolean },
) => StoreInstance<T>;
type Store = {
  _http_response: Array<_http_responseScalars>;
  answers: Array<answersScalars>;
  audit_log_entries: Array<audit_log_entriesScalars>;
  buckets: Array<bucketsScalars>;
  categories: Array<categoriesScalars>;
  category_items: Array<category_itemsScalars>;
  comments: Array<commentsScalars>;
  customers: Array<customersScalars>;
  flow_state: Array<flow_stateScalars>;
  friends: Array<friendsScalars>;
  hooks: Array<hooksScalars>;
  http_request_queue: Array<http_request_queueScalars>;
  identities: Array<identitiesScalars>;
  instances: Array<instancesScalars>;
  items: Array<itemsScalars>;
  key: Array<keyScalars>;
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91: Array<log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars>;
  log_events_6942dc85_c452_4072_99e1_813ff24aa81e: Array<log_events_6942dc85_c452_4072_99e1_813ff24aa81eScalars>;
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700: Array<log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars>;
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: Array<log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars>;
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: Array<log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars>;
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: Array<log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars>;
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de: Array<log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars>;
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805: Array<log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars>;
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9: Array<log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars>;
  mfa_amr_claims: Array<mfa_amr_claimsScalars>;
  mfa_challenges: Array<mfa_challengesScalars>;
  mfa_factors: Array<mfa_factorsScalars>;
  storage_migrations: Array<storage_migrationsScalars>;
  supabase_functions_migrations: Array<supabase_functions_migrationsScalars>;
  notifications: Array<notificationsScalars>;
  objects: Array<objectsScalars>;
  onboarding_steps: Array<onboarding_stepsScalars>;
  packs: Array<packsScalars>;
  polls: Array<pollsScalars>;
  prices: Array<pricesScalars>;
  products: Array<productsScalars>;
  questions: Array<questionsScalars>;
  refresh_tokens: Array<refresh_tokensScalars>;
  replies: Array<repliesScalars>;
  saml_providers: Array<saml_providersScalars>;
  saml_relay_states: Array<saml_relay_statesScalars>;
  auth_schema_migrations: Array<auth_schema_migrationsScalars>;
  supabase_migrations_schema_migrations: Array<supabase_migrations_schema_migrationsScalars>;
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91: Array<schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars>;
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e: Array<schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eScalars>;
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700: Array<schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars>;
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: Array<schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars>;
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: Array<schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars>;
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: Array<schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars>;
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de: Array<schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars>;
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805: Array<schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars>;
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9: Array<schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars>;
  secrets: Array<secretsScalars>;
  sessions: Array<sessionsScalars>;
  shopping_list_items: Array<shopping_list_itemsScalars>;
  sso_domains: Array<sso_domainsScalars>;
  sso_providers: Array<sso_providersScalars>;
  subscriptions: Array<subscriptionsScalars>;
  todos: Array<todosScalars>;
  trip_details: Array<trip_detailsScalars>;
  trip_friends: Array<trip_friendsScalars>;
  trip_packs: Array<trip_packsScalars>;
  trips: Array<tripsScalars>;
  user_answers: Array<user_answersScalars>;
  auth_users: Array<auth_usersScalars>;
  public_users: Array<public_usersScalars>;
};
type aal_levelEnum = "aal1" | "aal2" | "aal3";
type code_challenge_methodEnum = "plain" | "s256";
type factor_statusEnum = "unverified" | "verified";
type factor_typeEnum = "totp" | "webauthn";
type request_statusEnum = "ERROR" | "PENDING" | "SUCCESS";
type key_statusEnum = "default" | "expired" | "invalid" | "valid";
type key_typeEnum = "aead-det" | "aead-ietf" | "auth" | "generichash" | "hmacsha256" | "hmacsha512" | "kdf" | "secretbox" | "secretstream" | "shorthash" | "stream_xchacha20";
type measuring_systemEnum = "IMPERIAL" | "METRIC";
type pricing_plan_intervalEnum = "day" | "month" | "week" | "year";
type pricing_typeEnum = "one_time" | "recurring";
type resource_typeEnum = "GROUP" | "USER";
type subscription_levelEnum = "ANNUAL" | "FREE" | "LIFE" | "MONTHLY";
type subscription_statusEnum = "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
type themeEnum = "BLUE6" | "BLUEGREEN6" | "BREEZE6" | "CELESTIAL6" | "CIRCUIT6" | "COLORBLIND10" | "DAMASK6" | "DEPTH6" | "FLOW6" | "FORTE6" | "GENESIS6" | "GRAYSCALE6" | "HUECIRCLE19" | "IONBOARDROOM6" | "JEWELBRIGHT9" | "KILTER6" | "TABLEAU10";
type trip_friend_statusEnum = "ACCEPTED" | "DECLINED" | "PENDING";
type trip_invitation_statusEnum = "ACCEPTED" | "DECLINED" | "PENDING";
type user_roleEnum = "ADMIN" | "USER";
type _http_responseScalars = {
  /**
   * Column `_http_response.id`.
   */
  id: number | null;
  /**
   * Column `_http_response.status_code`.
   */
  status_code: number | null;
  /**
   * Column `_http_response.content_type`.
   */
  content_type: string | null;
  /**
   * Column `_http_response.headers`.
   */
  headers: Json | null;
  /**
   * Column `_http_response.content`.
   */
  content: string | null;
  /**
   * Column `_http_response.timed_out`.
   */
  timed_out: boolean | null;
  /**
   * Column `_http_response.error_msg`.
   */
  error_msg: string | null;
  /**
   * Column `_http_response.created`.
   */
  created?: string;
}
type _http_responseParentsInputs<TPath extends string[]> = {

};
type _http_responseChildrenInputs<TPath extends string[]> = {

};
type _http_responseInputs<TPath extends string[]> = Inputs<
  _http_responseScalars,
  _http_responseParentsInputs<TPath>,
  _http_responseChildrenInputs<TPath>
>;
type _http_responseChildInputs<TPath extends string[]> = ChildInputs<_http_responseInputs<TPath>>;
type _http_responseParentInputs<TPath extends string[]> = ParentInputs<
_http_responseInputs<TPath>,
  TPath
>;
type answersScalars = {
  /**
   * Column `answers.id`.
   */
  id: number;
  /**
   * Column `answers.content`.
   */
  content: string | null;
  /**
   * Column `answers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `answers.updated_at`.
   */
  updated_at?: string;
  /**
   * Column `answers.user_id`.
   */
  user_id: string | null;
  /**
   * Column `answers.question_id`.
   */
  question_id: number | null;
}
type answersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `answers` to table `questions` through the column `answers.question_id`.
   */
  questions: OmitParentInputs<questionsParentInputs<[...TPath, "questions"]>, "answers", [...TPath, "questions"]>;
  /**
   * Relationship from table `answers` to table `users` through the column `answers.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "answers", [...TPath, "public_users"]>;
};
type answersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `answers` to table `user_answers` through the column `user_answers.answer_id`.
  */
  user_answers: OmitChildInputs<user_answersChildInputs<[...TPath, "user_answers"]>, "answers" | "answer_id">;
};
type answersInputs<TPath extends string[]> = Inputs<
  answersScalars,
  answersParentsInputs<TPath>,
  answersChildrenInputs<TPath>
>;
type answersChildInputs<TPath extends string[]> = ChildInputs<answersInputs<TPath>>;
type answersParentInputs<TPath extends string[]> = ParentInputs<
answersInputs<TPath>,
  TPath
>;
type audit_log_entriesScalars = {
  /**
   * Column `audit_log_entries.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `audit_log_entries.id`.
   */
  id: string;
  /**
   * Column `audit_log_entries.payload`.
   */
  payload: Json | null;
  /**
   * Column `audit_log_entries.created_at`.
   */
  created_at: string | null;
  /**
   * Column `audit_log_entries.ip_address`.
   */
  ip_address?: string;
}
type audit_log_entriesParentsInputs<TPath extends string[]> = {

};
type audit_log_entriesChildrenInputs<TPath extends string[]> = {

};
type audit_log_entriesInputs<TPath extends string[]> = Inputs<
  audit_log_entriesScalars,
  audit_log_entriesParentsInputs<TPath>,
  audit_log_entriesChildrenInputs<TPath>
>;
type audit_log_entriesChildInputs<TPath extends string[]> = ChildInputs<audit_log_entriesInputs<TPath>>;
type audit_log_entriesParentInputs<TPath extends string[]> = ParentInputs<
audit_log_entriesInputs<TPath>,
  TPath
>;
type bucketsScalars = {
  /**
   * Column `buckets.id`.
   */
  id: string;
  /**
   * Column `buckets.name`.
   */
  name: string;
  /**
   * Column `buckets.owner`.
   */
  owner: string | null;
  /**
   * Column `buckets.created_at`.
   */
  created_at: string | null;
  /**
   * Column `buckets.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `buckets.public`.
   */
  public: boolean | null;
  /**
   * Column `buckets.avif_autodetection`.
   */
  avif_autodetection: boolean | null;
  /**
   * Column `buckets.file_size_limit`.
   */
  file_size_limit: number | null;
  /**
   * Column `buckets.allowed_mime_types`.
   */
  allowed_mime_types: string[] | null;
  /**
   * Column `buckets.owner_id`.
   */
  owner_id: string | null;
}
type bucketsParentsInputs<TPath extends string[]> = {

};
type bucketsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `buckets` to table `objects` through the column `objects.bucket_id`.
  */
  objects: OmitChildInputs<objectsChildInputs<[...TPath, "objects"]>, "buckets" | "bucket_id">;
};
type bucketsInputs<TPath extends string[]> = Inputs<
  bucketsScalars,
  bucketsParentsInputs<TPath>,
  bucketsChildrenInputs<TPath>
>;
type bucketsChildInputs<TPath extends string[]> = ChildInputs<bucketsInputs<TPath>>;
type bucketsParentInputs<TPath extends string[]> = ParentInputs<
bucketsInputs<TPath>,
  TPath
>;
type categoriesScalars = {
  /**
   * Column `categories.id`.
   */
  id: number;
  /**
   * Column `categories.created_at`.
   */
  created_at?: string;
  /**
   * Column `categories.name`.
   */
  name: string | null;
  /**
   * Column `categories.unit`.
   */
  unit: string | null;
  /**
   * Column `categories.slug`.
   */
  slug: string;
  /**
   * Column `categories.pack_id`.
   */
  pack_id: number | null;
  /**
   * Column `categories.updated_at`.
   */
  updated_at?: string;
}
type categoriesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `categories` to table `packs` through the column `categories.pack_id`.
   */
  packs: OmitParentInputs<packsParentInputs<[...TPath, "packs"]>, "categories", [...TPath, "packs"]>;
};
type categoriesChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `categories` to table `category_items` through the column `category_items.category_id`.
  */
  category_items: OmitChildInputs<category_itemsChildInputs<[...TPath, "category_items"]>, "categories" | "category_id">;
};
type categoriesInputs<TPath extends string[]> = Inputs<
  categoriesScalars,
  categoriesParentsInputs<TPath>,
  categoriesChildrenInputs<TPath>
>;
type categoriesChildInputs<TPath extends string[]> = ChildInputs<categoriesInputs<TPath>>;
type categoriesParentInputs<TPath extends string[]> = ParentInputs<
categoriesInputs<TPath>,
  TPath
>;
type category_itemsScalars = {
  /**
   * Column `category_items.id`.
   */
  id: number;
  /**
   * Column `category_items.category_id`.
   */
  category_id: number | null;
  /**
   * Column `category_items.item_id`.
   */
  item_id: number | null;
  /**
   * Column `category_items.position`.
   */
  position: number | null;
  /**
   * Column `category_items.created_at`.
   */
  created_at: string | null;
  /**
   * Column `category_items.updated_at`.
   */
  updated_at: string | null;
}
type category_itemsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `category_items` to table `categories` through the column `category_items.category_id`.
   */
  categories: OmitParentInputs<categoriesParentInputs<[...TPath, "categories"]>, "category_items", [...TPath, "categories"]>;
  /**
   * Relationship from table `category_items` to table `items` through the column `category_items.item_id`.
   */
  items: OmitParentInputs<itemsParentInputs<[...TPath, "items"]>, "category_items", [...TPath, "items"]>;
};
type category_itemsChildrenInputs<TPath extends string[]> = {

};
type category_itemsInputs<TPath extends string[]> = Inputs<
  category_itemsScalars,
  category_itemsParentsInputs<TPath>,
  category_itemsChildrenInputs<TPath>
>;
type category_itemsChildInputs<TPath extends string[]> = ChildInputs<category_itemsInputs<TPath>>;
type category_itemsParentInputs<TPath extends string[]> = ParentInputs<
category_itemsInputs<TPath>,
  TPath
>;
type commentsScalars = {
  /**
   * Column `comments.id`.
   */
  id: number;
  /**
   * Column `comments.text`.
   */
  text: string | null;
  /**
   * Column `comments.created_at`.
   */
  created_at: string | null;
  /**
   * Column `comments.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `comments.user_id`.
   */
  user_id: string;
  /**
   * Column `comments.pack_id`.
   */
  pack_id: number;
}
type commentsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `comments` to table `packs` through the column `comments.pack_id`.
   */
  packs: OmitParentInputs<packsParentInputs<[...TPath, "packs"]>, "comments", [...TPath, "packs"]>;
  /**
   * Relationship from table `comments` to table `users` through the column `comments.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "comments", [...TPath, "public_users"]>;
};
type commentsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `comments` to table `replies` through the column `replies.comment_id`.
  */
  replies: OmitChildInputs<repliesChildInputs<[...TPath, "replies"]>, "comments" | "comment_id">;
};
type commentsInputs<TPath extends string[]> = Inputs<
  commentsScalars,
  commentsParentsInputs<TPath>,
  commentsChildrenInputs<TPath>
>;
type commentsChildInputs<TPath extends string[]> = ChildInputs<commentsInputs<TPath>>;
type commentsParentInputs<TPath extends string[]> = ParentInputs<
commentsInputs<TPath>,
  TPath
>;
type customersScalars = {
  /**
   * Column `customers.id`.
   */
  id?: string;
  /**
   * Column `customers.stripe_customer_id`.
   */
  stripe_customer_id: string | null;
  /**
   * Column `customers.user_id`.
   */
  user_id: string;
}
type customersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `customers` to table `users` through the column `customers.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "customers", [...TPath, "public_users"]>;
};
type customersChildrenInputs<TPath extends string[]> = {

};
type customersInputs<TPath extends string[]> = Inputs<
  customersScalars,
  customersParentsInputs<TPath>,
  customersChildrenInputs<TPath>
>;
type customersChildInputs<TPath extends string[]> = ChildInputs<customersInputs<TPath>>;
type customersParentInputs<TPath extends string[]> = ParentInputs<
customersInputs<TPath>,
  TPath
>;
type flow_stateScalars = {
  /**
   * Column `flow_state.id`.
   */
  id: string;
  /**
   * Column `flow_state.user_id`.
   */
  user_id: string | null;
  /**
   * Column `flow_state.auth_code`.
   */
  auth_code: string;
  /**
   * Column `flow_state.code_challenge_method`.
   */
  code_challenge_method: code_challenge_methodEnum;
  /**
   * Column `flow_state.code_challenge`.
   */
  code_challenge: string;
  /**
   * Column `flow_state.provider_type`.
   */
  provider_type: string;
  /**
   * Column `flow_state.provider_access_token`.
   */
  provider_access_token: string | null;
  /**
   * Column `flow_state.provider_refresh_token`.
   */
  provider_refresh_token: string | null;
  /**
   * Column `flow_state.created_at`.
   */
  created_at: string | null;
  /**
   * Column `flow_state.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `flow_state.authentication_method`.
   */
  authentication_method: string;
}
type flow_stateParentsInputs<TPath extends string[]> = {

};
type flow_stateChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `flow_state` to table `saml_relay_states` through the column `saml_relay_states.flow_state_id`.
  */
  saml_relay_states: OmitChildInputs<saml_relay_statesChildInputs<[...TPath, "saml_relay_states"]>, "flow_state" | "flow_state_id">;
};
type flow_stateInputs<TPath extends string[]> = Inputs<
  flow_stateScalars,
  flow_stateParentsInputs<TPath>,
  flow_stateChildrenInputs<TPath>
>;
type flow_stateChildInputs<TPath extends string[]> = ChildInputs<flow_stateInputs<TPath>>;
type flow_stateParentInputs<TPath extends string[]> = ParentInputs<
flow_stateInputs<TPath>,
  TPath
>;
type friendsScalars = {
  /**
   * Column `friends.id`.
   */
  id: number;
  /**
   * Column `friends.invite_sent_on`.
   */
  invite_sent_on: string | null;
  /**
   * Column `friends.invite_accepted_on`.
   */
  invite_accepted_on: string | null;
  /**
   * Column `friends.created_at`.
   */
  created_at: string | null;
  /**
   * Column `friends.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `friends.user_id`.
   */
  user_id: string | null;
  /**
   * Column `friends.friend_id`.
   */
  friend_id: string | null;
}
type friendsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `friends` to table `users` through the column `friends.friend_id`.
   */
  public_users_friends_friend_idTopublic_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users_friends_friend_idTopublic_users"]>, "friends_friends_friend_idTopublic_users", [...TPath, "public_users_friends_friend_idTopublic_users"]>;
  /**
   * Relationship from table `friends` to table `users` through the column `friends.user_id`.
   */
  public_users_friends_user_idTopublic_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users_friends_user_idTopublic_users"]>, "friends_friends_user_idTopublic_users", [...TPath, "public_users_friends_user_idTopublic_users"]>;
};
type friendsChildrenInputs<TPath extends string[]> = {

};
type friendsInputs<TPath extends string[]> = Inputs<
  friendsScalars,
  friendsParentsInputs<TPath>,
  friendsChildrenInputs<TPath>
>;
type friendsChildInputs<TPath extends string[]> = ChildInputs<friendsInputs<TPath>>;
type friendsParentInputs<TPath extends string[]> = ParentInputs<
friendsInputs<TPath>,
  TPath
>;
type hooksScalars = {
  /**
   * Column `hooks.id`.
   */
  id?: number;
  /**
   * Column `hooks.hook_table_id`.
   */
  hook_table_id: number;
  /**
   * Column `hooks.hook_name`.
   */
  hook_name: string;
  /**
   * Column `hooks.created_at`.
   */
  created_at?: string;
  /**
   * Column `hooks.request_id`.
   */
  request_id: number | null;
}
type hooksParentsInputs<TPath extends string[]> = {

};
type hooksChildrenInputs<TPath extends string[]> = {

};
type hooksInputs<TPath extends string[]> = Inputs<
  hooksScalars,
  hooksParentsInputs<TPath>,
  hooksChildrenInputs<TPath>
>;
type hooksChildInputs<TPath extends string[]> = ChildInputs<hooksInputs<TPath>>;
type hooksParentInputs<TPath extends string[]> = ParentInputs<
hooksInputs<TPath>,
  TPath
>;
type http_request_queueScalars = {
  /**
   * Column `http_request_queue.id`.
   */
  id?: number;
  /**
   * Column `http_request_queue.method`.
   */
  method: string;
  /**
   * Column `http_request_queue.url`.
   */
  url: string;
  /**
   * Column `http_request_queue.headers`.
   */
  headers: Json;
  /**
   * Column `http_request_queue.body`.
   */
  body: string | null;
  /**
   * Column `http_request_queue.timeout_milliseconds`.
   */
  timeout_milliseconds: number;
}
type http_request_queueParentsInputs<TPath extends string[]> = {

};
type http_request_queueChildrenInputs<TPath extends string[]> = {

};
type http_request_queueInputs<TPath extends string[]> = Inputs<
  http_request_queueScalars,
  http_request_queueParentsInputs<TPath>,
  http_request_queueChildrenInputs<TPath>
>;
type http_request_queueChildInputs<TPath extends string[]> = ChildInputs<http_request_queueInputs<TPath>>;
type http_request_queueParentInputs<TPath extends string[]> = ParentInputs<
http_request_queueInputs<TPath>,
  TPath
>;
type identitiesScalars = {
  /**
   * Column `identities.id`.
   */
  id: string;
  /**
   * Column `identities.user_id`.
   */
  user_id: string;
  /**
   * Column `identities.identity_data`.
   */
  identity_data: Json;
  /**
   * Column `identities.provider`.
   */
  provider: string;
  /**
   * Column `identities.last_sign_in_at`.
   */
  last_sign_in_at: string | null;
  /**
   * Column `identities.created_at`.
   */
  created_at: string | null;
  /**
   * Column `identities.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `identities.email`.
   */
  email?: string | null;
}
type identitiesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `identities` to table `users` through the column `identities.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "identities", [...TPath, "auth_users"]>;
};
type identitiesChildrenInputs<TPath extends string[]> = {

};
type identitiesInputs<TPath extends string[]> = Inputs<
  Omit<identitiesScalars, "email">,
  identitiesParentsInputs<TPath>,
  identitiesChildrenInputs<TPath>
>;
type identitiesChildInputs<TPath extends string[]> = ChildInputs<identitiesInputs<TPath>>;
type identitiesParentInputs<TPath extends string[]> = ParentInputs<
identitiesInputs<TPath>,
  TPath
>;
type instancesScalars = {
  /**
   * Column `instances.id`.
   */
  id: string;
  /**
   * Column `instances.uuid`.
   */
  uuid: string | null;
  /**
   * Column `instances.raw_base_config`.
   */
  raw_base_config: string | null;
  /**
   * Column `instances.created_at`.
   */
  created_at: string | null;
  /**
   * Column `instances.updated_at`.
   */
  updated_at: string | null;
}
type instancesParentsInputs<TPath extends string[]> = {

};
type instancesChildrenInputs<TPath extends string[]> = {

};
type instancesInputs<TPath extends string[]> = Inputs<
  instancesScalars,
  instancesParentsInputs<TPath>,
  instancesChildrenInputs<TPath>
>;
type instancesChildInputs<TPath extends string[]> = ChildInputs<instancesInputs<TPath>>;
type instancesParentInputs<TPath extends string[]> = ParentInputs<
instancesInputs<TPath>,
  TPath
>;
type itemsScalars = {
  /**
   * Column `items.id`.
   */
  id: number;
  /**
   * Column `items.name`.
   */
  name: string | null;
  /**
   * Column `items.generic_type`.
   */
  generic_type: string | null;
  /**
   * Column `items.price`.
   */
  price: number | null;
  /**
   * Column `items.consumable`.
   */
  consumable: boolean | null;
  /**
   * Column `items.worn`.
   */
  worn: boolean | null;
  /**
   * Column `items.quantity`.
   */
  quantity: number | null;
  /**
   * Column `items.unit`.
   */
  unit: string | null;
  /**
   * Column `items.weight`.
   */
  weight: string | null;
  /**
   * Column `items.url`.
   */
  url: string | null;
  /**
   * Column `items.slug`.
   */
  slug: string;
  /**
   * Column `items.created_at`.
   */
  created_at: string | null;
  /**
   * Column `items.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `items.user_id`.
   */
  user_id: string | null;
}
type itemsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `items` to table `users` through the column `items.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "items", [...TPath, "public_users"]>;
};
type itemsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `items` to table `category_items` through the column `category_items.item_id`.
  */
  category_items: OmitChildInputs<category_itemsChildInputs<[...TPath, "category_items"]>, "items" | "item_id">;
};
type itemsInputs<TPath extends string[]> = Inputs<
  itemsScalars,
  itemsParentsInputs<TPath>,
  itemsChildrenInputs<TPath>
>;
type itemsChildInputs<TPath extends string[]> = ChildInputs<itemsInputs<TPath>>;
type itemsParentInputs<TPath extends string[]> = ParentInputs<
itemsInputs<TPath>,
  TPath
>;
type keyScalars = {
  /**
   * Column `key.id`.
   */
  id?: string;
  /**
   * Column `key.status`.
   */
  status: key_statusEnum | null;
  /**
   * Column `key.created`.
   */
  created?: string;
  /**
   * Column `key.expires`.
   */
  expires: string | null;
  /**
   * Column `key.key_type`.
   */
  key_type: key_typeEnum | null;
  /**
   * Column `key.key_id`.
   */
  key_id: number | null;
  /**
   * Column `key.key_context`.
   */
  key_context: string | null;
  /**
   * Column `key.name`.
   */
  name: string | null;
  /**
   * Column `key.associated_data`.
   */
  associated_data: string | null;
  /**
   * Column `key.raw_key`.
   */
  raw_key: string | null;
  /**
   * Column `key.raw_key_nonce`.
   */
  raw_key_nonce: string | null;
  /**
   * Column `key.parent_key`.
   */
  parent_key: string | null;
  /**
   * Column `key.comment`.
   */
  comment: string | null;
  /**
   * Column `key.user_data`.
   */
  user_data: string | null;
}
type keyParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `key` to table `key` through the column `key.parent_key`.
   */
  key: OmitParentInputs<keyParentInputs<[...TPath, "key"]>, "key", [...TPath, "key"]>;
};
type keyChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `key` to table `secrets` through the column `secrets.key_id`.
  */
  secrets: OmitChildInputs<secretsChildInputs<[...TPath, "secrets"]>, "key" | "key_id">;
};
type keyInputs<TPath extends string[]> = Inputs<
  keyScalars,
  keyParentsInputs<TPath>,
  keyChildrenInputs<TPath>
>;
type keyChildInputs<TPath extends string[]> = ChildInputs<keyInputs<TPath>>;
type keyParentInputs<TPath extends string[]> = ParentInputs<
keyInputs<TPath>,
  TPath
>;
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars = {
  /**
   * Column `log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91.id`.
   */
  id: string;
  /**
   * Column `log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91.timestamp`.
   */
  timestamp: string | null;
}
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsInputs<TPath extends string[]> = {

};
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenInputs<TPath extends string[]> = {

};
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Inputs<TPath extends string[]> = Inputs<
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars,
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsInputs<TPath>,
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenInputs<TPath>
>;
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildInputs<TPath extends string[]> = ChildInputs<log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Inputs<TPath>>;
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentInputs<TPath extends string[]> = ParentInputs<
log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Inputs<TPath>,
  TPath
>;
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eScalars = {
  /**
   * Column `log_events_6942dc85_c452_4072_99e1_813ff24aa81e.id`.
   */
  id: string;
  /**
   * Column `log_events_6942dc85_c452_4072_99e1_813ff24aa81e.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_6942dc85_c452_4072_99e1_813ff24aa81e.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_6942dc85_c452_4072_99e1_813ff24aa81e.timestamp`.
   */
  timestamp: string | null;
}
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eParentsInputs<TPath extends string[]> = {

};
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eChildrenInputs<TPath extends string[]> = {

};
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eInputs<TPath extends string[]> = Inputs<
  log_events_6942dc85_c452_4072_99e1_813ff24aa81eScalars,
  log_events_6942dc85_c452_4072_99e1_813ff24aa81eParentsInputs<TPath>,
  log_events_6942dc85_c452_4072_99e1_813ff24aa81eChildrenInputs<TPath>
>;
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eChildInputs<TPath extends string[]> = ChildInputs<log_events_6942dc85_c452_4072_99e1_813ff24aa81eInputs<TPath>>;
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eParentInputs<TPath extends string[]> = ParentInputs<
log_events_6942dc85_c452_4072_99e1_813ff24aa81eInputs<TPath>,
  TPath
>;
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars = {
  /**
   * Column `log_events_73a4c865_0ffb_4641_b8d9_c923382bb700.id`.
   */
  id: string;
  /**
   * Column `log_events_73a4c865_0ffb_4641_b8d9_c923382bb700.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_73a4c865_0ffb_4641_b8d9_c923382bb700.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_73a4c865_0ffb_4641_b8d9_c923382bb700.timestamp`.
   */
  timestamp: string | null;
}
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsInputs<TPath extends string[]> = {

};
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenInputs<TPath extends string[]> = {

};
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Inputs<TPath extends string[]> = Inputs<
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars,
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsInputs<TPath>,
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenInputs<TPath>
>;
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ChildInputs<TPath extends string[]> = ChildInputs<log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Inputs<TPath>>;
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ParentInputs<TPath extends string[]> = ParentInputs<
log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Inputs<TPath>,
  TPath
>;
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars = {
  /**
   * Column `log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec.id`.
   */
  id: string;
  /**
   * Column `log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec.timestamp`.
   */
  timestamp: string | null;
}
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsInputs<TPath extends string[]> = {

};
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenInputs<TPath extends string[]> = {

};
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecInputs<TPath extends string[]> = Inputs<
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars,
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsInputs<TPath>,
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenInputs<TPath>
>;
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildInputs<TPath extends string[]> = ChildInputs<log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecInputs<TPath>>;
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentInputs<TPath extends string[]> = ParentInputs<
log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecInputs<TPath>,
  TPath
>;
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars = {
  /**
   * Column `log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55.id`.
   */
  id: string;
  /**
   * Column `log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55.timestamp`.
   */
  timestamp: string | null;
}
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsInputs<TPath extends string[]> = {

};
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenInputs<TPath extends string[]> = {

};
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Inputs<TPath extends string[]> = Inputs<
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars,
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsInputs<TPath>,
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenInputs<TPath>
>;
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildInputs<TPath extends string[]> = ChildInputs<log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Inputs<TPath>>;
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentInputs<TPath extends string[]> = ParentInputs<
log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Inputs<TPath>,
  TPath
>;
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars = {
  /**
   * Column `log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7.id`.
   */
  id: string;
  /**
   * Column `log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7.timestamp`.
   */
  timestamp: string | null;
}
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsInputs<TPath extends string[]> = {

};
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenInputs<TPath extends string[]> = {

};
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Inputs<TPath extends string[]> = Inputs<
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars,
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsInputs<TPath>,
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenInputs<TPath>
>;
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildInputs<TPath extends string[]> = ChildInputs<log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Inputs<TPath>>;
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentInputs<TPath extends string[]> = ParentInputs<
log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Inputs<TPath>,
  TPath
>;
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars = {
  /**
   * Column `log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de.id`.
   */
  id: string;
  /**
   * Column `log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de.timestamp`.
   */
  timestamp: string | null;
}
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsInputs<TPath extends string[]> = {

};
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenInputs<TPath extends string[]> = {

};
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deInputs<TPath extends string[]> = Inputs<
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars,
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsInputs<TPath>,
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenInputs<TPath>
>;
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deChildInputs<TPath extends string[]> = ChildInputs<log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deInputs<TPath>>;
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deParentInputs<TPath extends string[]> = ParentInputs<
log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deInputs<TPath>,
  TPath
>;
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars = {
  /**
   * Column `log_events_dd523764_6f36_4f31_8a44_8baaa86e3805.id`.
   */
  id: string;
  /**
   * Column `log_events_dd523764_6f36_4f31_8a44_8baaa86e3805.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_dd523764_6f36_4f31_8a44_8baaa86e3805.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_dd523764_6f36_4f31_8a44_8baaa86e3805.timestamp`.
   */
  timestamp: string | null;
}
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsInputs<TPath extends string[]> = {

};
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenInputs<TPath extends string[]> = {

};
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Inputs<TPath extends string[]> = Inputs<
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars,
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsInputs<TPath>,
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenInputs<TPath>
>;
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ChildInputs<TPath extends string[]> = ChildInputs<log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Inputs<TPath>>;
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ParentInputs<TPath extends string[]> = ParentInputs<
log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Inputs<TPath>,
  TPath
>;
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars = {
  /**
   * Column `log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9.id`.
   */
  id: string;
  /**
   * Column `log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9.body`.
   */
  body: Json | null;
  /**
   * Column `log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9.event_message`.
   */
  event_message: string | null;
  /**
   * Column `log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9.timestamp`.
   */
  timestamp: string | null;
}
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsInputs<TPath extends string[]> = {

};
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenInputs<TPath extends string[]> = {

};
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Inputs<TPath extends string[]> = Inputs<
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars,
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsInputs<TPath>,
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenInputs<TPath>
>;
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildInputs<TPath extends string[]> = ChildInputs<log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Inputs<TPath>>;
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentInputs<TPath extends string[]> = ParentInputs<
log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Inputs<TPath>,
  TPath
>;
type mfa_amr_claimsScalars = {
  /**
   * Column `mfa_amr_claims.session_id`.
   */
  session_id: string;
  /**
   * Column `mfa_amr_claims.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_amr_claims.updated_at`.
   */
  updated_at: string;
  /**
   * Column `mfa_amr_claims.authentication_method`.
   */
  authentication_method: string;
  /**
   * Column `mfa_amr_claims.id`.
   */
  id: string;
}
type mfa_amr_claimsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_amr_claims` to table `sessions` through the column `mfa_amr_claims.session_id`.
   */
  sessions: OmitParentInputs<sessionsParentInputs<[...TPath, "sessions"]>, "mfa_amr_claims", [...TPath, "sessions"]>;
};
type mfa_amr_claimsChildrenInputs<TPath extends string[]> = {

};
type mfa_amr_claimsInputs<TPath extends string[]> = Inputs<
  mfa_amr_claimsScalars,
  mfa_amr_claimsParentsInputs<TPath>,
  mfa_amr_claimsChildrenInputs<TPath>
>;
type mfa_amr_claimsChildInputs<TPath extends string[]> = ChildInputs<mfa_amr_claimsInputs<TPath>>;
type mfa_amr_claimsParentInputs<TPath extends string[]> = ParentInputs<
mfa_amr_claimsInputs<TPath>,
  TPath
>;
type mfa_challengesScalars = {
  /**
   * Column `mfa_challenges.id`.
   */
  id: string;
  /**
   * Column `mfa_challenges.factor_id`.
   */
  factor_id: string;
  /**
   * Column `mfa_challenges.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_challenges.verified_at`.
   */
  verified_at: string | null;
  /**
   * Column `mfa_challenges.ip_address`.
   */
  ip_address: string;
}
type mfa_challengesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_challenges` to table `mfa_factors` through the column `mfa_challenges.factor_id`.
   */
  mfa_factors: OmitParentInputs<mfa_factorsParentInputs<[...TPath, "mfa_factors"]>, "mfa_challenges", [...TPath, "mfa_factors"]>;
};
type mfa_challengesChildrenInputs<TPath extends string[]> = {

};
type mfa_challengesInputs<TPath extends string[]> = Inputs<
  mfa_challengesScalars,
  mfa_challengesParentsInputs<TPath>,
  mfa_challengesChildrenInputs<TPath>
>;
type mfa_challengesChildInputs<TPath extends string[]> = ChildInputs<mfa_challengesInputs<TPath>>;
type mfa_challengesParentInputs<TPath extends string[]> = ParentInputs<
mfa_challengesInputs<TPath>,
  TPath
>;
type mfa_factorsScalars = {
  /**
   * Column `mfa_factors.id`.
   */
  id: string;
  /**
   * Column `mfa_factors.user_id`.
   */
  user_id: string;
  /**
   * Column `mfa_factors.friendly_name`.
   */
  friendly_name: string | null;
  /**
   * Column `mfa_factors.factor_type`.
   */
  factor_type: factor_typeEnum;
  /**
   * Column `mfa_factors.status`.
   */
  status: factor_statusEnum;
  /**
   * Column `mfa_factors.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_factors.updated_at`.
   */
  updated_at: string;
  /**
   * Column `mfa_factors.secret`.
   */
  secret: string | null;
}
type mfa_factorsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_factors` to table `users` through the column `mfa_factors.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "mfa_factors", [...TPath, "auth_users"]>;
};
type mfa_factorsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `mfa_factors` to table `mfa_challenges` through the column `mfa_challenges.factor_id`.
  */
  mfa_challenges: OmitChildInputs<mfa_challengesChildInputs<[...TPath, "mfa_challenges"]>, "mfa_factors" | "factor_id">;
};
type mfa_factorsInputs<TPath extends string[]> = Inputs<
  mfa_factorsScalars,
  mfa_factorsParentsInputs<TPath>,
  mfa_factorsChildrenInputs<TPath>
>;
type mfa_factorsChildInputs<TPath extends string[]> = ChildInputs<mfa_factorsInputs<TPath>>;
type mfa_factorsParentInputs<TPath extends string[]> = ParentInputs<
mfa_factorsInputs<TPath>,
  TPath
>;
type storage_migrationsScalars = {
  /**
   * Column `migrations.id`.
   */
  id: number;
  /**
   * Column `migrations.name`.
   */
  name: string;
  /**
   * Column `migrations.hash`.
   */
  hash: string;
  /**
   * Column `migrations.executed_at`.
   */
  executed_at: string | null;
}
type storage_migrationsParentsInputs<TPath extends string[]> = {

};
type storage_migrationsChildrenInputs<TPath extends string[]> = {

};
type storage_migrationsInputs<TPath extends string[]> = Inputs<
  storage_migrationsScalars,
  storage_migrationsParentsInputs<TPath>,
  storage_migrationsChildrenInputs<TPath>
>;
type storage_migrationsChildInputs<TPath extends string[]> = ChildInputs<storage_migrationsInputs<TPath>>;
type storage_migrationsParentInputs<TPath extends string[]> = ParentInputs<
storage_migrationsInputs<TPath>,
  TPath
>;
type supabase_functions_migrationsScalars = {
  /**
   * Column `migrations.version`.
   */
  version: string;
  /**
   * Column `migrations.inserted_at`.
   */
  inserted_at?: string;
}
type supabase_functions_migrationsParentsInputs<TPath extends string[]> = {

};
type supabase_functions_migrationsChildrenInputs<TPath extends string[]> = {

};
type supabase_functions_migrationsInputs<TPath extends string[]> = Inputs<
  supabase_functions_migrationsScalars,
  supabase_functions_migrationsParentsInputs<TPath>,
  supabase_functions_migrationsChildrenInputs<TPath>
>;
type supabase_functions_migrationsChildInputs<TPath extends string[]> = ChildInputs<supabase_functions_migrationsInputs<TPath>>;
type supabase_functions_migrationsParentInputs<TPath extends string[]> = ParentInputs<
supabase_functions_migrationsInputs<TPath>,
  TPath
>;
type notificationsScalars = {
  /**
   * Column `notifications.id`.
   */
  id: number;
  /**
   * Column `notifications.title`.
   */
  title: string | null;
  /**
   * Column `notifications.content`.
   */
  content: string | null;
  /**
   * Column `notifications.read_on_date`.
   */
  read_on_date: string | null;
  /**
   * Column `notifications.created_at`.
   */
  created_at: string | null;
  /**
   * Column `notifications.updated_at`.
   */
  updated_at?: string;
  /**
   * Column `notifications.user_id`.
   */
  user_id: string | null;
}
type notificationsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `notifications` to table `users` through the column `notifications.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "notifications", [...TPath, "public_users"]>;
};
type notificationsChildrenInputs<TPath extends string[]> = {

};
type notificationsInputs<TPath extends string[]> = Inputs<
  notificationsScalars,
  notificationsParentsInputs<TPath>,
  notificationsChildrenInputs<TPath>
>;
type notificationsChildInputs<TPath extends string[]> = ChildInputs<notificationsInputs<TPath>>;
type notificationsParentInputs<TPath extends string[]> = ParentInputs<
notificationsInputs<TPath>,
  TPath
>;
type objectsScalars = {
  /**
   * Column `objects.id`.
   */
  id?: string;
  /**
   * Column `objects.bucket_id`.
   */
  bucket_id: string | null;
  /**
   * Column `objects.name`.
   */
  name: string | null;
  /**
   * Column `objects.owner`.
   */
  owner: string | null;
  /**
   * Column `objects.created_at`.
   */
  created_at: string | null;
  /**
   * Column `objects.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `objects.last_accessed_at`.
   */
  last_accessed_at: string | null;
  /**
   * Column `objects.metadata`.
   */
  metadata: Json | null;
  /**
   * Column `objects.path_tokens`.
   */
  path_tokens?: string[] | null;
  /**
   * Column `objects.version`.
   */
  version: string | null;
  /**
   * Column `objects.owner_id`.
   */
  owner_id: string | null;
}
type objectsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `objects` to table `buckets` through the column `objects.bucket_id`.
   */
  buckets: OmitParentInputs<bucketsParentInputs<[...TPath, "buckets"]>, "objects", [...TPath, "buckets"]>;
};
type objectsChildrenInputs<TPath extends string[]> = {

};
type objectsInputs<TPath extends string[]> = Inputs<
  Omit<objectsScalars, "path_tokens">,
  objectsParentsInputs<TPath>,
  objectsChildrenInputs<TPath>
>;
type objectsChildInputs<TPath extends string[]> = ChildInputs<objectsInputs<TPath>>;
type objectsParentInputs<TPath extends string[]> = ParentInputs<
objectsInputs<TPath>,
  TPath
>;
type onboarding_stepsScalars = {
  /**
   * Column `onboarding_steps.user_id`.
   */
  user_id: string;
  /**
   * Column `onboarding_steps.page`.
   */
  page: string;
  /**
   * Column `onboarding_steps.completion_date`.
   */
  completion_date: string | null;
  /**
   * Column `onboarding_steps.created_at`.
   */
  created_at?: string;
  /**
   * Column `onboarding_steps.updated_at`.
   */
  updated_at?: string;
}
type onboarding_stepsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `onboarding_steps` to table `users` through the column `onboarding_steps.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "onboarding_steps", [...TPath, "public_users"]>;
};
type onboarding_stepsChildrenInputs<TPath extends string[]> = {

};
type onboarding_stepsInputs<TPath extends string[]> = Inputs<
  onboarding_stepsScalars,
  onboarding_stepsParentsInputs<TPath>,
  onboarding_stepsChildrenInputs<TPath>
>;
type onboarding_stepsChildInputs<TPath extends string[]> = ChildInputs<onboarding_stepsInputs<TPath>>;
type onboarding_stepsParentInputs<TPath extends string[]> = ParentInputs<
onboarding_stepsInputs<TPath>,
  TPath
>;
type packsScalars = {
  /**
   * Column `packs.id`.
   */
  id: number;
  /**
   * Column `packs.name`.
   */
  name: string | null;
  /**
   * Column `packs.slug`.
   */
  slug: string;
  /**
   * Column `packs.created_at`.
   */
  created_at: string | null;
  /**
   * Column `packs.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `packs.user_id`.
   */
  user_id: string;
  /**
   * Column `packs.theme`.
   */
  theme: themeEnum | null;
  /**
   * Column `packs.private`.
   */
  private?: boolean;
  /**
   * Column `packs.allow_comments`.
   */
  allow_comments?: boolean;
}
type packsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `packs` to table `users` through the column `packs.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "packs", [...TPath, "public_users"]>;
};
type packsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `packs` to table `categories` through the column `categories.pack_id`.
  */
  categories: OmitChildInputs<categoriesChildInputs<[...TPath, "categories"]>, "packs" | "pack_id">;
  /**
  * Relationship from table `packs` to table `comments` through the column `comments.pack_id`.
  */
  comments: OmitChildInputs<commentsChildInputs<[...TPath, "comments"]>, "packs" | "pack_id">;
  /**
  * Relationship from table `packs` to table `trip_packs` through the column `trip_packs.pack_id`.
  */
  trip_packs: OmitChildInputs<trip_packsChildInputs<[...TPath, "trip_packs"]>, "packs" | "pack_id">;
};
type packsInputs<TPath extends string[]> = Inputs<
  packsScalars,
  packsParentsInputs<TPath>,
  packsChildrenInputs<TPath>
>;
type packsChildInputs<TPath extends string[]> = ChildInputs<packsInputs<TPath>>;
type packsParentInputs<TPath extends string[]> = ParentInputs<
packsInputs<TPath>,
  TPath
>;
type pollsScalars = {
  /**
   * Column `polls.id`.
   */
  id: number;
  /**
   * Column `polls.created_at`.
   */
  created_at: string | null;
  /**
   * Column `polls.updated_at`.
   */
  updated_at?: string;
  /**
   * Column `polls.user_id`.
   */
  user_id: string | null;
  /**
   * Column `polls.trip_id`.
   */
  trip_id: number | null;
}
type pollsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `polls` to table `trips` through the column `polls.trip_id`.
   */
  trips: OmitParentInputs<tripsParentInputs<[...TPath, "trips"]>, "polls", [...TPath, "trips"]>;
  /**
   * Relationship from table `polls` to table `users` through the column `polls.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "polls", [...TPath, "public_users"]>;
};
type pollsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `polls` to table `questions` through the column `questions.poll_id`.
  */
  questions: OmitChildInputs<questionsChildInputs<[...TPath, "questions"]>, "polls" | "poll_id">;
  /**
  * Relationship from table `polls` to table `user_answers` through the column `user_answers.poll_id`.
  */
  user_answers: OmitChildInputs<user_answersChildInputs<[...TPath, "user_answers"]>, "polls" | "poll_id">;
};
type pollsInputs<TPath extends string[]> = Inputs<
  pollsScalars,
  pollsParentsInputs<TPath>,
  pollsChildrenInputs<TPath>
>;
type pollsChildInputs<TPath extends string[]> = ChildInputs<pollsInputs<TPath>>;
type pollsParentInputs<TPath extends string[]> = ParentInputs<
pollsInputs<TPath>,
  TPath
>;
type pricesScalars = {
  /**
   * Column `prices.id`.
   */
  id: string;
  /**
   * Column `prices.product_id`.
   */
  product_id: string | null;
  /**
   * Column `prices.active`.
   */
  active: boolean | null;
  /**
   * Column `prices.description`.
   */
  description: string | null;
  /**
   * Column `prices.unit_amount`.
   */
  unit_amount: number | null;
  /**
   * Column `prices.currency`.
   */
  currency: string | null;
  /**
   * Column `prices.type`.
   */
  type: pricing_typeEnum | null;
  /**
   * Column `prices.interval`.
   */
  interval: pricing_plan_intervalEnum | null;
  /**
   * Column `prices.interval_count`.
   */
  interval_count: number | null;
  /**
   * Column `prices.trial_period_days`.
   */
  trial_period_days: number | null;
  /**
   * Column `prices.metadata`.
   */
  metadata: Json | null;
  /**
   * Column `prices.identifier`.
   */
  identifier: subscription_levelEnum | null;
  /**
   * Column `prices.environment`.
   */
  environment: string | null;
}
type pricesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `prices` to table `products` through the column `prices.product_id`.
   */
  products: OmitParentInputs<productsParentInputs<[...TPath, "products"]>, "prices", [...TPath, "products"]>;
};
type pricesChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `prices` to table `subscriptions` through the column `subscriptions.price_id`.
  */
  subscriptions: OmitChildInputs<subscriptionsChildInputs<[...TPath, "subscriptions"]>, "prices" | "price_id">;
};
type pricesInputs<TPath extends string[]> = Inputs<
  pricesScalars,
  pricesParentsInputs<TPath>,
  pricesChildrenInputs<TPath>
>;
type pricesChildInputs<TPath extends string[]> = ChildInputs<pricesInputs<TPath>>;
type pricesParentInputs<TPath extends string[]> = ParentInputs<
pricesInputs<TPath>,
  TPath
>;
type productsScalars = {
  /**
   * Column `products.id`.
   */
  id: string;
  /**
   * Column `products.active`.
   */
  active?: boolean;
  /**
   * Column `products.name`.
   */
  name: subscription_levelEnum | null;
  /**
   * Column `products.description`.
   */
  description: string | null;
  /**
   * Column `products.image`.
   */
  image: string | null;
  /**
   * Column `products.metadata`.
   */
  metadata: Json | null;
  /**
   * Column `products.environment`.
   */
  environment: string | null;
}
type productsParentsInputs<TPath extends string[]> = {

};
type productsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `products` to table `prices` through the column `prices.product_id`.
  */
  prices: OmitChildInputs<pricesChildInputs<[...TPath, "prices"]>, "products" | "product_id">;
};
type productsInputs<TPath extends string[]> = Inputs<
  productsScalars,
  productsParentsInputs<TPath>,
  productsChildrenInputs<TPath>
>;
type productsChildInputs<TPath extends string[]> = ChildInputs<productsInputs<TPath>>;
type productsParentInputs<TPath extends string[]> = ParentInputs<
productsInputs<TPath>,
  TPath
>;
type questionsScalars = {
  /**
   * Column `questions.id`.
   */
  id: number;
  /**
   * Column `questions.title`.
   */
  title: string | null;
  /**
   * Column `questions.poll_id`.
   */
  poll_id: number | null;
  /**
   * Column `questions.created_at`.
   */
  created_at: string | null;
  /**
   * Column `questions.updated_at`.
   */
  updated_at?: string;
  /**
   * Column `questions.user_id`.
   */
  user_id: string | null;
}
type questionsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `questions` to table `polls` through the column `questions.poll_id`.
   */
  polls: OmitParentInputs<pollsParentInputs<[...TPath, "polls"]>, "questions", [...TPath, "polls"]>;
  /**
   * Relationship from table `questions` to table `users` through the column `questions.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "questions", [...TPath, "public_users"]>;
};
type questionsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `questions` to table `answers` through the column `answers.question_id`.
  */
  answers: OmitChildInputs<answersChildInputs<[...TPath, "answers"]>, "questions" | "question_id">;
};
type questionsInputs<TPath extends string[]> = Inputs<
  questionsScalars,
  questionsParentsInputs<TPath>,
  questionsChildrenInputs<TPath>
>;
type questionsChildInputs<TPath extends string[]> = ChildInputs<questionsInputs<TPath>>;
type questionsParentInputs<TPath extends string[]> = ParentInputs<
questionsInputs<TPath>,
  TPath
>;
type refresh_tokensScalars = {
  /**
   * Column `refresh_tokens.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `refresh_tokens.id`.
   */
  id?: number;
  /**
   * Column `refresh_tokens.token`.
   */
  token: string | null;
  /**
   * Column `refresh_tokens.user_id`.
   */
  user_id: string | null;
  /**
   * Column `refresh_tokens.revoked`.
   */
  revoked: boolean | null;
  /**
   * Column `refresh_tokens.created_at`.
   */
  created_at: string | null;
  /**
   * Column `refresh_tokens.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `refresh_tokens.parent`.
   */
  parent: string | null;
  /**
   * Column `refresh_tokens.session_id`.
   */
  session_id: string | null;
}
type refresh_tokensParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `refresh_tokens` to table `sessions` through the column `refresh_tokens.session_id`.
   */
  sessions: OmitParentInputs<sessionsParentInputs<[...TPath, "sessions"]>, "refresh_tokens", [...TPath, "sessions"]>;
};
type refresh_tokensChildrenInputs<TPath extends string[]> = {

};
type refresh_tokensInputs<TPath extends string[]> = Inputs<
  refresh_tokensScalars,
  refresh_tokensParentsInputs<TPath>,
  refresh_tokensChildrenInputs<TPath>
>;
type refresh_tokensChildInputs<TPath extends string[]> = ChildInputs<refresh_tokensInputs<TPath>>;
type refresh_tokensParentInputs<TPath extends string[]> = ParentInputs<
refresh_tokensInputs<TPath>,
  TPath
>;
type repliesScalars = {
  /**
   * Column `replies.id`.
   */
  id: number;
  /**
   * Column `replies.comment_id`.
   */
  comment_id: number;
  /**
   * Column `replies.user_id`.
   */
  user_id: string;
  /**
   * Column `replies.created_at`.
   */
  created_at: string | null;
  /**
   * Column `replies.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `replies.text`.
   */
  text: string | null;
}
type repliesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `replies` to table `comments` through the column `replies.comment_id`.
   */
  comments: OmitParentInputs<commentsParentInputs<[...TPath, "comments"]>, "replies", [...TPath, "comments"]>;
  /**
   * Relationship from table `replies` to table `users` through the column `replies.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "replies", [...TPath, "public_users"]>;
};
type repliesChildrenInputs<TPath extends string[]> = {

};
type repliesInputs<TPath extends string[]> = Inputs<
  repliesScalars,
  repliesParentsInputs<TPath>,
  repliesChildrenInputs<TPath>
>;
type repliesChildInputs<TPath extends string[]> = ChildInputs<repliesInputs<TPath>>;
type repliesParentInputs<TPath extends string[]> = ParentInputs<
repliesInputs<TPath>,
  TPath
>;
type saml_providersScalars = {
  /**
   * Column `saml_providers.id`.
   */
  id: string;
  /**
   * Column `saml_providers.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `saml_providers.entity_id`.
   */
  entity_id: string;
  /**
   * Column `saml_providers.metadata_xml`.
   */
  metadata_xml: string;
  /**
   * Column `saml_providers.metadata_url`.
   */
  metadata_url: string | null;
  /**
   * Column `saml_providers.attribute_mapping`.
   */
  attribute_mapping: Json | null;
  /**
   * Column `saml_providers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `saml_providers.updated_at`.
   */
  updated_at: string | null;
}
type saml_providersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `saml_providers` to table `sso_providers` through the column `saml_providers.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "saml_providers", [...TPath, "sso_providers"]>;
};
type saml_providersChildrenInputs<TPath extends string[]> = {

};
type saml_providersInputs<TPath extends string[]> = Inputs<
  saml_providersScalars,
  saml_providersParentsInputs<TPath>,
  saml_providersChildrenInputs<TPath>
>;
type saml_providersChildInputs<TPath extends string[]> = ChildInputs<saml_providersInputs<TPath>>;
type saml_providersParentInputs<TPath extends string[]> = ParentInputs<
saml_providersInputs<TPath>,
  TPath
>;
type saml_relay_statesScalars = {
  /**
   * Column `saml_relay_states.id`.
   */
  id: string;
  /**
   * Column `saml_relay_states.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `saml_relay_states.request_id`.
   */
  request_id: string;
  /**
   * Column `saml_relay_states.for_email`.
   */
  for_email: string | null;
  /**
   * Column `saml_relay_states.redirect_to`.
   */
  redirect_to: string | null;
  /**
   * Column `saml_relay_states.from_ip_address`.
   */
  from_ip_address: string | null;
  /**
   * Column `saml_relay_states.created_at`.
   */
  created_at: string | null;
  /**
   * Column `saml_relay_states.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `saml_relay_states.flow_state_id`.
   */
  flow_state_id: string | null;
}
type saml_relay_statesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `saml_relay_states` to table `flow_state` through the column `saml_relay_states.flow_state_id`.
   */
  flow_state: OmitParentInputs<flow_stateParentInputs<[...TPath, "flow_state"]>, "saml_relay_states", [...TPath, "flow_state"]>;
  /**
   * Relationship from table `saml_relay_states` to table `sso_providers` through the column `saml_relay_states.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "saml_relay_states", [...TPath, "sso_providers"]>;
};
type saml_relay_statesChildrenInputs<TPath extends string[]> = {

};
type saml_relay_statesInputs<TPath extends string[]> = Inputs<
  saml_relay_statesScalars,
  saml_relay_statesParentsInputs<TPath>,
  saml_relay_statesChildrenInputs<TPath>
>;
type saml_relay_statesChildInputs<TPath extends string[]> = ChildInputs<saml_relay_statesInputs<TPath>>;
type saml_relay_statesParentInputs<TPath extends string[]> = ParentInputs<
saml_relay_statesInputs<TPath>,
  TPath
>;
type auth_schema_migrationsScalars = {
  /**
   * Column `schema_migrations.version`.
   */
  version: string;
}
type auth_schema_migrationsParentsInputs<TPath extends string[]> = {

};
type auth_schema_migrationsChildrenInputs<TPath extends string[]> = {

};
type auth_schema_migrationsInputs<TPath extends string[]> = Inputs<
  auth_schema_migrationsScalars,
  auth_schema_migrationsParentsInputs<TPath>,
  auth_schema_migrationsChildrenInputs<TPath>
>;
type auth_schema_migrationsChildInputs<TPath extends string[]> = ChildInputs<auth_schema_migrationsInputs<TPath>>;
type auth_schema_migrationsParentInputs<TPath extends string[]> = ParentInputs<
auth_schema_migrationsInputs<TPath>,
  TPath
>;
type supabase_migrations_schema_migrationsScalars = {
  /**
   * Column `schema_migrations.version`.
   */
  version: string;
  /**
   * Column `schema_migrations.statements`.
   */
  statements: string[] | null;
  /**
   * Column `schema_migrations.name`.
   */
  name: string | null;
}
type supabase_migrations_schema_migrationsParentsInputs<TPath extends string[]> = {

};
type supabase_migrations_schema_migrationsChildrenInputs<TPath extends string[]> = {

};
type supabase_migrations_schema_migrationsInputs<TPath extends string[]> = Inputs<
  supabase_migrations_schema_migrationsScalars,
  supabase_migrations_schema_migrationsParentsInputs<TPath>,
  supabase_migrations_schema_migrationsChildrenInputs<TPath>
>;
type supabase_migrations_schema_migrationsChildInputs<TPath extends string[]> = ChildInputs<supabase_migrations_schema_migrationsInputs<TPath>>;
type supabase_migrations_schema_migrationsParentInputs<TPath extends string[]> = ParentInputs<
supabase_migrations_schema_migrationsInputs<TPath>,
  TPath
>;
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars = {
  /**
   * Column `schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsInputs<TPath extends string[]> = {

};
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Inputs<TPath extends string[]> = Inputs<
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars,
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsInputs<TPath>,
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenInputs<TPath>
>;
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Inputs<TPath>>;
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Inputs<TPath>,
  TPath
>;
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eScalars = {
  /**
   * Column `schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eParentsInputs<TPath extends string[]> = {

};
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eInputs<TPath extends string[]> = Inputs<
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eScalars,
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eParentsInputs<TPath>,
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eChildrenInputs<TPath>
>;
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eInputs<TPath>>;
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eInputs<TPath>,
  TPath
>;
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars = {
  /**
   * Column `schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsInputs<TPath extends string[]> = {

};
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Inputs<TPath extends string[]> = Inputs<
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars,
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsInputs<TPath>,
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenInputs<TPath>
>;
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Inputs<TPath>>;
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Inputs<TPath>,
  TPath
>;
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars = {
  /**
   * Column `schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsInputs<TPath extends string[]> = {

};
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecInputs<TPath extends string[]> = Inputs<
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars,
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsInputs<TPath>,
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenInputs<TPath>
>;
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecInputs<TPath>>;
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecInputs<TPath>,
  TPath
>;
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars = {
  /**
   * Column `schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsInputs<TPath extends string[]> = {

};
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Inputs<TPath extends string[]> = Inputs<
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars,
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsInputs<TPath>,
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenInputs<TPath>
>;
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Inputs<TPath>>;
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Inputs<TPath>,
  TPath
>;
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars = {
  /**
   * Column `schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsInputs<TPath extends string[]> = {

};
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Inputs<TPath extends string[]> = Inputs<
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars,
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsInputs<TPath>,
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenInputs<TPath>
>;
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Inputs<TPath>>;
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Inputs<TPath>,
  TPath
>;
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars = {
  /**
   * Column `schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsInputs<TPath extends string[]> = {

};
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deInputs<TPath extends string[]> = Inputs<
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars,
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsInputs<TPath>,
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenInputs<TPath>
>;
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deInputs<TPath>>;
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deInputs<TPath>,
  TPath
>;
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars = {
  /**
   * Column `schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsInputs<TPath extends string[]> = {

};
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Inputs<TPath extends string[]> = Inputs<
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars,
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsInputs<TPath>,
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenInputs<TPath>
>;
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Inputs<TPath>>;
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Inputs<TPath>,
  TPath
>;
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars = {
  /**
   * Column `schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9.version`.
   */
  version: number;
  /**
   * Column `schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9.inserted_at`.
   */
  inserted_at: string | null;
}
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsInputs<TPath extends string[]> = {

};
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenInputs<TPath extends string[]> = {

};
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Inputs<TPath extends string[]> = Inputs<
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars,
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsInputs<TPath>,
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenInputs<TPath>
>;
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildInputs<TPath extends string[]> = ChildInputs<schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Inputs<TPath>>;
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentInputs<TPath extends string[]> = ParentInputs<
schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Inputs<TPath>,
  TPath
>;
type secretsScalars = {
  /**
   * Column `secrets.id`.
   */
  id?: string;
  /**
   * Column `secrets.name`.
   */
  name: string | null;
  /**
   * Column `secrets.description`.
   */
  description?: string;
  /**
   * Column `secrets.secret`.
   */
  secret: string;
  /**
   * Column `secrets.key_id`.
   */
  key_id: string | null;
  /**
   * Column `secrets.nonce`.
   */
  nonce: string | null;
  /**
   * Column `secrets.created_at`.
   */
  created_at?: string;
  /**
   * Column `secrets.updated_at`.
   */
  updated_at?: string;
}
type secretsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `secrets` to table `key` through the column `secrets.key_id`.
   */
  key: OmitParentInputs<keyParentInputs<[...TPath, "key"]>, "secrets", [...TPath, "key"]>;
};
type secretsChildrenInputs<TPath extends string[]> = {

};
type secretsInputs<TPath extends string[]> = Inputs<
  secretsScalars,
  secretsParentsInputs<TPath>,
  secretsChildrenInputs<TPath>
>;
type secretsChildInputs<TPath extends string[]> = ChildInputs<secretsInputs<TPath>>;
type secretsParentInputs<TPath extends string[]> = ParentInputs<
secretsInputs<TPath>,
  TPath
>;
type sessionsScalars = {
  /**
   * Column `sessions.id`.
   */
  id: string;
  /**
   * Column `sessions.user_id`.
   */
  user_id: string;
  /**
   * Column `sessions.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sessions.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `sessions.factor_id`.
   */
  factor_id: string | null;
  /**
   * Column `sessions.aal`.
   */
  aal: aal_levelEnum | null;
  /**
   * Column `sessions.not_after`.
   */
  not_after: string | null;
  /**
   * Column `sessions.refreshed_at`.
   */
  refreshed_at: string | null;
  /**
   * Column `sessions.user_agent`.
   */
  user_agent: string | null;
  /**
   * Column `sessions.ip`.
   */
  ip: string | null;
}
type sessionsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `sessions` to table `users` through the column `sessions.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "sessions", [...TPath, "auth_users"]>;
};
type sessionsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `sessions` to table `mfa_amr_claims` through the column `mfa_amr_claims.session_id`.
  */
  mfa_amr_claims: OmitChildInputs<mfa_amr_claimsChildInputs<[...TPath, "mfa_amr_claims"]>, "sessions" | "session_id">;
  /**
  * Relationship from table `sessions` to table `refresh_tokens` through the column `refresh_tokens.session_id`.
  */
  refresh_tokens: OmitChildInputs<refresh_tokensChildInputs<[...TPath, "refresh_tokens"]>, "sessions" | "session_id">;
};
type sessionsInputs<TPath extends string[]> = Inputs<
  sessionsScalars,
  sessionsParentsInputs<TPath>,
  sessionsChildrenInputs<TPath>
>;
type sessionsChildInputs<TPath extends string[]> = ChildInputs<sessionsInputs<TPath>>;
type sessionsParentInputs<TPath extends string[]> = ParentInputs<
sessionsInputs<TPath>,
  TPath
>;
type shopping_list_itemsScalars = {
  /**
   * Column `shopping_list_items.id`.
   */
  id: number;
  /**
   * Column `shopping_list_items.title`.
   */
  title: string | null;
  /**
   * Column `shopping_list_items.completed`.
   */
  completed?: boolean;
  /**
   * Column `shopping_list_items.quantity`.
   */
  quantity: number | null;
  /**
   * Column `shopping_list_items.trip_id`.
   */
  trip_id: number | null;
  /**
   * Column `shopping_list_items.created_at`.
   */
  created_at: string | null;
  /**
   * Column `shopping_list_items.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `shopping_list_items.resource_type`.
   */
  resource_type?: resource_typeEnum;
  /**
   * Column `shopping_list_items.user_id`.
   */
  user_id: string | null;
}
type shopping_list_itemsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `shopping_list_items` to table `trips` through the column `shopping_list_items.trip_id`.
   */
  trips: OmitParentInputs<tripsParentInputs<[...TPath, "trips"]>, "shopping_list_items", [...TPath, "trips"]>;
  /**
   * Relationship from table `shopping_list_items` to table `users` through the column `shopping_list_items.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "shopping_list_items", [...TPath, "public_users"]>;
};
type shopping_list_itemsChildrenInputs<TPath extends string[]> = {

};
type shopping_list_itemsInputs<TPath extends string[]> = Inputs<
  shopping_list_itemsScalars,
  shopping_list_itemsParentsInputs<TPath>,
  shopping_list_itemsChildrenInputs<TPath>
>;
type shopping_list_itemsChildInputs<TPath extends string[]> = ChildInputs<shopping_list_itemsInputs<TPath>>;
type shopping_list_itemsParentInputs<TPath extends string[]> = ParentInputs<
shopping_list_itemsInputs<TPath>,
  TPath
>;
type sso_domainsScalars = {
  /**
   * Column `sso_domains.id`.
   */
  id: string;
  /**
   * Column `sso_domains.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `sso_domains.domain`.
   */
  domain: string;
  /**
   * Column `sso_domains.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sso_domains.updated_at`.
   */
  updated_at: string | null;
}
type sso_domainsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `sso_domains` to table `sso_providers` through the column `sso_domains.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "sso_domains", [...TPath, "sso_providers"]>;
};
type sso_domainsChildrenInputs<TPath extends string[]> = {

};
type sso_domainsInputs<TPath extends string[]> = Inputs<
  sso_domainsScalars,
  sso_domainsParentsInputs<TPath>,
  sso_domainsChildrenInputs<TPath>
>;
type sso_domainsChildInputs<TPath extends string[]> = ChildInputs<sso_domainsInputs<TPath>>;
type sso_domainsParentInputs<TPath extends string[]> = ParentInputs<
sso_domainsInputs<TPath>,
  TPath
>;
type sso_providersScalars = {
  /**
   * Column `sso_providers.id`.
   */
  id: string;
  /**
   * Column `sso_providers.resource_id`.
   */
  resource_id: string | null;
  /**
   * Column `sso_providers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sso_providers.updated_at`.
   */
  updated_at: string | null;
}
type sso_providersParentsInputs<TPath extends string[]> = {

};
type sso_providersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `sso_providers` to table `saml_providers` through the column `saml_providers.sso_provider_id`.
  */
  saml_providers: OmitChildInputs<saml_providersChildInputs<[...TPath, "saml_providers"]>, "sso_providers" | "sso_provider_id">;
  /**
  * Relationship from table `sso_providers` to table `saml_relay_states` through the column `saml_relay_states.sso_provider_id`.
  */
  saml_relay_states: OmitChildInputs<saml_relay_statesChildInputs<[...TPath, "saml_relay_states"]>, "sso_providers" | "sso_provider_id">;
  /**
  * Relationship from table `sso_providers` to table `sso_domains` through the column `sso_domains.sso_provider_id`.
  */
  sso_domains: OmitChildInputs<sso_domainsChildInputs<[...TPath, "sso_domains"]>, "sso_providers" | "sso_provider_id">;
};
type sso_providersInputs<TPath extends string[]> = Inputs<
  sso_providersScalars,
  sso_providersParentsInputs<TPath>,
  sso_providersChildrenInputs<TPath>
>;
type sso_providersChildInputs<TPath extends string[]> = ChildInputs<sso_providersInputs<TPath>>;
type sso_providersParentInputs<TPath extends string[]> = ParentInputs<
sso_providersInputs<TPath>,
  TPath
>;
type subscriptionsScalars = {
  /**
   * Column `subscriptions.id`.
   */
  id?: string;
  /**
   * Column `subscriptions.user_id`.
   */
  user_id: string;
  /**
   * Column `subscriptions.status`.
   */
  status: subscription_statusEnum | null;
  /**
   * Column `subscriptions.metadata`.
   */
  metadata: Json | null;
  /**
   * Column `subscriptions.price_id`.
   */
  price_id: string | null;
  /**
   * Column `subscriptions.quantity`.
   */
  quantity: number | null;
  /**
   * Column `subscriptions.cancel_at_period_end`.
   */
  cancel_at_period_end: boolean | null;
  /**
   * Column `subscriptions.created_at`.
   */
  created_at?: string;
  /**
   * Column `subscriptions.current_period_start`.
   */
  current_period_start?: string;
  /**
   * Column `subscriptions.current_period_end`.
   */
  current_period_end?: string;
  /**
   * Column `subscriptions.ended_at`.
   */
  ended_at: string | null;
  /**
   * Column `subscriptions.cancel_at`.
   */
  cancel_at: string | null;
  /**
   * Column `subscriptions.canceled_at`.
   */
  canceled_at: string | null;
  /**
   * Column `subscriptions.trial_start`.
   */
  trial_start: string | null;
  /**
   * Column `subscriptions.trial_end`.
   */
  trial_end: string | null;
  /**
   * Column `subscriptions.stripe_subscription_id`.
   */
  stripe_subscription_id: string | null;
}
type subscriptionsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `subscriptions` to table `prices` through the column `subscriptions.price_id`.
   */
  prices: OmitParentInputs<pricesParentInputs<[...TPath, "prices"]>, "subscriptions", [...TPath, "prices"]>;
  /**
   * Relationship from table `subscriptions` to table `users` through the column `subscriptions.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "subscriptions", [...TPath, "public_users"]>;
};
type subscriptionsChildrenInputs<TPath extends string[]> = {

};
type subscriptionsInputs<TPath extends string[]> = Inputs<
  subscriptionsScalars,
  subscriptionsParentsInputs<TPath>,
  subscriptionsChildrenInputs<TPath>
>;
type subscriptionsChildInputs<TPath extends string[]> = ChildInputs<subscriptionsInputs<TPath>>;
type subscriptionsParentInputs<TPath extends string[]> = ParentInputs<
subscriptionsInputs<TPath>,
  TPath
>;
type todosScalars = {
  /**
   * Column `todos.id`.
   */
  id: number;
  /**
   * Column `todos.title`.
   */
  title: string | null;
  /**
   * Column `todos.completed`.
   */
  completed?: boolean;
  /**
   * Column `todos.trip_id`.
   */
  trip_id: number | null;
  /**
   * Column `todos.created_at`.
   */
  created_at: string | null;
  /**
   * Column `todos.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `todos.resource_type`.
   */
  resource_type?: resource_typeEnum;
  /**
   * Column `todos.user_id`.
   */
  user_id: string | null;
}
type todosParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `todos` to table `trips` through the column `todos.trip_id`.
   */
  trips: OmitParentInputs<tripsParentInputs<[...TPath, "trips"]>, "todos", [...TPath, "trips"]>;
  /**
   * Relationship from table `todos` to table `users` through the column `todos.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "todos", [...TPath, "public_users"]>;
};
type todosChildrenInputs<TPath extends string[]> = {

};
type todosInputs<TPath extends string[]> = Inputs<
  todosScalars,
  todosParentsInputs<TPath>,
  todosChildrenInputs<TPath>
>;
type todosChildInputs<TPath extends string[]> = ChildInputs<todosInputs<TPath>>;
type todosParentInputs<TPath extends string[]> = ParentInputs<
todosInputs<TPath>,
  TPath
>;
type trip_detailsScalars = {
  /**
   * Column `trip_details.id`.
   */
  id: number;
  /**
   * Column `trip_details.title`.
   */
  title: string | null;
  /**
   * Column `trip_details.url`.
   */
  url: string | null;
  /**
   * Column `trip_details.value`.
   */
  value: string | null;
  /**
   * Column `trip_details.type`.
   */
  type: string | null;
  /**
   * Column `trip_details.trip_id`.
   */
  trip_id: number | null;
  /**
   * Column `trip_details.created_at`.
   */
  created_at: string | null;
  /**
   * Column `trip_details.updated_at`.
   */
  updated_at?: string;
}
type trip_detailsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `trip_details` to table `trips` through the column `trip_details.trip_id`.
   */
  trips: OmitParentInputs<tripsParentInputs<[...TPath, "trips"]>, "trip_details", [...TPath, "trips"]>;
};
type trip_detailsChildrenInputs<TPath extends string[]> = {

};
type trip_detailsInputs<TPath extends string[]> = Inputs<
  trip_detailsScalars,
  trip_detailsParentsInputs<TPath>,
  trip_detailsChildrenInputs<TPath>
>;
type trip_detailsChildInputs<TPath extends string[]> = ChildInputs<trip_detailsInputs<TPath>>;
type trip_detailsParentInputs<TPath extends string[]> = ParentInputs<
trip_detailsInputs<TPath>,
  TPath
>;
type trip_friendsScalars = {
  /**
   * Column `trip_friends.id`.
   */
  id: number;
  /**
   * Column `trip_friends.trip_id`.
   */
  trip_id: number | null;
  /**
   * Column `trip_friends.accepted_invite_on`.
   */
  accepted_invite_on: string | null;
  /**
   * Column `trip_friends.created_at`.
   */
  created_at: string | null;
  /**
   * Column `trip_friends.status`.
   */
  status?: trip_friend_statusEnum;
  /**
   * Column `trip_friends.user_id`.
   */
  user_id: string | null;
  /**
   * Column `trip_friends.updated_at`.
   */
  updated_at?: string;
}
type trip_friendsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `trip_friends` to table `trips` through the column `trip_friends.trip_id`.
   */
  trips: OmitParentInputs<tripsParentInputs<[...TPath, "trips"]>, "trip_friends", [...TPath, "trips"]>;
  /**
   * Relationship from table `trip_friends` to table `users` through the column `trip_friends.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "trip_friends", [...TPath, "public_users"]>;
};
type trip_friendsChildrenInputs<TPath extends string[]> = {

};
type trip_friendsInputs<TPath extends string[]> = Inputs<
  trip_friendsScalars,
  trip_friendsParentsInputs<TPath>,
  trip_friendsChildrenInputs<TPath>
>;
type trip_friendsChildInputs<TPath extends string[]> = ChildInputs<trip_friendsInputs<TPath>>;
type trip_friendsParentInputs<TPath extends string[]> = ParentInputs<
trip_friendsInputs<TPath>,
  TPath
>;
type trip_packsScalars = {
  /**
   * Column `trip_packs.id`.
   */
  id: number;
  /**
   * Column `trip_packs.trip_id`.
   */
  trip_id: number | null;
  /**
   * Column `trip_packs.pack_id`.
   */
  pack_id: number | null;
  /**
   * Column `trip_packs.created_at`.
   */
  created_at: string | null;
  /**
   * Column `trip_packs.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `trip_packs.user_id`.
   */
  user_id: string | null;
}
type trip_packsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `trip_packs` to table `packs` through the column `trip_packs.pack_id`.
   */
  packs: OmitParentInputs<packsParentInputs<[...TPath, "packs"]>, "trip_packs", [...TPath, "packs"]>;
  /**
   * Relationship from table `trip_packs` to table `trips` through the column `trip_packs.trip_id`.
   */
  trips: OmitParentInputs<tripsParentInputs<[...TPath, "trips"]>, "trip_packs", [...TPath, "trips"]>;
  /**
   * Relationship from table `trip_packs` to table `users` through the column `trip_packs.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "trip_packs", [...TPath, "public_users"]>;
};
type trip_packsChildrenInputs<TPath extends string[]> = {

};
type trip_packsInputs<TPath extends string[]> = Inputs<
  trip_packsScalars,
  trip_packsParentsInputs<TPath>,
  trip_packsChildrenInputs<TPath>
>;
type trip_packsChildInputs<TPath extends string[]> = ChildInputs<trip_packsInputs<TPath>>;
type trip_packsParentInputs<TPath extends string[]> = ParentInputs<
trip_packsInputs<TPath>,
  TPath
>;
type tripsScalars = {
  /**
   * Column `trips.id`.
   */
  id: number;
  /**
   * Column `trips.created_at`.
   */
  created_at: string | null;
  /**
   * Column `trips.name`.
   */
  name: string | null;
  /**
   * Column `trips.description`.
   */
  description: string | null;
  /**
   * Column `trips.starting_point`.
   */
  starting_point: string | null;
  /**
   * Column `trips.ending_point`.
   */
  ending_point: string | null;
  /**
   * Column `trips.starting_date`.
   */
  starting_date: string | null;
  /**
   * Column `trips.ending_date`.
   */
  ending_date: string | null;
  /**
   * Column `trips.coordinates`.
   */
  coordinates: Json | null;
  /**
   * Column `trips.slug`.
   */
  slug: string;
  /**
   * Column `trips.updated_at`.
   */
  updated_at?: string;
  /**
   * Column `trips.user_id`.
   */
  user_id: string;
}
type tripsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `trips` to table `users` through the column `trips.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "trips", [...TPath, "public_users"]>;
};
type tripsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `trips` to table `polls` through the column `polls.trip_id`.
  */
  polls: OmitChildInputs<pollsChildInputs<[...TPath, "polls"]>, "trips" | "trip_id">;
  /**
  * Relationship from table `trips` to table `shopping_list_items` through the column `shopping_list_items.trip_id`.
  */
  shopping_list_items: OmitChildInputs<shopping_list_itemsChildInputs<[...TPath, "shopping_list_items"]>, "trips" | "trip_id">;
  /**
  * Relationship from table `trips` to table `todos` through the column `todos.trip_id`.
  */
  todos: OmitChildInputs<todosChildInputs<[...TPath, "todos"]>, "trips" | "trip_id">;
  /**
  * Relationship from table `trips` to table `trip_details` through the column `trip_details.trip_id`.
  */
  trip_details: OmitChildInputs<trip_detailsChildInputs<[...TPath, "trip_details"]>, "trips" | "trip_id">;
  /**
  * Relationship from table `trips` to table `trip_friends` through the column `trip_friends.trip_id`.
  */
  trip_friends: OmitChildInputs<trip_friendsChildInputs<[...TPath, "trip_friends"]>, "trips" | "trip_id">;
  /**
  * Relationship from table `trips` to table `trip_packs` through the column `trip_packs.trip_id`.
  */
  trip_packs: OmitChildInputs<trip_packsChildInputs<[...TPath, "trip_packs"]>, "trips" | "trip_id">;
};
type tripsInputs<TPath extends string[]> = Inputs<
  tripsScalars,
  tripsParentsInputs<TPath>,
  tripsChildrenInputs<TPath>
>;
type tripsChildInputs<TPath extends string[]> = ChildInputs<tripsInputs<TPath>>;
type tripsParentInputs<TPath extends string[]> = ParentInputs<
tripsInputs<TPath>,
  TPath
>;
type user_answersScalars = {
  /**
   * Column `user_answers.id`.
   */
  id: number;
  /**
   * Column `user_answers.answer_id`.
   */
  answer_id: number | null;
  /**
   * Column `user_answers.user_id`.
   */
  user_id: string | null;
  /**
   * Column `user_answers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `user_answers.updated_at`.
   */
  updated_at?: string;
  /**
   * Column `user_answers.poll_id`.
   */
  poll_id: number | null;
}
type user_answersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `user_answers` to table `answers` through the column `user_answers.answer_id`.
   */
  answers: OmitParentInputs<answersParentInputs<[...TPath, "answers"]>, "user_answers", [...TPath, "answers"]>;
  /**
   * Relationship from table `user_answers` to table `polls` through the column `user_answers.poll_id`.
   */
  polls: OmitParentInputs<pollsParentInputs<[...TPath, "polls"]>, "user_answers", [...TPath, "polls"]>;
  /**
   * Relationship from table `user_answers` to table `users` through the column `user_answers.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "user_answers", [...TPath, "public_users"]>;
};
type user_answersChildrenInputs<TPath extends string[]> = {

};
type user_answersInputs<TPath extends string[]> = Inputs<
  user_answersScalars,
  user_answersParentsInputs<TPath>,
  user_answersChildrenInputs<TPath>
>;
type user_answersChildInputs<TPath extends string[]> = ChildInputs<user_answersInputs<TPath>>;
type user_answersParentInputs<TPath extends string[]> = ParentInputs<
user_answersInputs<TPath>,
  TPath
>;
type auth_usersScalars = {
  /**
   * Column `users.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `users.id`.
   */
  id: string;
  /**
   * Column `users.aud`.
   */
  aud: string | null;
  /**
   * Column `users.role`.
   */
  role: string | null;
  /**
   * Column `users.email`.
   */
  email: string | null;
  /**
   * Column `users.encrypted_password`.
   */
  encrypted_password: string | null;
  /**
   * Column `users.email_confirmed_at`.
   */
  email_confirmed_at: string | null;
  /**
   * Column `users.invited_at`.
   */
  invited_at: string | null;
  /**
   * Column `users.confirmation_token`.
   */
  confirmation_token: string | null;
  /**
   * Column `users.confirmation_sent_at`.
   */
  confirmation_sent_at: string | null;
  /**
   * Column `users.recovery_token`.
   */
  recovery_token: string | null;
  /**
   * Column `users.recovery_sent_at`.
   */
  recovery_sent_at: string | null;
  /**
   * Column `users.email_change_token_new`.
   */
  email_change_token_new: string | null;
  /**
   * Column `users.email_change`.
   */
  email_change: string | null;
  /**
   * Column `users.email_change_sent_at`.
   */
  email_change_sent_at: string | null;
  /**
   * Column `users.last_sign_in_at`.
   */
  last_sign_in_at: string | null;
  /**
   * Column `users.raw_app_meta_data`.
   */
  raw_app_meta_data: Json | null;
  /**
   * Column `users.raw_user_meta_data`.
   */
  raw_user_meta_data: Json | null;
  /**
   * Column `users.is_super_admin`.
   */
  is_super_admin: boolean | null;
  /**
   * Column `users.created_at`.
   */
  created_at: string | null;
  /**
   * Column `users.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `users.phone`.
   */
  phone: string | null;
  /**
   * Column `users.phone_confirmed_at`.
   */
  phone_confirmed_at: string | null;
  /**
   * Column `users.phone_change`.
   */
  phone_change: string | null;
  /**
   * Column `users.phone_change_token`.
   */
  phone_change_token: string | null;
  /**
   * Column `users.phone_change_sent_at`.
   */
  phone_change_sent_at: string | null;
  /**
   * Column `users.confirmed_at`.
   */
  confirmed_at?: string | null;
  /**
   * Column `users.email_change_token_current`.
   */
  email_change_token_current: string | null;
  /**
   * Column `users.email_change_confirm_status`.
   */
  email_change_confirm_status: number | null;
  /**
   * Column `users.banned_until`.
   */
  banned_until: string | null;
  /**
   * Column `users.reauthentication_token`.
   */
  reauthentication_token: string | null;
  /**
   * Column `users.reauthentication_sent_at`.
   */
  reauthentication_sent_at: string | null;
  /**
   * Column `users.is_sso_user`.
   */
  is_sso_user?: boolean;
  /**
   * Column `users.deleted_at`.
   */
  deleted_at: string | null;
}
type auth_usersParentsInputs<TPath extends string[]> = {

};
type auth_usersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `users` to table `identities` through the column `identities.user_id`.
  */
  identities: OmitChildInputs<identitiesChildInputs<[...TPath, "identities"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `mfa_factors` through the column `mfa_factors.user_id`.
  */
  mfa_factors: OmitChildInputs<mfa_factorsChildInputs<[...TPath, "mfa_factors"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `sessions` through the column `sessions.user_id`.
  */
  sessions: OmitChildInputs<sessionsChildInputs<[...TPath, "sessions"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `users` through the column `users.id`.
  */
  public_users: OmitChildInputs<public_usersChildInputs<[...TPath, "public_users"]>, "auth_users" | "id">;
};
type auth_usersInputs<TPath extends string[]> = Inputs<
  Omit<auth_usersScalars, "confirmed_at">,
  auth_usersParentsInputs<TPath>,
  auth_usersChildrenInputs<TPath>
>;
type auth_usersChildInputs<TPath extends string[]> = ChildInputs<auth_usersInputs<TPath>>;
type auth_usersParentInputs<TPath extends string[]> = ParentInputs<
auth_usersInputs<TPath>,
  TPath
>;
type public_usersScalars = {
  /**
   * Column `users.id`.
   */
  id: string;
  /**
   * Column `users.email`.
   */
  email: string;
  /**
   * Column `users.first_name`.
   */
  first_name: string | null;
  /**
   * Column `users.last_name`.
   */
  last_name: string | null;
  /**
   * Column `users.trail_name`.
   */
  trail_name: string | null;
  /**
   * Column `users.image`.
   */
  image: string | null;
  /**
   * Column `users.role`.
   */
  role: user_roleEnum | null;
  /**
   * Column `users.subscription_level`.
   */
  subscription_level: subscription_levelEnum | null;
  /**
   * Column `users.measuring_system`.
   */
  measuring_system: measuring_systemEnum | null;
  /**
   * Column `users.onboard_date`.
   */
  onboard_date: string | null;
  /**
   * Column `users.address_1`.
   */
  address_1: string | null;
  /**
   * Column `users.address_2`.
   */
  address_2: string | null;
  /**
   * Column `users.city`.
   */
  city: string | null;
  /**
   * Column `users.state`.
   */
  state: string | null;
  /**
   * Column `users.country`.
   */
  country: string | null;
  /**
   * Column `users.created_at`.
   */
  created_at: string | null;
  /**
   * Column `users.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `users.location`.
   */
  location: Json | null;
}
type public_usersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `users` to table `users` through the column `users.id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "public_users", [...TPath, "auth_users"]>;
};
type public_usersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `users` to table `answers` through the column `answers.user_id`.
  */
  answers: OmitChildInputs<answersChildInputs<[...TPath, "answers"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `comments` through the column `comments.user_id`.
  */
  comments: OmitChildInputs<commentsChildInputs<[...TPath, "comments"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `customers` through the column `customers.user_id`.
  */
  customers: OmitChildInputs<customersChildInputs<[...TPath, "customers"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `friends` through the column `friends.friend_id`.
  */
  friends_friends_friend_idTopublic_users: OmitChildInputs<friendsChildInputs<[...TPath, "friends_friends_friend_idTopublic_users"]>, "public_users_friends_friend_idTopublic_users" | "friend_id">;
  /**
  * Relationship from table `users` to table `friends` through the column `friends.user_id`.
  */
  friends_friends_user_idTopublic_users: OmitChildInputs<friendsChildInputs<[...TPath, "friends_friends_user_idTopublic_users"]>, "public_users_friends_user_idTopublic_users" | "user_id">;
  /**
  * Relationship from table `users` to table `items` through the column `items.user_id`.
  */
  items: OmitChildInputs<itemsChildInputs<[...TPath, "items"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `notifications` through the column `notifications.user_id`.
  */
  notifications: OmitChildInputs<notificationsChildInputs<[...TPath, "notifications"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `onboarding_steps` through the column `onboarding_steps.user_id`.
  */
  onboarding_steps: OmitChildInputs<onboarding_stepsChildInputs<[...TPath, "onboarding_steps"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `packs` through the column `packs.user_id`.
  */
  packs: OmitChildInputs<packsChildInputs<[...TPath, "packs"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `polls` through the column `polls.user_id`.
  */
  polls: OmitChildInputs<pollsChildInputs<[...TPath, "polls"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `questions` through the column `questions.user_id`.
  */
  questions: OmitChildInputs<questionsChildInputs<[...TPath, "questions"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `replies` through the column `replies.user_id`.
  */
  replies: OmitChildInputs<repliesChildInputs<[...TPath, "replies"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `shopping_list_items` through the column `shopping_list_items.user_id`.
  */
  shopping_list_items: OmitChildInputs<shopping_list_itemsChildInputs<[...TPath, "shopping_list_items"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `subscriptions` through the column `subscriptions.user_id`.
  */
  subscriptions: OmitChildInputs<subscriptionsChildInputs<[...TPath, "subscriptions"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `todos` through the column `todos.user_id`.
  */
  todos: OmitChildInputs<todosChildInputs<[...TPath, "todos"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `trip_friends` through the column `trip_friends.user_id`.
  */
  trip_friends: OmitChildInputs<trip_friendsChildInputs<[...TPath, "trip_friends"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `trip_packs` through the column `trip_packs.user_id`.
  */
  trip_packs: OmitChildInputs<trip_packsChildInputs<[...TPath, "trip_packs"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `trips` through the column `trips.user_id`.
  */
  trips: OmitChildInputs<tripsChildInputs<[...TPath, "trips"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `user_answers` through the column `user_answers.user_id`.
  */
  user_answers: OmitChildInputs<user_answersChildInputs<[...TPath, "user_answers"]>, "public_users" | "user_id">;
};
type public_usersInputs<TPath extends string[]> = Inputs<
  public_usersScalars,
  public_usersParentsInputs<TPath>,
  public_usersChildrenInputs<TPath>
>;
type public_usersChildInputs<TPath extends string[]> = ChildInputs<public_usersInputs<TPath>>;
type public_usersParentInputs<TPath extends string[]> = ParentInputs<
public_usersInputs<TPath>,
  TPath
>;
type _http_responseParentsGraph = {

};
type _http_responseChildrenGraph = {

};
type _http_responseGraph = Array<{
  Scalars: _http_responseScalars;
  Parents: _http_responseParentsGraph;
  Children: _http_responseChildrenGraph;
}>;
type answersParentsGraph = {
 questions: OmitChildGraph<questionsGraph, "answers">;
 public_users: OmitChildGraph<public_usersGraph, "answers">;
};
type answersChildrenGraph = {
 user_answers: OmitParentGraph<user_answersGraph, "answers">;
};
type answersGraph = Array<{
  Scalars: answersScalars;
  Parents: answersParentsGraph;
  Children: answersChildrenGraph;
}>;
type audit_log_entriesParentsGraph = {

};
type audit_log_entriesChildrenGraph = {

};
type audit_log_entriesGraph = Array<{
  Scalars: audit_log_entriesScalars;
  Parents: audit_log_entriesParentsGraph;
  Children: audit_log_entriesChildrenGraph;
}>;
type bucketsParentsGraph = {

};
type bucketsChildrenGraph = {
 objects: OmitParentGraph<objectsGraph, "buckets">;
};
type bucketsGraph = Array<{
  Scalars: bucketsScalars;
  Parents: bucketsParentsGraph;
  Children: bucketsChildrenGraph;
}>;
type categoriesParentsGraph = {
 packs: OmitChildGraph<packsGraph, "categories">;
};
type categoriesChildrenGraph = {
 category_items: OmitParentGraph<category_itemsGraph, "categories">;
};
type categoriesGraph = Array<{
  Scalars: categoriesScalars;
  Parents: categoriesParentsGraph;
  Children: categoriesChildrenGraph;
}>;
type category_itemsParentsGraph = {
 categories: OmitChildGraph<categoriesGraph, "category_items">;
 items: OmitChildGraph<itemsGraph, "category_items">;
};
type category_itemsChildrenGraph = {

};
type category_itemsGraph = Array<{
  Scalars: category_itemsScalars;
  Parents: category_itemsParentsGraph;
  Children: category_itemsChildrenGraph;
}>;
type commentsParentsGraph = {
 packs: OmitChildGraph<packsGraph, "comments">;
 public_users: OmitChildGraph<public_usersGraph, "comments">;
};
type commentsChildrenGraph = {
 replies: OmitParentGraph<repliesGraph, "comments">;
};
type commentsGraph = Array<{
  Scalars: commentsScalars;
  Parents: commentsParentsGraph;
  Children: commentsChildrenGraph;
}>;
type customersParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "customers">;
};
type customersChildrenGraph = {

};
type customersGraph = Array<{
  Scalars: customersScalars;
  Parents: customersParentsGraph;
  Children: customersChildrenGraph;
}>;
type flow_stateParentsGraph = {

};
type flow_stateChildrenGraph = {
 saml_relay_states: OmitParentGraph<saml_relay_statesGraph, "flow_state">;
};
type flow_stateGraph = Array<{
  Scalars: flow_stateScalars;
  Parents: flow_stateParentsGraph;
  Children: flow_stateChildrenGraph;
}>;
type friendsParentsGraph = {
 public_users_friends_friend_idTopublic_users: OmitChildGraph<public_usersGraph, "friends_friends_friend_idTopublic_users">;
 public_users_friends_user_idTopublic_users: OmitChildGraph<public_usersGraph, "friends_friends_user_idTopublic_users">;
};
type friendsChildrenGraph = {

};
type friendsGraph = Array<{
  Scalars: friendsScalars;
  Parents: friendsParentsGraph;
  Children: friendsChildrenGraph;
}>;
type hooksParentsGraph = {

};
type hooksChildrenGraph = {

};
type hooksGraph = Array<{
  Scalars: hooksScalars;
  Parents: hooksParentsGraph;
  Children: hooksChildrenGraph;
}>;
type http_request_queueParentsGraph = {

};
type http_request_queueChildrenGraph = {

};
type http_request_queueGraph = Array<{
  Scalars: http_request_queueScalars;
  Parents: http_request_queueParentsGraph;
  Children: http_request_queueChildrenGraph;
}>;
type identitiesParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "identities">;
};
type identitiesChildrenGraph = {

};
type identitiesGraph = Array<{
  Scalars: identitiesScalars;
  Parents: identitiesParentsGraph;
  Children: identitiesChildrenGraph;
}>;
type instancesParentsGraph = {

};
type instancesChildrenGraph = {

};
type instancesGraph = Array<{
  Scalars: instancesScalars;
  Parents: instancesParentsGraph;
  Children: instancesChildrenGraph;
}>;
type itemsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "items">;
};
type itemsChildrenGraph = {
 category_items: OmitParentGraph<category_itemsGraph, "items">;
};
type itemsGraph = Array<{
  Scalars: itemsScalars;
  Parents: itemsParentsGraph;
  Children: itemsChildrenGraph;
}>;
type keyParentsGraph = {
 key: OmitChildGraph<keyGraph, "key">;
};
type keyChildrenGraph = {
 secrets: OmitParentGraph<secretsGraph, "key">;
};
type keyGraph = Array<{
  Scalars: keyScalars;
  Parents: keyParentsGraph;
  Children: keyChildrenGraph;
}>;
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsGraph = {

};
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenGraph = {

};
type log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Graph = Array<{
  Scalars: log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars;
  Parents: log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsGraph;
  Children: log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenGraph;
}>;
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eParentsGraph = {

};
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eChildrenGraph = {

};
type log_events_6942dc85_c452_4072_99e1_813ff24aa81eGraph = Array<{
  Scalars: log_events_6942dc85_c452_4072_99e1_813ff24aa81eScalars;
  Parents: log_events_6942dc85_c452_4072_99e1_813ff24aa81eParentsGraph;
  Children: log_events_6942dc85_c452_4072_99e1_813ff24aa81eChildrenGraph;
}>;
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsGraph = {

};
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenGraph = {

};
type log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Graph = Array<{
  Scalars: log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars;
  Parents: log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsGraph;
  Children: log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenGraph;
}>;
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsGraph = {

};
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenGraph = {

};
type log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecGraph = Array<{
  Scalars: log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars;
  Parents: log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsGraph;
  Children: log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenGraph;
}>;
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsGraph = {

};
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenGraph = {

};
type log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Graph = Array<{
  Scalars: log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars;
  Parents: log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsGraph;
  Children: log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenGraph;
}>;
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsGraph = {

};
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenGraph = {

};
type log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Graph = Array<{
  Scalars: log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars;
  Parents: log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsGraph;
  Children: log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenGraph;
}>;
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsGraph = {

};
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenGraph = {

};
type log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deGraph = Array<{
  Scalars: log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars;
  Parents: log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsGraph;
  Children: log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenGraph;
}>;
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsGraph = {

};
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenGraph = {

};
type log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Graph = Array<{
  Scalars: log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars;
  Parents: log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsGraph;
  Children: log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenGraph;
}>;
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsGraph = {

};
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenGraph = {

};
type log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Graph = Array<{
  Scalars: log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars;
  Parents: log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsGraph;
  Children: log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenGraph;
}>;
type mfa_amr_claimsParentsGraph = {
 sessions: OmitChildGraph<sessionsGraph, "mfa_amr_claims">;
};
type mfa_amr_claimsChildrenGraph = {

};
type mfa_amr_claimsGraph = Array<{
  Scalars: mfa_amr_claimsScalars;
  Parents: mfa_amr_claimsParentsGraph;
  Children: mfa_amr_claimsChildrenGraph;
}>;
type mfa_challengesParentsGraph = {
 mfa_factors: OmitChildGraph<mfa_factorsGraph, "mfa_challenges">;
};
type mfa_challengesChildrenGraph = {

};
type mfa_challengesGraph = Array<{
  Scalars: mfa_challengesScalars;
  Parents: mfa_challengesParentsGraph;
  Children: mfa_challengesChildrenGraph;
}>;
type mfa_factorsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "mfa_factors">;
};
type mfa_factorsChildrenGraph = {
 mfa_challenges: OmitParentGraph<mfa_challengesGraph, "mfa_factors">;
};
type mfa_factorsGraph = Array<{
  Scalars: mfa_factorsScalars;
  Parents: mfa_factorsParentsGraph;
  Children: mfa_factorsChildrenGraph;
}>;
type storage_migrationsParentsGraph = {

};
type storage_migrationsChildrenGraph = {

};
type storage_migrationsGraph = Array<{
  Scalars: storage_migrationsScalars;
  Parents: storage_migrationsParentsGraph;
  Children: storage_migrationsChildrenGraph;
}>;
type supabase_functions_migrationsParentsGraph = {

};
type supabase_functions_migrationsChildrenGraph = {

};
type supabase_functions_migrationsGraph = Array<{
  Scalars: supabase_functions_migrationsScalars;
  Parents: supabase_functions_migrationsParentsGraph;
  Children: supabase_functions_migrationsChildrenGraph;
}>;
type notificationsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "notifications">;
};
type notificationsChildrenGraph = {

};
type notificationsGraph = Array<{
  Scalars: notificationsScalars;
  Parents: notificationsParentsGraph;
  Children: notificationsChildrenGraph;
}>;
type objectsParentsGraph = {
 buckets: OmitChildGraph<bucketsGraph, "objects">;
};
type objectsChildrenGraph = {

};
type objectsGraph = Array<{
  Scalars: objectsScalars;
  Parents: objectsParentsGraph;
  Children: objectsChildrenGraph;
}>;
type onboarding_stepsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "onboarding_steps">;
};
type onboarding_stepsChildrenGraph = {

};
type onboarding_stepsGraph = Array<{
  Scalars: onboarding_stepsScalars;
  Parents: onboarding_stepsParentsGraph;
  Children: onboarding_stepsChildrenGraph;
}>;
type packsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "packs">;
};
type packsChildrenGraph = {
 categories: OmitParentGraph<categoriesGraph, "packs">;
 comments: OmitParentGraph<commentsGraph, "packs">;
 trip_packs: OmitParentGraph<trip_packsGraph, "packs">;
};
type packsGraph = Array<{
  Scalars: packsScalars;
  Parents: packsParentsGraph;
  Children: packsChildrenGraph;
}>;
type pollsParentsGraph = {
 trips: OmitChildGraph<tripsGraph, "polls">;
 public_users: OmitChildGraph<public_usersGraph, "polls">;
};
type pollsChildrenGraph = {
 questions: OmitParentGraph<questionsGraph, "polls">;
 user_answers: OmitParentGraph<user_answersGraph, "polls">;
};
type pollsGraph = Array<{
  Scalars: pollsScalars;
  Parents: pollsParentsGraph;
  Children: pollsChildrenGraph;
}>;
type pricesParentsGraph = {
 products: OmitChildGraph<productsGraph, "prices">;
};
type pricesChildrenGraph = {
 subscriptions: OmitParentGraph<subscriptionsGraph, "prices">;
};
type pricesGraph = Array<{
  Scalars: pricesScalars;
  Parents: pricesParentsGraph;
  Children: pricesChildrenGraph;
}>;
type productsParentsGraph = {

};
type productsChildrenGraph = {
 prices: OmitParentGraph<pricesGraph, "products">;
};
type productsGraph = Array<{
  Scalars: productsScalars;
  Parents: productsParentsGraph;
  Children: productsChildrenGraph;
}>;
type questionsParentsGraph = {
 polls: OmitChildGraph<pollsGraph, "questions">;
 public_users: OmitChildGraph<public_usersGraph, "questions">;
};
type questionsChildrenGraph = {
 answers: OmitParentGraph<answersGraph, "questions">;
};
type questionsGraph = Array<{
  Scalars: questionsScalars;
  Parents: questionsParentsGraph;
  Children: questionsChildrenGraph;
}>;
type refresh_tokensParentsGraph = {
 sessions: OmitChildGraph<sessionsGraph, "refresh_tokens">;
};
type refresh_tokensChildrenGraph = {

};
type refresh_tokensGraph = Array<{
  Scalars: refresh_tokensScalars;
  Parents: refresh_tokensParentsGraph;
  Children: refresh_tokensChildrenGraph;
}>;
type repliesParentsGraph = {
 comments: OmitChildGraph<commentsGraph, "replies">;
 public_users: OmitChildGraph<public_usersGraph, "replies">;
};
type repliesChildrenGraph = {

};
type repliesGraph = Array<{
  Scalars: repliesScalars;
  Parents: repliesParentsGraph;
  Children: repliesChildrenGraph;
}>;
type saml_providersParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "saml_providers">;
};
type saml_providersChildrenGraph = {

};
type saml_providersGraph = Array<{
  Scalars: saml_providersScalars;
  Parents: saml_providersParentsGraph;
  Children: saml_providersChildrenGraph;
}>;
type saml_relay_statesParentsGraph = {
 flow_state: OmitChildGraph<flow_stateGraph, "saml_relay_states">;
 sso_providers: OmitChildGraph<sso_providersGraph, "saml_relay_states">;
};
type saml_relay_statesChildrenGraph = {

};
type saml_relay_statesGraph = Array<{
  Scalars: saml_relay_statesScalars;
  Parents: saml_relay_statesParentsGraph;
  Children: saml_relay_statesChildrenGraph;
}>;
type auth_schema_migrationsParentsGraph = {

};
type auth_schema_migrationsChildrenGraph = {

};
type auth_schema_migrationsGraph = Array<{
  Scalars: auth_schema_migrationsScalars;
  Parents: auth_schema_migrationsParentsGraph;
  Children: auth_schema_migrationsChildrenGraph;
}>;
type supabase_migrations_schema_migrationsParentsGraph = {

};
type supabase_migrations_schema_migrationsChildrenGraph = {

};
type supabase_migrations_schema_migrationsGraph = Array<{
  Scalars: supabase_migrations_schema_migrationsScalars;
  Parents: supabase_migrations_schema_migrationsParentsGraph;
  Children: supabase_migrations_schema_migrationsChildrenGraph;
}>;
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsGraph = {

};
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenGraph = {

};
type schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Graph = Array<{
  Scalars: schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Scalars;
  Parents: schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ParentsGraph;
  Children: schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildrenGraph;
}>;
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eParentsGraph = {

};
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eChildrenGraph = {

};
type schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eGraph = Array<{
  Scalars: schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eScalars;
  Parents: schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eParentsGraph;
  Children: schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eChildrenGraph;
}>;
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsGraph = {

};
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenGraph = {

};
type schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Graph = Array<{
  Scalars: schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Scalars;
  Parents: schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ParentsGraph;
  Children: schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ChildrenGraph;
}>;
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsGraph = {

};
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenGraph = {

};
type schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecGraph = Array<{
  Scalars: schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecScalars;
  Parents: schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecParentsGraph;
  Children: schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildrenGraph;
}>;
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsGraph = {

};
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenGraph = {

};
type schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Graph = Array<{
  Scalars: schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Scalars;
  Parents: schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ParentsGraph;
  Children: schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildrenGraph;
}>;
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsGraph = {

};
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenGraph = {

};
type schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Graph = Array<{
  Scalars: schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Scalars;
  Parents: schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ParentsGraph;
  Children: schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildrenGraph;
}>;
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsGraph = {

};
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenGraph = {

};
type schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deGraph = Array<{
  Scalars: schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deScalars;
  Parents: schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deParentsGraph;
  Children: schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deChildrenGraph;
}>;
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsGraph = {

};
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenGraph = {

};
type schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Graph = Array<{
  Scalars: schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Scalars;
  Parents: schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ParentsGraph;
  Children: schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ChildrenGraph;
}>;
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsGraph = {

};
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenGraph = {

};
type schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Graph = Array<{
  Scalars: schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Scalars;
  Parents: schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ParentsGraph;
  Children: schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildrenGraph;
}>;
type secretsParentsGraph = {
 key: OmitChildGraph<keyGraph, "secrets">;
};
type secretsChildrenGraph = {

};
type secretsGraph = Array<{
  Scalars: secretsScalars;
  Parents: secretsParentsGraph;
  Children: secretsChildrenGraph;
}>;
type sessionsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "sessions">;
};
type sessionsChildrenGraph = {
 mfa_amr_claims: OmitParentGraph<mfa_amr_claimsGraph, "sessions">;
 refresh_tokens: OmitParentGraph<refresh_tokensGraph, "sessions">;
};
type sessionsGraph = Array<{
  Scalars: sessionsScalars;
  Parents: sessionsParentsGraph;
  Children: sessionsChildrenGraph;
}>;
type shopping_list_itemsParentsGraph = {
 trips: OmitChildGraph<tripsGraph, "shopping_list_items">;
 public_users: OmitChildGraph<public_usersGraph, "shopping_list_items">;
};
type shopping_list_itemsChildrenGraph = {

};
type shopping_list_itemsGraph = Array<{
  Scalars: shopping_list_itemsScalars;
  Parents: shopping_list_itemsParentsGraph;
  Children: shopping_list_itemsChildrenGraph;
}>;
type sso_domainsParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "sso_domains">;
};
type sso_domainsChildrenGraph = {

};
type sso_domainsGraph = Array<{
  Scalars: sso_domainsScalars;
  Parents: sso_domainsParentsGraph;
  Children: sso_domainsChildrenGraph;
}>;
type sso_providersParentsGraph = {

};
type sso_providersChildrenGraph = {
 saml_providers: OmitParentGraph<saml_providersGraph, "sso_providers">;
 saml_relay_states: OmitParentGraph<saml_relay_statesGraph, "sso_providers">;
 sso_domains: OmitParentGraph<sso_domainsGraph, "sso_providers">;
};
type sso_providersGraph = Array<{
  Scalars: sso_providersScalars;
  Parents: sso_providersParentsGraph;
  Children: sso_providersChildrenGraph;
}>;
type subscriptionsParentsGraph = {
 prices: OmitChildGraph<pricesGraph, "subscriptions">;
 public_users: OmitChildGraph<public_usersGraph, "subscriptions">;
};
type subscriptionsChildrenGraph = {

};
type subscriptionsGraph = Array<{
  Scalars: subscriptionsScalars;
  Parents: subscriptionsParentsGraph;
  Children: subscriptionsChildrenGraph;
}>;
type todosParentsGraph = {
 trips: OmitChildGraph<tripsGraph, "todos">;
 public_users: OmitChildGraph<public_usersGraph, "todos">;
};
type todosChildrenGraph = {

};
type todosGraph = Array<{
  Scalars: todosScalars;
  Parents: todosParentsGraph;
  Children: todosChildrenGraph;
}>;
type trip_detailsParentsGraph = {
 trips: OmitChildGraph<tripsGraph, "trip_details">;
};
type trip_detailsChildrenGraph = {

};
type trip_detailsGraph = Array<{
  Scalars: trip_detailsScalars;
  Parents: trip_detailsParentsGraph;
  Children: trip_detailsChildrenGraph;
}>;
type trip_friendsParentsGraph = {
 trips: OmitChildGraph<tripsGraph, "trip_friends">;
 public_users: OmitChildGraph<public_usersGraph, "trip_friends">;
};
type trip_friendsChildrenGraph = {

};
type trip_friendsGraph = Array<{
  Scalars: trip_friendsScalars;
  Parents: trip_friendsParentsGraph;
  Children: trip_friendsChildrenGraph;
}>;
type trip_packsParentsGraph = {
 packs: OmitChildGraph<packsGraph, "trip_packs">;
 trips: OmitChildGraph<tripsGraph, "trip_packs">;
 public_users: OmitChildGraph<public_usersGraph, "trip_packs">;
};
type trip_packsChildrenGraph = {

};
type trip_packsGraph = Array<{
  Scalars: trip_packsScalars;
  Parents: trip_packsParentsGraph;
  Children: trip_packsChildrenGraph;
}>;
type tripsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "trips">;
};
type tripsChildrenGraph = {
 polls: OmitParentGraph<pollsGraph, "trips">;
 shopping_list_items: OmitParentGraph<shopping_list_itemsGraph, "trips">;
 todos: OmitParentGraph<todosGraph, "trips">;
 trip_details: OmitParentGraph<trip_detailsGraph, "trips">;
 trip_friends: OmitParentGraph<trip_friendsGraph, "trips">;
 trip_packs: OmitParentGraph<trip_packsGraph, "trips">;
};
type tripsGraph = Array<{
  Scalars: tripsScalars;
  Parents: tripsParentsGraph;
  Children: tripsChildrenGraph;
}>;
type user_answersParentsGraph = {
 answers: OmitChildGraph<answersGraph, "user_answers">;
 polls: OmitChildGraph<pollsGraph, "user_answers">;
 public_users: OmitChildGraph<public_usersGraph, "user_answers">;
};
type user_answersChildrenGraph = {

};
type user_answersGraph = Array<{
  Scalars: user_answersScalars;
  Parents: user_answersParentsGraph;
  Children: user_answersChildrenGraph;
}>;
type auth_usersParentsGraph = {

};
type auth_usersChildrenGraph = {
 identities: OmitParentGraph<identitiesGraph, "auth_users">;
 mfa_factors: OmitParentGraph<mfa_factorsGraph, "auth_users">;
 sessions: OmitParentGraph<sessionsGraph, "auth_users">;
 public_users: OmitParentGraph<public_usersGraph, "auth_users">;
};
type auth_usersGraph = Array<{
  Scalars: auth_usersScalars;
  Parents: auth_usersParentsGraph;
  Children: auth_usersChildrenGraph;
}>;
type public_usersParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "public_users">;
};
type public_usersChildrenGraph = {
 answers: OmitParentGraph<answersGraph, "public_users">;
 comments: OmitParentGraph<commentsGraph, "public_users">;
 customers: OmitParentGraph<customersGraph, "public_users">;
 friends_friends_friend_idTopublic_users: OmitParentGraph<friendsGraph, "public_users_friends_friend_idTopublic_users">;
 friends_friends_user_idTopublic_users: OmitParentGraph<friendsGraph, "public_users_friends_user_idTopublic_users">;
 items: OmitParentGraph<itemsGraph, "public_users">;
 notifications: OmitParentGraph<notificationsGraph, "public_users">;
 onboarding_steps: OmitParentGraph<onboarding_stepsGraph, "public_users">;
 packs: OmitParentGraph<packsGraph, "public_users">;
 polls: OmitParentGraph<pollsGraph, "public_users">;
 questions: OmitParentGraph<questionsGraph, "public_users">;
 replies: OmitParentGraph<repliesGraph, "public_users">;
 shopping_list_items: OmitParentGraph<shopping_list_itemsGraph, "public_users">;
 subscriptions: OmitParentGraph<subscriptionsGraph, "public_users">;
 todos: OmitParentGraph<todosGraph, "public_users">;
 trip_friends: OmitParentGraph<trip_friendsGraph, "public_users">;
 trip_packs: OmitParentGraph<trip_packsGraph, "public_users">;
 trips: OmitParentGraph<tripsGraph, "public_users">;
 user_answers: OmitParentGraph<user_answersGraph, "public_users">;
};
type public_usersGraph = Array<{
  Scalars: public_usersScalars;
  Parents: public_usersParentsGraph;
  Children: public_usersChildrenGraph;
}>;
type Graph = {
  _http_response: _http_responseGraph;
  answers: answersGraph;
  audit_log_entries: audit_log_entriesGraph;
  buckets: bucketsGraph;
  categories: categoriesGraph;
  category_items: category_itemsGraph;
  comments: commentsGraph;
  customers: customersGraph;
  flow_state: flow_stateGraph;
  friends: friendsGraph;
  hooks: hooksGraph;
  http_request_queue: http_request_queueGraph;
  identities: identitiesGraph;
  instances: instancesGraph;
  items: itemsGraph;
  key: keyGraph;
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91: log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91Graph;
  log_events_6942dc85_c452_4072_99e1_813ff24aa81e: log_events_6942dc85_c452_4072_99e1_813ff24aa81eGraph;
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700: log_events_73a4c865_0ffb_4641_b8d9_c923382bb700Graph;
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecGraph;
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Graph;
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Graph;
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de: log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deGraph;
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805: log_events_dd523764_6f36_4f31_8a44_8baaa86e3805Graph;
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9: log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9Graph;
  mfa_amr_claims: mfa_amr_claimsGraph;
  mfa_challenges: mfa_challengesGraph;
  mfa_factors: mfa_factorsGraph;
  storage_migrations: storage_migrationsGraph;
  supabase_functions_migrations: supabase_functions_migrationsGraph;
  notifications: notificationsGraph;
  objects: objectsGraph;
  onboarding_steps: onboarding_stepsGraph;
  packs: packsGraph;
  polls: pollsGraph;
  prices: pricesGraph;
  products: productsGraph;
  questions: questionsGraph;
  refresh_tokens: refresh_tokensGraph;
  replies: repliesGraph;
  saml_providers: saml_providersGraph;
  saml_relay_states: saml_relay_statesGraph;
  auth_schema_migrations: auth_schema_migrationsGraph;
  supabase_migrations_schema_migrations: supabase_migrations_schema_migrationsGraph;
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91: schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91Graph;
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e: schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eGraph;
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700: schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700Graph;
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecGraph;
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55Graph;
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7Graph;
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de: schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deGraph;
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805: schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805Graph;
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9: schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9Graph;
  secrets: secretsGraph;
  sessions: sessionsGraph;
  shopping_list_items: shopping_list_itemsGraph;
  sso_domains: sso_domainsGraph;
  sso_providers: sso_providersGraph;
  subscriptions: subscriptionsGraph;
  todos: todosGraph;
  trip_details: trip_detailsGraph;
  trip_friends: trip_friendsGraph;
  trip_packs: trip_packsGraph;
  trips: tripsGraph;
  user_answers: user_answersGraph;
  auth_users: auth_usersGraph;
  public_users: public_usersGraph;
};
type ScalarField = {
  name: string;
  type: string;
};
type ObjectField = ScalarField & {
  relationFromFields: string[];
  relationToFields: string[];
};
type Inflection = {
  modelName?: (name: string) => string;
  scalarField?: (field: ScalarField) => string;
  parentField?: (field: ObjectField, oppositeBaseNameMap: Record<string, string>) => string;
  childField?: (field: ObjectField, oppositeField: ObjectField, oppositeBaseNameMap: Record<string, string>) => string;
  oppositeBaseNameMap?: Record<string, string>;
};
type Override = {
  _http_response?: {
    name?: string;
    fields?: {
      id?: string;
      status_code?: string;
      content_type?: string;
      headers?: string;
      content?: string;
      timed_out?: string;
      error_msg?: string;
      created?: string;
    };
  }
  answers?: {
    name?: string;
    fields?: {
      id?: string;
      content?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      question_id?: string;
      questions?: string;
      public_users?: string;
      user_answers?: string;
    };
  }
  audit_log_entries?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      payload?: string;
      created_at?: string;
      ip_address?: string;
    };
  }
  buckets?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      owner?: string;
      created_at?: string;
      updated_at?: string;
      public?: string;
      avif_autodetection?: string;
      file_size_limit?: string;
      allowed_mime_types?: string;
      owner_id?: string;
      objects?: string;
    };
  }
  categories?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      unit?: string;
      slug?: string;
      pack_id?: string;
      updated_at?: string;
      packs?: string;
      category_items?: string;
    };
  }
  category_items?: {
    name?: string;
    fields?: {
      id?: string;
      category_id?: string;
      item_id?: string;
      position?: string;
      created_at?: string;
      updated_at?: string;
      categories?: string;
      items?: string;
    };
  }
  comments?: {
    name?: string;
    fields?: {
      id?: string;
      text?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      pack_id?: string;
      packs?: string;
      public_users?: string;
      replies?: string;
    };
  }
  customers?: {
    name?: string;
    fields?: {
      id?: string;
      stripe_customer_id?: string;
      user_id?: string;
      public_users?: string;
    };
  }
  flow_state?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      auth_code?: string;
      code_challenge_method?: string;
      code_challenge?: string;
      provider_type?: string;
      provider_access_token?: string;
      provider_refresh_token?: string;
      created_at?: string;
      updated_at?: string;
      authentication_method?: string;
      saml_relay_states?: string;
    };
  }
  friends?: {
    name?: string;
    fields?: {
      id?: string;
      invite_sent_on?: string;
      invite_accepted_on?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      friend_id?: string;
      public_users_friends_friend_idTopublic_users?: string;
      public_users_friends_user_idTopublic_users?: string;
    };
  }
  hooks?: {
    name?: string;
    fields?: {
      id?: string;
      hook_table_id?: string;
      hook_name?: string;
      created_at?: string;
      request_id?: string;
    };
  }
  http_request_queue?: {
    name?: string;
    fields?: {
      id?: string;
      method?: string;
      url?: string;
      headers?: string;
      body?: string;
      timeout_milliseconds?: string;
    };
  }
  identities?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      identity_data?: string;
      provider?: string;
      last_sign_in_at?: string;
      created_at?: string;
      updated_at?: string;
      email?: string;
      auth_users?: string;
    };
  }
  instances?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      raw_base_config?: string;
      created_at?: string;
      updated_at?: string;
    };
  }
  items?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      generic_type?: string;
      price?: string;
      consumable?: string;
      worn?: string;
      quantity?: string;
      unit?: string;
      weight?: string;
      url?: string;
      slug?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      public_users?: string;
      category_items?: string;
    };
  }
  key?: {
    name?: string;
    fields?: {
      id?: string;
      status?: string;
      created?: string;
      expires?: string;
      key_type?: string;
      key_id?: string;
      key_context?: string;
      name?: string;
      associated_data?: string;
      raw_key?: string;
      raw_key_nonce?: string;
      parent_key?: string;
      comment?: string;
      user_data?: string;
      key?: string;
      key?: string;
      secrets?: string;
    };
  }
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_6942dc85_c452_4072_99e1_813ff24aa81e?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9?: {
    name?: string;
    fields?: {
      id?: string;
      body?: string;
      event_message?: string;
      timestamp?: string;
    };
  }
  mfa_amr_claims?: {
    name?: string;
    fields?: {
      session_id?: string;
      created_at?: string;
      updated_at?: string;
      authentication_method?: string;
      id?: string;
      sessions?: string;
    };
  }
  mfa_challenges?: {
    name?: string;
    fields?: {
      id?: string;
      factor_id?: string;
      created_at?: string;
      verified_at?: string;
      ip_address?: string;
      mfa_factors?: string;
    };
  }
  mfa_factors?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      friendly_name?: string;
      factor_type?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
      secret?: string;
      auth_users?: string;
      mfa_challenges?: string;
    };
  }
  storage_migrations?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      hash?: string;
      executed_at?: string;
    };
  }
  supabase_functions_migrations?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  notifications?: {
    name?: string;
    fields?: {
      id?: string;
      title?: string;
      content?: string;
      read_on_date?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      public_users?: string;
    };
  }
  objects?: {
    name?: string;
    fields?: {
      id?: string;
      bucket_id?: string;
      name?: string;
      owner?: string;
      created_at?: string;
      updated_at?: string;
      last_accessed_at?: string;
      metadata?: string;
      path_tokens?: string;
      version?: string;
      owner_id?: string;
      buckets?: string;
    };
  }
  onboarding_steps?: {
    name?: string;
    fields?: {
      user_id?: string;
      page?: string;
      completion_date?: string;
      created_at?: string;
      updated_at?: string;
      public_users?: string;
    };
  }
  packs?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      slug?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      theme?: string;
      private?: string;
      allow_comments?: string;
      public_users?: string;
      categories?: string;
      comments?: string;
      trip_packs?: string;
    };
  }
  polls?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      trip_id?: string;
      trips?: string;
      public_users?: string;
      questions?: string;
      user_answers?: string;
    };
  }
  prices?: {
    name?: string;
    fields?: {
      id?: string;
      product_id?: string;
      active?: string;
      description?: string;
      unit_amount?: string;
      currency?: string;
      type?: string;
      interval?: string;
      interval_count?: string;
      trial_period_days?: string;
      metadata?: string;
      identifier?: string;
      environment?: string;
      products?: string;
      subscriptions?: string;
    };
  }
  products?: {
    name?: string;
    fields?: {
      id?: string;
      active?: string;
      name?: string;
      description?: string;
      image?: string;
      metadata?: string;
      environment?: string;
      prices?: string;
    };
  }
  questions?: {
    name?: string;
    fields?: {
      id?: string;
      title?: string;
      poll_id?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      polls?: string;
      public_users?: string;
      answers?: string;
    };
  }
  refresh_tokens?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      token?: string;
      user_id?: string;
      revoked?: string;
      created_at?: string;
      updated_at?: string;
      parent?: string;
      session_id?: string;
      sessions?: string;
    };
  }
  replies?: {
    name?: string;
    fields?: {
      id?: string;
      comment_id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      text?: string;
      comments?: string;
      public_users?: string;
    };
  }
  saml_providers?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      entity_id?: string;
      metadata_xml?: string;
      metadata_url?: string;
      attribute_mapping?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  saml_relay_states?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      request_id?: string;
      for_email?: string;
      redirect_to?: string;
      from_ip_address?: string;
      created_at?: string;
      updated_at?: string;
      flow_state_id?: string;
      flow_state?: string;
      sso_providers?: string;
    };
  }
  auth_schema_migrations?: {
    name?: string;
    fields?: {
      version?: string;
    };
  }
  supabase_migrations_schema_migrations?: {
    name?: string;
    fields?: {
      version?: string;
      statements?: string;
      name?: string;
    };
  }
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  secrets?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      description?: string;
      secret?: string;
      key_id?: string;
      nonce?: string;
      created_at?: string;
      updated_at?: string;
      key?: string;
    };
  }
  sessions?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      factor_id?: string;
      aal?: string;
      not_after?: string;
      refreshed_at?: string;
      user_agent?: string;
      ip?: string;
      auth_users?: string;
      mfa_amr_claims?: string;
      refresh_tokens?: string;
    };
  }
  shopping_list_items?: {
    name?: string;
    fields?: {
      id?: string;
      title?: string;
      completed?: string;
      quantity?: string;
      trip_id?: string;
      created_at?: string;
      updated_at?: string;
      resource_type?: string;
      user_id?: string;
      trips?: string;
      public_users?: string;
    };
  }
  sso_domains?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      domain?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  sso_providers?: {
    name?: string;
    fields?: {
      id?: string;
      resource_id?: string;
      created_at?: string;
      updated_at?: string;
      saml_providers?: string;
      saml_relay_states?: string;
      sso_domains?: string;
    };
  }
  subscriptions?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      status?: string;
      metadata?: string;
      price_id?: string;
      quantity?: string;
      cancel_at_period_end?: string;
      created_at?: string;
      current_period_start?: string;
      current_period_end?: string;
      ended_at?: string;
      cancel_at?: string;
      canceled_at?: string;
      trial_start?: string;
      trial_end?: string;
      stripe_subscription_id?: string;
      prices?: string;
      public_users?: string;
    };
  }
  todos?: {
    name?: string;
    fields?: {
      id?: string;
      title?: string;
      completed?: string;
      trip_id?: string;
      created_at?: string;
      updated_at?: string;
      resource_type?: string;
      user_id?: string;
      trips?: string;
      public_users?: string;
    };
  }
  trip_details?: {
    name?: string;
    fields?: {
      id?: string;
      title?: string;
      url?: string;
      value?: string;
      type?: string;
      trip_id?: string;
      created_at?: string;
      updated_at?: string;
      trips?: string;
    };
  }
  trip_friends?: {
    name?: string;
    fields?: {
      id?: string;
      trip_id?: string;
      accepted_invite_on?: string;
      created_at?: string;
      status?: string;
      user_id?: string;
      updated_at?: string;
      trips?: string;
      public_users?: string;
    };
  }
  trip_packs?: {
    name?: string;
    fields?: {
      id?: string;
      trip_id?: string;
      pack_id?: string;
      created_at?: string;
      updated_at?: string;
      user_id?: string;
      packs?: string;
      trips?: string;
      public_users?: string;
    };
  }
  trips?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      description?: string;
      starting_point?: string;
      ending_point?: string;
      starting_date?: string;
      ending_date?: string;
      coordinates?: string;
      slug?: string;
      updated_at?: string;
      user_id?: string;
      public_users?: string;
      polls?: string;
      shopping_list_items?: string;
      todos?: string;
      trip_details?: string;
      trip_friends?: string;
      trip_packs?: string;
    };
  }
  user_answers?: {
    name?: string;
    fields?: {
      id?: string;
      answer_id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      poll_id?: string;
      answers?: string;
      polls?: string;
      public_users?: string;
    };
  }
  auth_users?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      aud?: string;
      role?: string;
      email?: string;
      encrypted_password?: string;
      email_confirmed_at?: string;
      invited_at?: string;
      confirmation_token?: string;
      confirmation_sent_at?: string;
      recovery_token?: string;
      recovery_sent_at?: string;
      email_change_token_new?: string;
      email_change?: string;
      email_change_sent_at?: string;
      last_sign_in_at?: string;
      raw_app_meta_data?: string;
      raw_user_meta_data?: string;
      is_super_admin?: string;
      created_at?: string;
      updated_at?: string;
      phone?: string;
      phone_confirmed_at?: string;
      phone_change?: string;
      phone_change_token?: string;
      phone_change_sent_at?: string;
      confirmed_at?: string;
      email_change_token_current?: string;
      email_change_confirm_status?: string;
      banned_until?: string;
      reauthentication_token?: string;
      reauthentication_sent_at?: string;
      is_sso_user?: string;
      deleted_at?: string;
      identities?: string;
      mfa_factors?: string;
      sessions?: string;
      public_users?: string;
    };
  }
  public_users?: {
    name?: string;
    fields?: {
      id?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      trail_name?: string;
      image?: string;
      role?: string;
      subscription_level?: string;
      measuring_system?: string;
      onboard_date?: string;
      address_1?: string;
      address_2?: string;
      city?: string;
      state?: string;
      country?: string;
      created_at?: string;
      updated_at?: string;
      location?: string;
      auth_users?: string;
      answers?: string;
      comments?: string;
      customers?: string;
      friends_friends_friend_idTopublic_users?: string;
      friends_friends_user_idTopublic_users?: string;
      items?: string;
      notifications?: string;
      onboarding_steps?: string;
      packs?: string;
      polls?: string;
      questions?: string;
      replies?: string;
      shopping_list_items?: string;
      subscriptions?: string;
      todos?: string;
      trip_friends?: string;
      trip_packs?: string;
      trips?: string;
      user_answers?: string;
    };
  }}
export type Alias = {
  inflection?: Inflection | boolean;
  override?: Override;
};
export declare class SnapletClientBase {
  /**
   * Generate one or more `_http_response`.
   * @example With static inputs:
   * ```ts
   * snaplet._http_response([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet._http_response((x) => x(3));
   * snaplet._http_response((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet._http_response((x) => [{}, ...x(3), {}]);
   * ```
   */
  _http_response: (
    inputs: _http_responseChildInputs<["_http_response"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `answers`.
   * @example With static inputs:
   * ```ts
   * snaplet.answers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.answers((x) => x(3));
   * snaplet.answers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.answers((x) => [{}, ...x(3), {}]);
   * ```
   */
  answers: (
    inputs: answersChildInputs<["answers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `audit_log_entries`.
   * @example With static inputs:
   * ```ts
   * snaplet.audit_log_entries([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.audit_log_entries((x) => x(3));
   * snaplet.audit_log_entries((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.audit_log_entries((x) => [{}, ...x(3), {}]);
   * ```
   */
  audit_log_entries: (
    inputs: audit_log_entriesChildInputs<["audit_log_entries"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `buckets`.
   * @example With static inputs:
   * ```ts
   * snaplet.buckets([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.buckets((x) => x(3));
   * snaplet.buckets((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.buckets((x) => [{}, ...x(3), {}]);
   * ```
   */
  buckets: (
    inputs: bucketsChildInputs<["buckets"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `categories`.
   * @example With static inputs:
   * ```ts
   * snaplet.categories([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.categories((x) => x(3));
   * snaplet.categories((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.categories((x) => [{}, ...x(3), {}]);
   * ```
   */
  categories: (
    inputs: categoriesChildInputs<["categories"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `category_items`.
   * @example With static inputs:
   * ```ts
   * snaplet.category_items([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.category_items((x) => x(3));
   * snaplet.category_items((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.category_items((x) => [{}, ...x(3), {}]);
   * ```
   */
  category_items: (
    inputs: category_itemsChildInputs<["category_items"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `comments`.
   * @example With static inputs:
   * ```ts
   * snaplet.comments([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.comments((x) => x(3));
   * snaplet.comments((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.comments((x) => [{}, ...x(3), {}]);
   * ```
   */
  comments: (
    inputs: commentsChildInputs<["comments"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `customers`.
   * @example With static inputs:
   * ```ts
   * snaplet.customers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.customers((x) => x(3));
   * snaplet.customers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.customers((x) => [{}, ...x(3), {}]);
   * ```
   */
  customers: (
    inputs: customersChildInputs<["customers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `flow_state`.
   * @example With static inputs:
   * ```ts
   * snaplet.flow_state([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.flow_state((x) => x(3));
   * snaplet.flow_state((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.flow_state((x) => [{}, ...x(3), {}]);
   * ```
   */
  flow_state: (
    inputs: flow_stateChildInputs<["flow_state"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `friends`.
   * @example With static inputs:
   * ```ts
   * snaplet.friends([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.friends((x) => x(3));
   * snaplet.friends((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.friends((x) => [{}, ...x(3), {}]);
   * ```
   */
  friends: (
    inputs: friendsChildInputs<["friends"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `hooks`.
   * @example With static inputs:
   * ```ts
   * snaplet.hooks([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.hooks((x) => x(3));
   * snaplet.hooks((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.hooks((x) => [{}, ...x(3), {}]);
   * ```
   */
  hooks: (
    inputs: hooksChildInputs<["hooks"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `http_request_queue`.
   * @example With static inputs:
   * ```ts
   * snaplet.http_request_queue([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.http_request_queue((x) => x(3));
   * snaplet.http_request_queue((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.http_request_queue((x) => [{}, ...x(3), {}]);
   * ```
   */
  http_request_queue: (
    inputs: http_request_queueChildInputs<["http_request_queue"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `identities`.
   * @example With static inputs:
   * ```ts
   * snaplet.identities([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.identities((x) => x(3));
   * snaplet.identities((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.identities((x) => [{}, ...x(3), {}]);
   * ```
   */
  identities: (
    inputs: identitiesChildInputs<["identities"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `instances`.
   * @example With static inputs:
   * ```ts
   * snaplet.instances([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.instances((x) => x(3));
   * snaplet.instances((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.instances((x) => [{}, ...x(3), {}]);
   * ```
   */
  instances: (
    inputs: instancesChildInputs<["instances"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `items`.
   * @example With static inputs:
   * ```ts
   * snaplet.items([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.items((x) => x(3));
   * snaplet.items((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.items((x) => [{}, ...x(3), {}]);
   * ```
   */
  items: (
    inputs: itemsChildInputs<["items"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `key`.
   * @example With static inputs:
   * ```ts
   * snaplet.key([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.key((x) => x(3));
   * snaplet.key((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.key((x) => [{}, ...x(3), {}]);
   * ```
   */
  key: (
    inputs: keyChildInputs<["key"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91((x) => x(3));
   * snaplet.log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91: (
    inputs: log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildInputs<["log_events_01d9690e_cd0a_4e98_a2d9_d01a09489c91"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_6942dc85_c452_4072_99e1_813ff24aa81e`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_6942dc85_c452_4072_99e1_813ff24aa81e([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_6942dc85_c452_4072_99e1_813ff24aa81e((x) => x(3));
   * snaplet.log_events_6942dc85_c452_4072_99e1_813ff24aa81e((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_6942dc85_c452_4072_99e1_813ff24aa81e((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_6942dc85_c452_4072_99e1_813ff24aa81e: (
    inputs: log_events_6942dc85_c452_4072_99e1_813ff24aa81eChildInputs<["log_events_6942dc85_c452_4072_99e1_813ff24aa81e"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_73a4c865_0ffb_4641_b8d9_c923382bb700`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_73a4c865_0ffb_4641_b8d9_c923382bb700([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_73a4c865_0ffb_4641_b8d9_c923382bb700((x) => x(3));
   * snaplet.log_events_73a4c865_0ffb_4641_b8d9_c923382bb700((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_73a4c865_0ffb_4641_b8d9_c923382bb700((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_73a4c865_0ffb_4641_b8d9_c923382bb700: (
    inputs: log_events_73a4c865_0ffb_4641_b8d9_c923382bb700ChildInputs<["log_events_73a4c865_0ffb_4641_b8d9_c923382bb700"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec((x) => x(3));
   * snaplet.log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: (
    inputs: log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildInputs<["log_events_86b5e621_0d3f_4f69_baf0_f3ef740a4cec"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55((x) => x(3));
   * snaplet.log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: (
    inputs: log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildInputs<["log_events_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7((x) => x(3));
   * snaplet.log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: (
    inputs: log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildInputs<["log_events_b250c80e_d3d6_4fa4_a086_eba6cc9861b7"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de((x) => x(3));
   * snaplet.log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de: (
    inputs: log_events_c714c694_d63c_4d4e_aa95_42e76c05b6deChildInputs<["log_events_c714c694_d63c_4d4e_aa95_42e76c05b6de"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_dd523764_6f36_4f31_8a44_8baaa86e3805`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_dd523764_6f36_4f31_8a44_8baaa86e3805([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_dd523764_6f36_4f31_8a44_8baaa86e3805((x) => x(3));
   * snaplet.log_events_dd523764_6f36_4f31_8a44_8baaa86e3805((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_dd523764_6f36_4f31_8a44_8baaa86e3805((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_dd523764_6f36_4f31_8a44_8baaa86e3805: (
    inputs: log_events_dd523764_6f36_4f31_8a44_8baaa86e3805ChildInputs<["log_events_dd523764_6f36_4f31_8a44_8baaa86e3805"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9`.
   * @example With static inputs:
   * ```ts
   * snaplet.log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9((x) => x(3));
   * snaplet.log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9((x) => [{}, ...x(3), {}]);
   * ```
   */
  log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9: (
    inputs: log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildInputs<["log_events_e653981f_d1bc_42ce_b15e_dc8fe56834a9"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_amr_claims`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_amr_claims([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_amr_claims((x) => x(3));
   * snaplet.mfa_amr_claims((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_amr_claims((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_amr_claims: (
    inputs: mfa_amr_claimsChildInputs<["mfa_amr_claims"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_challenges`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_challenges([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_challenges((x) => x(3));
   * snaplet.mfa_challenges((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_challenges((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_challenges: (
    inputs: mfa_challengesChildInputs<["mfa_challenges"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_factors`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_factors([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_factors((x) => x(3));
   * snaplet.mfa_factors((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_factors((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_factors: (
    inputs: mfa_factorsChildInputs<["mfa_factors"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `storage_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.storage_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.storage_migrations((x) => x(3));
   * snaplet.storage_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.storage_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  storage_migrations: (
    inputs: storage_migrationsChildInputs<["storage_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `supabase_functions_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.supabase_functions_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.supabase_functions_migrations((x) => x(3));
   * snaplet.supabase_functions_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.supabase_functions_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  supabase_functions_migrations: (
    inputs: supabase_functions_migrationsChildInputs<["supabase_functions_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `notifications`.
   * @example With static inputs:
   * ```ts
   * snaplet.notifications([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.notifications((x) => x(3));
   * snaplet.notifications((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.notifications((x) => [{}, ...x(3), {}]);
   * ```
   */
  notifications: (
    inputs: notificationsChildInputs<["notifications"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `objects`.
   * @example With static inputs:
   * ```ts
   * snaplet.objects([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.objects((x) => x(3));
   * snaplet.objects((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.objects((x) => [{}, ...x(3), {}]);
   * ```
   */
  objects: (
    inputs: objectsChildInputs<["objects"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `onboarding_steps`.
   * @example With static inputs:
   * ```ts
   * snaplet.onboarding_steps([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.onboarding_steps((x) => x(3));
   * snaplet.onboarding_steps((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.onboarding_steps((x) => [{}, ...x(3), {}]);
   * ```
   */
  onboarding_steps: (
    inputs: onboarding_stepsChildInputs<["onboarding_steps"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `packs`.
   * @example With static inputs:
   * ```ts
   * snaplet.packs([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.packs((x) => x(3));
   * snaplet.packs((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.packs((x) => [{}, ...x(3), {}]);
   * ```
   */
  packs: (
    inputs: packsChildInputs<["packs"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `polls`.
   * @example With static inputs:
   * ```ts
   * snaplet.polls([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.polls((x) => x(3));
   * snaplet.polls((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.polls((x) => [{}, ...x(3), {}]);
   * ```
   */
  polls: (
    inputs: pollsChildInputs<["polls"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `prices`.
   * @example With static inputs:
   * ```ts
   * snaplet.prices([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.prices((x) => x(3));
   * snaplet.prices((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.prices((x) => [{}, ...x(3), {}]);
   * ```
   */
  prices: (
    inputs: pricesChildInputs<["prices"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `products`.
   * @example With static inputs:
   * ```ts
   * snaplet.products([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.products((x) => x(3));
   * snaplet.products((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.products((x) => [{}, ...x(3), {}]);
   * ```
   */
  products: (
    inputs: productsChildInputs<["products"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `questions`.
   * @example With static inputs:
   * ```ts
   * snaplet.questions([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.questions((x) => x(3));
   * snaplet.questions((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.questions((x) => [{}, ...x(3), {}]);
   * ```
   */
  questions: (
    inputs: questionsChildInputs<["questions"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `refresh_tokens`.
   * @example With static inputs:
   * ```ts
   * snaplet.refresh_tokens([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.refresh_tokens((x) => x(3));
   * snaplet.refresh_tokens((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.refresh_tokens((x) => [{}, ...x(3), {}]);
   * ```
   */
  refresh_tokens: (
    inputs: refresh_tokensChildInputs<["refresh_tokens"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `replies`.
   * @example With static inputs:
   * ```ts
   * snaplet.replies([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.replies((x) => x(3));
   * snaplet.replies((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.replies((x) => [{}, ...x(3), {}]);
   * ```
   */
  replies: (
    inputs: repliesChildInputs<["replies"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `saml_providers`.
   * @example With static inputs:
   * ```ts
   * snaplet.saml_providers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.saml_providers((x) => x(3));
   * snaplet.saml_providers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.saml_providers((x) => [{}, ...x(3), {}]);
   * ```
   */
  saml_providers: (
    inputs: saml_providersChildInputs<["saml_providers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `saml_relay_states`.
   * @example With static inputs:
   * ```ts
   * snaplet.saml_relay_states([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.saml_relay_states((x) => x(3));
   * snaplet.saml_relay_states((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.saml_relay_states((x) => [{}, ...x(3), {}]);
   * ```
   */
  saml_relay_states: (
    inputs: saml_relay_statesChildInputs<["saml_relay_states"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `auth_schema_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.auth_schema_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.auth_schema_migrations((x) => x(3));
   * snaplet.auth_schema_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.auth_schema_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  auth_schema_migrations: (
    inputs: auth_schema_migrationsChildInputs<["auth_schema_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `supabase_migrations_schema_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.supabase_migrations_schema_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.supabase_migrations_schema_migrations((x) => x(3));
   * snaplet.supabase_migrations_schema_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.supabase_migrations_schema_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  supabase_migrations_schema_migrations: (
    inputs: supabase_migrations_schema_migrationsChildInputs<["supabase_migrations_schema_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91((x) => x(3));
   * snaplet.schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91: (
    inputs: schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91ChildInputs<["schema_migrations_01d9690e_cd0a_4e98_a2d9_d01a09489c91"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e((x) => x(3));
   * snaplet.schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e: (
    inputs: schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81eChildInputs<["schema_migrations_6942dc85_c452_4072_99e1_813ff24aa81e"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700((x) => x(3));
   * snaplet.schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700: (
    inputs: schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700ChildInputs<["schema_migrations_73a4c865_0ffb_4641_b8d9_c923382bb700"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec((x) => x(3));
   * snaplet.schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec: (
    inputs: schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cecChildInputs<["schema_migrations_86b5e621_0d3f_4f69_baf0_f3ef740a4cec"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55((x) => x(3));
   * snaplet.schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55: (
    inputs: schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55ChildInputs<["schema_migrations_aee2b53e_4d7c_4706_b84d_2ee1c8d3ea55"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7((x) => x(3));
   * snaplet.schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7: (
    inputs: schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7ChildInputs<["schema_migrations_b250c80e_d3d6_4fa4_a086_eba6cc9861b7"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de((x) => x(3));
   * snaplet.schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de: (
    inputs: schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6deChildInputs<["schema_migrations_c714c694_d63c_4d4e_aa95_42e76c05b6de"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805((x) => x(3));
   * snaplet.schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805: (
    inputs: schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805ChildInputs<["schema_migrations_dd523764_6f36_4f31_8a44_8baaa86e3805"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9`.
   * @example With static inputs:
   * ```ts
   * snaplet.schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9((x) => x(3));
   * snaplet.schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9((x) => [{}, ...x(3), {}]);
   * ```
   */
  schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9: (
    inputs: schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9ChildInputs<["schema_migrations_e653981f_d1bc_42ce_b15e_dc8fe56834a9"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `secrets`.
   * @example With static inputs:
   * ```ts
   * snaplet.secrets([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.secrets((x) => x(3));
   * snaplet.secrets((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.secrets((x) => [{}, ...x(3), {}]);
   * ```
   */
  secrets: (
    inputs: secretsChildInputs<["secrets"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sessions`.
   * @example With static inputs:
   * ```ts
   * snaplet.sessions([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sessions((x) => x(3));
   * snaplet.sessions((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sessions((x) => [{}, ...x(3), {}]);
   * ```
   */
  sessions: (
    inputs: sessionsChildInputs<["sessions"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `shopping_list_items`.
   * @example With static inputs:
   * ```ts
   * snaplet.shopping_list_items([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.shopping_list_items((x) => x(3));
   * snaplet.shopping_list_items((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.shopping_list_items((x) => [{}, ...x(3), {}]);
   * ```
   */
  shopping_list_items: (
    inputs: shopping_list_itemsChildInputs<["shopping_list_items"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sso_domains`.
   * @example With static inputs:
   * ```ts
   * snaplet.sso_domains([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sso_domains((x) => x(3));
   * snaplet.sso_domains((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sso_domains((x) => [{}, ...x(3), {}]);
   * ```
   */
  sso_domains: (
    inputs: sso_domainsChildInputs<["sso_domains"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sso_providers`.
   * @example With static inputs:
   * ```ts
   * snaplet.sso_providers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sso_providers((x) => x(3));
   * snaplet.sso_providers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sso_providers((x) => [{}, ...x(3), {}]);
   * ```
   */
  sso_providers: (
    inputs: sso_providersChildInputs<["sso_providers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `subscriptions`.
   * @example With static inputs:
   * ```ts
   * snaplet.subscriptions([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.subscriptions((x) => x(3));
   * snaplet.subscriptions((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.subscriptions((x) => [{}, ...x(3), {}]);
   * ```
   */
  subscriptions: (
    inputs: subscriptionsChildInputs<["subscriptions"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `todos`.
   * @example With static inputs:
   * ```ts
   * snaplet.todos([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.todos((x) => x(3));
   * snaplet.todos((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.todos((x) => [{}, ...x(3), {}]);
   * ```
   */
  todos: (
    inputs: todosChildInputs<["todos"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `trip_details`.
   * @example With static inputs:
   * ```ts
   * snaplet.trip_details([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.trip_details((x) => x(3));
   * snaplet.trip_details((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.trip_details((x) => [{}, ...x(3), {}]);
   * ```
   */
  trip_details: (
    inputs: trip_detailsChildInputs<["trip_details"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `trip_friends`.
   * @example With static inputs:
   * ```ts
   * snaplet.trip_friends([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.trip_friends((x) => x(3));
   * snaplet.trip_friends((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.trip_friends((x) => [{}, ...x(3), {}]);
   * ```
   */
  trip_friends: (
    inputs: trip_friendsChildInputs<["trip_friends"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `trip_packs`.
   * @example With static inputs:
   * ```ts
   * snaplet.trip_packs([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.trip_packs((x) => x(3));
   * snaplet.trip_packs((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.trip_packs((x) => [{}, ...x(3), {}]);
   * ```
   */
  trip_packs: (
    inputs: trip_packsChildInputs<["trip_packs"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `trips`.
   * @example With static inputs:
   * ```ts
   * snaplet.trips([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.trips((x) => x(3));
   * snaplet.trips((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.trips((x) => [{}, ...x(3), {}]);
   * ```
   */
  trips: (
    inputs: tripsChildInputs<["trips"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `user_answers`.
   * @example With static inputs:
   * ```ts
   * snaplet.user_answers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.user_answers((x) => x(3));
   * snaplet.user_answers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.user_answers((x) => [{}, ...x(3), {}]);
   * ```
   */
  user_answers: (
    inputs: user_answersChildInputs<["user_answers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `auth_users`.
   * @example With static inputs:
   * ```ts
   * snaplet.auth_users([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.auth_users((x) => x(3));
   * snaplet.auth_users((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.auth_users((x) => [{}, ...x(3), {}]);
   * ```
   */
  auth_users: (
    inputs: auth_usersChildInputs<["auth_users"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `public_users`.
   * @example With static inputs:
   * ```ts
   * snaplet.public_users([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.public_users((x) => x(3));
   * snaplet.public_users((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.public_users((x) => [{}, ...x(3), {}]);
   * ```
   */
  public_users: (
    inputs: public_usersChildInputs<["public_users"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Compose multiple plans together, injecting the store of the previous plan into the next plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-pipe | documentation}.
   */
  $pipe: Pipe;
  /**
   * Compose multiple plans together, without injecting the store of the previous plan into the next plan.
   * All stores stay independent and are merged together once all the plans are generated.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-merge | documentation}.
   */
  $merge: Merge;
  /**
   * Create a store instance.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#augmenting-external-data-with-createstore | documentation}.
   */
  $createStore: CreateStore;
};

export type SnapletClientBaseOptions = {
  userModels?: UserModels
}


type PgClient = {
  query(string): Promise<unknown>
}

export declare class SnapletClient extends SnapletClientBase {
  constructor(pgClient: PgClient, options?: SnapletClientBaseOptions)
}