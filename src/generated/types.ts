import type { GraphQLClient } from 'graphql-request';
import type { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { gql } from 'graphql-request';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigFloat: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Opaque: { input: any; output: any; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: InputMaybe<Scalars['BigFloat']['input']>;
  gt?: InputMaybe<Scalars['BigFloat']['input']>;
  gte?: InputMaybe<Scalars['BigFloat']['input']>;
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigFloat']['input']>;
  lte?: InputMaybe<Scalars['BigFloat']['input']>;
  neq?: InputMaybe<Scalars['BigFloat']['input']>;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  neq?: InputMaybe<Scalars['BigInt']['input']>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  neq?: InputMaybe<Scalars['Date']['input']>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars['Datetime']['input']>;
  gt?: InputMaybe<Scalars['Datetime']['input']>;
  gte?: InputMaybe<Scalars['Datetime']['input']>;
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Datetime']['input']>;
  lte?: InputMaybe<Scalars['Datetime']['input']>;
  neq?: InputMaybe<Scalars['Datetime']['input']>;
};

export enum FilterIs {
  NotNull = 'NOT_NULL',
  Null = 'NULL'
}

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
};

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: InputMaybe<Scalars['ID']['input']>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deletes zero or more records from the `answers` collection */
  deleteFromanswersCollection: AnswersDeleteResponse;
  /** Deletes zero or more records from the `categories` collection */
  deleteFromcategoriesCollection: CategoriesDeleteResponse;
  /** Deletes zero or more records from the `category_items` collection */
  deleteFromcategory_itemsCollection: Category_ItemsDeleteResponse;
  /** Deletes zero or more records from the `comments` collection */
  deleteFromcommentsCollection: CommentsDeleteResponse;
  /** Deletes zero or more records from the `customers` collection */
  deleteFromcustomersCollection: CustomersDeleteResponse;
  /** Deletes zero or more records from the `friends` collection */
  deleteFromfriendsCollection: FriendsDeleteResponse;
  /** Deletes zero or more records from the `items` collection */
  deleteFromitemsCollection: ItemsDeleteResponse;
  /** Deletes zero or more records from the `notifications` collection */
  deleteFromnotificationsCollection: NotificationsDeleteResponse;
  /** Deletes zero or more records from the `onboarding_steps` collection */
  deleteFromonboarding_stepsCollection: Onboarding_StepsDeleteResponse;
  /** Deletes zero or more records from the `packs` collection */
  deleteFrompacksCollection: PacksDeleteResponse;
  /** Deletes zero or more records from the `polls` collection */
  deleteFrompollsCollection: PollsDeleteResponse;
  /** Deletes zero or more records from the `prices` collection */
  deleteFrompricesCollection: PricesDeleteResponse;
  /** Deletes zero or more records from the `products` collection */
  deleteFromproductsCollection: ProductsDeleteResponse;
  /** Deletes zero or more records from the `questions` collection */
  deleteFromquestionsCollection: QuestionsDeleteResponse;
  /** Deletes zero or more records from the `replies` collection */
  deleteFromrepliesCollection: RepliesDeleteResponse;
  /** Deletes zero or more records from the `shopping_list_items` collection */
  deleteFromshopping_list_itemsCollection: Shopping_List_ItemsDeleteResponse;
  /** Deletes zero or more records from the `subscriptions` collection */
  deleteFromsubscriptionsCollection: SubscriptionsDeleteResponse;
  /** Deletes zero or more records from the `todos` collection */
  deleteFromtodosCollection: TodosDeleteResponse;
  /** Deletes zero or more records from the `trip_details` collection */
  deleteFromtrip_detailsCollection: Trip_DetailsDeleteResponse;
  /** Deletes zero or more records from the `trip_friends` collection */
  deleteFromtrip_friendsCollection: Trip_FriendsDeleteResponse;
  /** Deletes zero or more records from the `trip_packs` collection */
  deleteFromtrip_packsCollection: Trip_PacksDeleteResponse;
  /** Deletes zero or more records from the `trips` collection */
  deleteFromtripsCollection: TripsDeleteResponse;
  /** Deletes zero or more records from the `user_answers` collection */
  deleteFromuser_answersCollection: User_AnswersDeleteResponse;
  /** Deletes zero or more records from the `users` collection */
  deleteFromusersCollection: UsersDeleteResponse;
  /** Adds one or more `answers` records to the collection */
  insertIntoanswersCollection?: Maybe<AnswersInsertResponse>;
  /** Adds one or more `categories` records to the collection */
  insertIntocategoriesCollection?: Maybe<CategoriesInsertResponse>;
  /** Adds one or more `category_items` records to the collection */
  insertIntocategory_itemsCollection?: Maybe<Category_ItemsInsertResponse>;
  /** Adds one or more `comments` records to the collection */
  insertIntocommentsCollection?: Maybe<CommentsInsertResponse>;
  /** Adds one or more `customers` records to the collection */
  insertIntocustomersCollection?: Maybe<CustomersInsertResponse>;
  /** Adds one or more `friends` records to the collection */
  insertIntofriendsCollection?: Maybe<FriendsInsertResponse>;
  /** Adds one or more `items` records to the collection */
  insertIntoitemsCollection?: Maybe<ItemsInsertResponse>;
  /** Adds one or more `notifications` records to the collection */
  insertIntonotificationsCollection?: Maybe<NotificationsInsertResponse>;
  /** Adds one or more `onboarding_steps` records to the collection */
  insertIntoonboarding_stepsCollection?: Maybe<Onboarding_StepsInsertResponse>;
  /** Adds one or more `packs` records to the collection */
  insertIntopacksCollection?: Maybe<PacksInsertResponse>;
  /** Adds one or more `polls` records to the collection */
  insertIntopollsCollection?: Maybe<PollsInsertResponse>;
  /** Adds one or more `prices` records to the collection */
  insertIntopricesCollection?: Maybe<PricesInsertResponse>;
  /** Adds one or more `products` records to the collection */
  insertIntoproductsCollection?: Maybe<ProductsInsertResponse>;
  /** Adds one or more `questions` records to the collection */
  insertIntoquestionsCollection?: Maybe<QuestionsInsertResponse>;
  /** Adds one or more `replies` records to the collection */
  insertIntorepliesCollection?: Maybe<RepliesInsertResponse>;
  /** Adds one or more `shopping_list_items` records to the collection */
  insertIntoshopping_list_itemsCollection?: Maybe<Shopping_List_ItemsInsertResponse>;
  /** Adds one or more `subscriptions` records to the collection */
  insertIntosubscriptionsCollection?: Maybe<SubscriptionsInsertResponse>;
  /** Adds one or more `todos` records to the collection */
  insertIntotodosCollection?: Maybe<TodosInsertResponse>;
  /** Adds one or more `trip_details` records to the collection */
  insertIntotrip_detailsCollection?: Maybe<Trip_DetailsInsertResponse>;
  /** Adds one or more `trip_friends` records to the collection */
  insertIntotrip_friendsCollection?: Maybe<Trip_FriendsInsertResponse>;
  /** Adds one or more `trip_packs` records to the collection */
  insertIntotrip_packsCollection?: Maybe<Trip_PacksInsertResponse>;
  /** Adds one or more `trips` records to the collection */
  insertIntotripsCollection?: Maybe<TripsInsertResponse>;
  /** Adds one or more `user_answers` records to the collection */
  insertIntouser_answersCollection?: Maybe<User_AnswersInsertResponse>;
  /** Adds one or more `users` records to the collection */
  insertIntousersCollection?: Maybe<UsersInsertResponse>;
  /** Updates zero or more records in the `answers` collection */
  updateanswersCollection: AnswersUpdateResponse;
  /** Updates zero or more records in the `categories` collection */
  updatecategoriesCollection: CategoriesUpdateResponse;
  /** Updates zero or more records in the `category_items` collection */
  updatecategory_itemsCollection: Category_ItemsUpdateResponse;
  /** Updates zero or more records in the `comments` collection */
  updatecommentsCollection: CommentsUpdateResponse;
  /** Updates zero or more records in the `customers` collection */
  updatecustomersCollection: CustomersUpdateResponse;
  /** Updates zero or more records in the `friends` collection */
  updatefriendsCollection: FriendsUpdateResponse;
  /** Updates zero or more records in the `items` collection */
  updateitemsCollection: ItemsUpdateResponse;
  /** Updates zero or more records in the `notifications` collection */
  updatenotificationsCollection: NotificationsUpdateResponse;
  /** Updates zero or more records in the `onboarding_steps` collection */
  updateonboarding_stepsCollection: Onboarding_StepsUpdateResponse;
  /** Updates zero or more records in the `packs` collection */
  updatepacksCollection: PacksUpdateResponse;
  /** Updates zero or more records in the `polls` collection */
  updatepollsCollection: PollsUpdateResponse;
  /** Updates zero or more records in the `prices` collection */
  updatepricesCollection: PricesUpdateResponse;
  /** Updates zero or more records in the `products` collection */
  updateproductsCollection: ProductsUpdateResponse;
  /** Updates zero or more records in the `questions` collection */
  updatequestionsCollection: QuestionsUpdateResponse;
  /** Updates zero or more records in the `replies` collection */
  updaterepliesCollection: RepliesUpdateResponse;
  /** Updates zero or more records in the `shopping_list_items` collection */
  updateshopping_list_itemsCollection: Shopping_List_ItemsUpdateResponse;
  /** Updates zero or more records in the `subscriptions` collection */
  updatesubscriptionsCollection: SubscriptionsUpdateResponse;
  /** Updates zero or more records in the `todos` collection */
  updatetodosCollection: TodosUpdateResponse;
  /** Updates zero or more records in the `trip_details` collection */
  updatetrip_detailsCollection: Trip_DetailsUpdateResponse;
  /** Updates zero or more records in the `trip_friends` collection */
  updatetrip_friendsCollection: Trip_FriendsUpdateResponse;
  /** Updates zero or more records in the `trip_packs` collection */
  updatetrip_packsCollection: Trip_PacksUpdateResponse;
  /** Updates zero or more records in the `trips` collection */
  updatetripsCollection: TripsUpdateResponse;
  /** Updates zero or more records in the `user_answers` collection */
  updateuser_answersCollection: User_AnswersUpdateResponse;
  /** Updates zero or more records in the `users` collection */
  updateusersCollection: UsersUpdateResponse;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromanswersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<AnswersFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromcategoriesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CategoriesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromcategory_ItemsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Category_ItemsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromcommentsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CommentsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromcustomersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CustomersFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromfriendsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<FriendsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromitemsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ItemsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromnotificationsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<NotificationsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromonboarding_StepsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Onboarding_StepsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrompacksCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PacksFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrompollsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PollsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrompricesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PricesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromproductsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ProductsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromquestionsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<QuestionsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromrepliesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<RepliesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromshopping_List_ItemsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Shopping_List_ItemsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromsubscriptionsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<SubscriptionsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromtodosCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<TodosFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromtrip_DetailsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Trip_DetailsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromtrip_FriendsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Trip_FriendsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromtrip_PacksCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Trip_PacksFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromtripsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<TripsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromuser_AnswersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<User_AnswersFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromusersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<UsersFilter>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoanswersCollectionArgs = {
  objects: Array<AnswersInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntocategoriesCollectionArgs = {
  objects: Array<CategoriesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntocategory_ItemsCollectionArgs = {
  objects: Array<Category_ItemsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntocommentsCollectionArgs = {
  objects: Array<CommentsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntocustomersCollectionArgs = {
  objects: Array<CustomersInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntofriendsCollectionArgs = {
  objects: Array<FriendsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoitemsCollectionArgs = {
  objects: Array<ItemsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntonotificationsCollectionArgs = {
  objects: Array<NotificationsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoonboarding_StepsCollectionArgs = {
  objects: Array<Onboarding_StepsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntopacksCollectionArgs = {
  objects: Array<PacksInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntopollsCollectionArgs = {
  objects: Array<PollsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntopricesCollectionArgs = {
  objects: Array<PricesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoproductsCollectionArgs = {
  objects: Array<ProductsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoquestionsCollectionArgs = {
  objects: Array<QuestionsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntorepliesCollectionArgs = {
  objects: Array<RepliesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoshopping_List_ItemsCollectionArgs = {
  objects: Array<Shopping_List_ItemsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntosubscriptionsCollectionArgs = {
  objects: Array<SubscriptionsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntotodosCollectionArgs = {
  objects: Array<TodosInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntotrip_DetailsCollectionArgs = {
  objects: Array<Trip_DetailsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntotrip_FriendsCollectionArgs = {
  objects: Array<Trip_FriendsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntotrip_PacksCollectionArgs = {
  objects: Array<Trip_PacksInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntotripsCollectionArgs = {
  objects: Array<TripsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntouser_AnswersCollectionArgs = {
  objects: Array<User_AnswersInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntousersCollectionArgs = {
  objects: Array<UsersInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationUpdateanswersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<AnswersFilter>;
  set: AnswersUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatecategoriesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CategoriesFilter>;
  set: CategoriesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatecategory_ItemsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Category_ItemsFilter>;
  set: Category_ItemsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatecommentsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CommentsFilter>;
  set: CommentsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatecustomersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CustomersFilter>;
  set: CustomersUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatefriendsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<FriendsFilter>;
  set: FriendsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateitemsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ItemsFilter>;
  set: ItemsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatenotificationsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<NotificationsFilter>;
  set: NotificationsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateonboarding_StepsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Onboarding_StepsFilter>;
  set: Onboarding_StepsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatepacksCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PacksFilter>;
  set: PacksUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatepollsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PollsFilter>;
  set: PollsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatepricesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PricesFilter>;
  set: PricesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateproductsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ProductsFilter>;
  set: ProductsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatequestionsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<QuestionsFilter>;
  set: QuestionsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdaterepliesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<RepliesFilter>;
  set: RepliesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateshopping_List_ItemsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Shopping_List_ItemsFilter>;
  set: Shopping_List_ItemsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatesubscriptionsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<SubscriptionsFilter>;
  set: SubscriptionsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatetodosCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<TodosFilter>;
  set: TodosUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatetrip_DetailsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Trip_DetailsFilter>;
  set: Trip_DetailsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatetrip_FriendsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Trip_FriendsFilter>;
  set: Trip_FriendsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatetrip_PacksCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Trip_PacksFilter>;
  set: Trip_PacksUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatetripsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<TripsFilter>;
  set: TripsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateuser_AnswersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<User_AnswersFilter>;
  set: User_AnswersUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateusersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<UsersFilter>;
  set: UsersUpdateInput;
};

export type Node = {
  /** Retrieves a record by `ID` */
  nodeId: Scalars['ID']['output'];
};

/** Boolean expression comparing fields on type "Opaque" */
export type OpaqueFilter = {
  eq?: InputMaybe<Scalars['Opaque']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  /** Ascending order, nulls first */
  AscNullsFirst = 'AscNullsFirst',
  /** Ascending order, nulls last */
  AscNullsLast = 'AscNullsLast',
  /** Descending order, nulls first */
  DescNullsFirst = 'DescNullsFirst',
  /** Descending order, nulls last */
  DescNullsLast = 'DescNullsLast'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** The root type for querying data */
export type Query = {
  __typename?: 'Query';
  /** A pagable collection of type `answers` */
  answersCollection?: Maybe<AnswersConnection>;
  /** A pagable collection of type `categories` */
  categoriesCollection?: Maybe<CategoriesConnection>;
  /** A pagable collection of type `category_items` */
  category_itemsCollection?: Maybe<Category_ItemsConnection>;
  /** A pagable collection of type `comments` */
  commentsCollection?: Maybe<CommentsConnection>;
  /** A pagable collection of type `customers` */
  customersCollection?: Maybe<CustomersConnection>;
  /** A pagable collection of type `friends` */
  friendsCollection?: Maybe<FriendsConnection>;
  /** A pagable collection of type `items` */
  itemsCollection?: Maybe<ItemsConnection>;
  /** Retrieve a record by its `ID` */
  node?: Maybe<Node>;
  /** A pagable collection of type `notifications` */
  notificationsCollection?: Maybe<NotificationsConnection>;
  /** A pagable collection of type `onboarding_steps` */
  onboarding_stepsCollection?: Maybe<Onboarding_StepsConnection>;
  /** A pagable collection of type `packs` */
  packsCollection?: Maybe<PacksConnection>;
  /** A pagable collection of type `polls` */
  pollsCollection?: Maybe<PollsConnection>;
  /** A pagable collection of type `prices` */
  pricesCollection?: Maybe<PricesConnection>;
  /** A pagable collection of type `products` */
  productsCollection?: Maybe<ProductsConnection>;
  /** A pagable collection of type `questions` */
  questionsCollection?: Maybe<QuestionsConnection>;
  /** A pagable collection of type `replies` */
  repliesCollection?: Maybe<RepliesConnection>;
  /** A pagable collection of type `shopping_list_items` */
  shopping_list_itemsCollection?: Maybe<Shopping_List_ItemsConnection>;
  /** A pagable collection of type `subscriptions` */
  subscriptionsCollection?: Maybe<SubscriptionsConnection>;
  /** A pagable collection of type `todos` */
  todosCollection?: Maybe<TodosConnection>;
  /** A pagable collection of type `trip_details` */
  trip_detailsCollection?: Maybe<Trip_DetailsConnection>;
  /** A pagable collection of type `trip_friends` */
  trip_friendsCollection?: Maybe<Trip_FriendsConnection>;
  /** A pagable collection of type `trip_packs` */
  trip_packsCollection?: Maybe<Trip_PacksConnection>;
  /** A pagable collection of type `trips` */
  tripsCollection?: Maybe<TripsConnection>;
  /** A pagable collection of type `user_answers` */
  user_answersCollection?: Maybe<User_AnswersConnection>;
  /** A pagable collection of type `users` */
  usersCollection?: Maybe<UsersConnection>;
};


/** The root type for querying data */
export type QueryAnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnswersOrderBy>>;
};


/** The root type for querying data */
export type QueryCategoriesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CategoriesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CategoriesOrderBy>>;
};


/** The root type for querying data */
export type QueryCategory_ItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Category_ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Category_ItemsOrderBy>>;
};


/** The root type for querying data */
export type QueryCommentsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CommentsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};


/** The root type for querying data */
export type QueryCustomersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CustomersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CustomersOrderBy>>;
};


/** The root type for querying data */
export type QueryFriendsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<FriendsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FriendsOrderBy>>;
};


/** The root type for querying data */
export type QueryItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ItemsOrderBy>>;
};


/** The root type for querying data */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root type for querying data */
export type QueryNotificationsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<NotificationsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};


/** The root type for querying data */
export type QueryOnboarding_StepsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Onboarding_StepsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Onboarding_StepsOrderBy>>;
};


/** The root type for querying data */
export type QueryPacksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PacksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PacksOrderBy>>;
};


/** The root type for querying data */
export type QueryPollsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PollsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PollsOrderBy>>;
};


/** The root type for querying data */
export type QueryPricesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PricesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PricesOrderBy>>;
};


/** The root type for querying data */
export type QueryProductsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ProductsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProductsOrderBy>>;
};


/** The root type for querying data */
export type QueryQuestionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<QuestionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuestionsOrderBy>>;
};


/** The root type for querying data */
export type QueryRepliesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<RepliesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RepliesOrderBy>>;
};


/** The root type for querying data */
export type QueryShopping_List_ItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Shopping_List_ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Shopping_List_ItemsOrderBy>>;
};


/** The root type for querying data */
export type QuerySubscriptionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<SubscriptionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SubscriptionsOrderBy>>;
};


/** The root type for querying data */
export type QueryTodosCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<TodosFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};


/** The root type for querying data */
export type QueryTrip_DetailsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_DetailsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_DetailsOrderBy>>;
};


/** The root type for querying data */
export type QueryTrip_FriendsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_FriendsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_FriendsOrderBy>>;
};


/** The root type for querying data */
export type QueryTrip_PacksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_PacksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_PacksOrderBy>>;
};


/** The root type for querying data */
export type QueryTripsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<TripsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripsOrderBy>>;
};


/** The root type for querying data */
export type QueryUser_AnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_AnswersOrderBy>>;
};


/** The root type for querying data */
export type QueryUsersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<UsersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  iregex?: InputMaybe<Scalars['String']['input']>;
  is?: InputMaybe<FilterIs>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  gte?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  lte?: InputMaybe<Scalars['Time']['input']>;
  neq?: InputMaybe<Scalars['Time']['input']>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
};

export type Answers = Node & {
  __typename?: 'answers';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  question_id?: Maybe<Scalars['BigInt']['output']>;
  questions?: Maybe<Questions>;
  updated_at: Scalars['Datetime']['output'];
  user_answersCollection?: Maybe<User_AnswersConnection>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};


export type AnswersUser_AnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_AnswersOrderBy>>;
};

export type AnswersConnection = {
  __typename?: 'answersConnection';
  edges: Array<AnswersEdge>;
  pageInfo: PageInfo;
};

export type AnswersDeleteResponse = {
  __typename?: 'answersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Answers>;
};

export type AnswersEdge = {
  __typename?: 'answersEdge';
  cursor: Scalars['String']['output'];
  node: Answers;
};

export type AnswersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<AnswersFilter>>;
  content?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<AnswersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<AnswersFilter>>;
  question_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type AnswersInsertInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  question_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type AnswersInsertResponse = {
  __typename?: 'answersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Answers>;
};

export type AnswersOrderBy = {
  content?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  question_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type AnswersUpdateInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  question_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type AnswersUpdateResponse = {
  __typename?: 'answersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Answers>;
};

export type Categories = Node & {
  __typename?: 'categories';
  category_itemsCollection?: Maybe<Category_ItemsConnection>;
  created_at: Scalars['Datetime']['output'];
  id: Scalars['BigInt']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pack_id?: Maybe<Scalars['BigInt']['output']>;
  packs?: Maybe<Packs>;
  slug: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Datetime']['output'];
};


export type CategoriesCategory_ItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Category_ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Category_ItemsOrderBy>>;
};

export type CategoriesConnection = {
  __typename?: 'categoriesConnection';
  edges: Array<CategoriesEdge>;
  pageInfo: PageInfo;
};

export type CategoriesDeleteResponse = {
  __typename?: 'categoriesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type CategoriesEdge = {
  __typename?: 'categoriesEdge';
  cursor: Scalars['String']['output'];
  node: Categories;
};

export type CategoriesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CategoriesFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CategoriesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CategoriesFilter>>;
  pack_id?: InputMaybe<BigIntFilter>;
  slug?: InputMaybe<StringFilter>;
  unit?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type CategoriesInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pack_id?: InputMaybe<Scalars['BigInt']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type CategoriesInsertResponse = {
  __typename?: 'categoriesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type CategoriesOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  pack_id?: InputMaybe<OrderByDirection>;
  slug?: InputMaybe<OrderByDirection>;
  unit?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type CategoriesUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pack_id?: InputMaybe<Scalars['BigInt']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type CategoriesUpdateResponse = {
  __typename?: 'categoriesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type Category_Items = Node & {
  __typename?: 'category_items';
  categories?: Maybe<Categories>;
  category_id?: Maybe<Scalars['BigInt']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  item_id?: Maybe<Scalars['BigInt']['output']>;
  items?: Maybe<Items>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  position?: Maybe<Scalars['BigInt']['output']>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
};

export type Category_ItemsConnection = {
  __typename?: 'category_itemsConnection';
  edges: Array<Category_ItemsEdge>;
  pageInfo: PageInfo;
};

export type Category_ItemsDeleteResponse = {
  __typename?: 'category_itemsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Category_Items>;
};

export type Category_ItemsEdge = {
  __typename?: 'category_itemsEdge';
  cursor: Scalars['String']['output'];
  node: Category_Items;
};

export type Category_ItemsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Category_ItemsFilter>>;
  category_id?: InputMaybe<BigIntFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  item_id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Category_ItemsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Category_ItemsFilter>>;
  position?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type Category_ItemsInsertInput = {
  category_id?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  item_id?: InputMaybe<Scalars['BigInt']['input']>;
  position?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Category_ItemsInsertResponse = {
  __typename?: 'category_itemsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Category_Items>;
};

export type Category_ItemsOrderBy = {
  category_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  item_id?: InputMaybe<OrderByDirection>;
  position?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type Category_ItemsUpdateInput = {
  category_id?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  item_id?: InputMaybe<Scalars['BigInt']['input']>;
  position?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Category_ItemsUpdateResponse = {
  __typename?: 'category_itemsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Category_Items>;
};

export type Comments = Node & {
  __typename?: 'comments';
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pack_id: Scalars['BigInt']['output'];
  packs: Packs;
  repliesCollection?: Maybe<RepliesConnection>;
  text?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id: Scalars['UUID']['output'];
  users: Users;
};


export type CommentsRepliesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<RepliesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RepliesOrderBy>>;
};

export type CommentsConnection = {
  __typename?: 'commentsConnection';
  edges: Array<CommentsEdge>;
  pageInfo: PageInfo;
};

export type CommentsDeleteResponse = {
  __typename?: 'commentsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Comments>;
};

export type CommentsEdge = {
  __typename?: 'commentsEdge';
  cursor: Scalars['String']['output'];
  node: Comments;
};

export type CommentsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CommentsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CommentsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CommentsFilter>>;
  pack_id?: InputMaybe<BigIntFilter>;
  text?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type CommentsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  pack_id?: InputMaybe<Scalars['BigInt']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type CommentsInsertResponse = {
  __typename?: 'commentsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Comments>;
};

export type CommentsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  pack_id?: InputMaybe<OrderByDirection>;
  text?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type CommentsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  pack_id?: InputMaybe<Scalars['BigInt']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type CommentsUpdateResponse = {
  __typename?: 'commentsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Comments>;
};

export type Customers = Node & {
  __typename?: 'customers';
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['UUID']['output'];
  users: Users;
};

export type CustomersConnection = {
  __typename?: 'customersConnection';
  edges: Array<CustomersEdge>;
  pageInfo: PageInfo;
};

export type CustomersDeleteResponse = {
  __typename?: 'customersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Customers>;
};

export type CustomersEdge = {
  __typename?: 'customersEdge';
  cursor: Scalars['String']['output'];
  node: Customers;
};

export type CustomersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CustomersFilter>>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CustomersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CustomersFilter>>;
  stripe_customer_id?: InputMaybe<StringFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type CustomersInsertInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type CustomersInsertResponse = {
  __typename?: 'customersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Customers>;
};

export type CustomersOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  stripe_customer_id?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type CustomersUpdateInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type CustomersUpdateResponse = {
  __typename?: 'customersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Customers>;
};

export type Friends = Node & {
  __typename?: 'friends';
  created_at?: Maybe<Scalars['Datetime']['output']>;
  friend_id?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['BigInt']['output'];
  invite_accepted_on?: Maybe<Scalars['Datetime']['output']>;
  invite_sent_on?: Maybe<Scalars['Datetime']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type FriendsConnection = {
  __typename?: 'friendsConnection';
  edges: Array<FriendsEdge>;
  pageInfo: PageInfo;
};

export type FriendsDeleteResponse = {
  __typename?: 'friendsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Friends>;
};

export type FriendsEdge = {
  __typename?: 'friendsEdge';
  cursor: Scalars['String']['output'];
  node: Friends;
};

export type FriendsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<FriendsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  friend_id?: InputMaybe<UuidFilter>;
  id?: InputMaybe<BigIntFilter>;
  invite_accepted_on?: InputMaybe<DatetimeFilter>;
  invite_sent_on?: InputMaybe<DatetimeFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<FriendsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<FriendsFilter>>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type FriendsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  friend_id?: InputMaybe<Scalars['UUID']['input']>;
  invite_accepted_on?: InputMaybe<Scalars['Datetime']['input']>;
  invite_sent_on?: InputMaybe<Scalars['Datetime']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type FriendsInsertResponse = {
  __typename?: 'friendsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Friends>;
};

export type FriendsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  friend_id?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  invite_accepted_on?: InputMaybe<OrderByDirection>;
  invite_sent_on?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type FriendsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  friend_id?: InputMaybe<Scalars['UUID']['input']>;
  invite_accepted_on?: InputMaybe<Scalars['Datetime']['input']>;
  invite_sent_on?: InputMaybe<Scalars['Datetime']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type FriendsUpdateResponse = {
  __typename?: 'friendsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Friends>;
};

export type Items = Node & {
  __typename?: 'items';
  category_itemsCollection?: Maybe<Category_ItemsConnection>;
  consumable?: Maybe<Scalars['Boolean']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  generic_type?: Maybe<Scalars['String']['output']>;
  id: Scalars['BigInt']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  price?: Maybe<Scalars['BigInt']['output']>;
  quantity?: Maybe<Scalars['BigInt']['output']>;
  slug: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
  weight?: Maybe<Scalars['String']['output']>;
  worn?: Maybe<Scalars['Boolean']['output']>;
};


export type ItemsCategory_ItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Category_ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Category_ItemsOrderBy>>;
};

export type ItemsConnection = {
  __typename?: 'itemsConnection';
  edges: Array<ItemsEdge>;
  pageInfo: PageInfo;
};

export type ItemsDeleteResponse = {
  __typename?: 'itemsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Items>;
};

export type ItemsEdge = {
  __typename?: 'itemsEdge';
  cursor: Scalars['String']['output'];
  node: Items;
};

export type ItemsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ItemsFilter>>;
  consumable?: InputMaybe<BooleanFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  generic_type?: InputMaybe<StringFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ItemsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ItemsFilter>>;
  price?: InputMaybe<BigIntFilter>;
  quantity?: InputMaybe<BigIntFilter>;
  slug?: InputMaybe<StringFilter>;
  unit?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  url?: InputMaybe<StringFilter>;
  user_id?: InputMaybe<UuidFilter>;
  weight?: InputMaybe<StringFilter>;
  worn?: InputMaybe<BooleanFilter>;
};

export type ItemsInsertInput = {
  consumable?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  generic_type?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  quantity?: InputMaybe<Scalars['BigInt']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  worn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemsInsertResponse = {
  __typename?: 'itemsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Items>;
};

export type ItemsOrderBy = {
  consumable?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  generic_type?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  price?: InputMaybe<OrderByDirection>;
  quantity?: InputMaybe<OrderByDirection>;
  slug?: InputMaybe<OrderByDirection>;
  unit?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  url?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
  weight?: InputMaybe<OrderByDirection>;
  worn?: InputMaybe<OrderByDirection>;
};

export type ItemsUpdateInput = {
  consumable?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  generic_type?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  quantity?: InputMaybe<Scalars['BigInt']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  worn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemsUpdateResponse = {
  __typename?: 'itemsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Items>;
};

export enum Measuring_System {
  Imperial = 'IMPERIAL',
  Metric = 'METRIC'
}

/** Boolean expression comparing fields on type "measuring_system" */
export type Measuring_SystemFilter = {
  eq?: InputMaybe<Measuring_System>;
  in?: InputMaybe<Array<Measuring_System>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Measuring_System>;
};

export type Notifications = Node & {
  __typename?: 'notifications';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  read_on_date?: Maybe<Scalars['Datetime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Datetime']['output'];
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type NotificationsConnection = {
  __typename?: 'notificationsConnection';
  edges: Array<NotificationsEdge>;
  pageInfo: PageInfo;
};

export type NotificationsDeleteResponse = {
  __typename?: 'notificationsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Notifications>;
};

export type NotificationsEdge = {
  __typename?: 'notificationsEdge';
  cursor: Scalars['String']['output'];
  node: Notifications;
};

export type NotificationsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<NotificationsFilter>>;
  content?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<NotificationsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<NotificationsFilter>>;
  read_on_date?: InputMaybe<DatetimeFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type NotificationsInsertInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  read_on_date?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type NotificationsInsertResponse = {
  __typename?: 'notificationsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Notifications>;
};

export type NotificationsOrderBy = {
  content?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  read_on_date?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type NotificationsUpdateInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  read_on_date?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type NotificationsUpdateResponse = {
  __typename?: 'notificationsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Notifications>;
};

export type Onboarding_Steps = Node & {
  __typename?: 'onboarding_steps';
  completion_date?: Maybe<Scalars['Datetime']['output']>;
  created_at: Scalars['Datetime']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  page: Scalars['String']['output'];
  updated_at: Scalars['Datetime']['output'];
  user_id: Scalars['UUID']['output'];
  users: Users;
};

export type Onboarding_StepsConnection = {
  __typename?: 'onboarding_stepsConnection';
  edges: Array<Onboarding_StepsEdge>;
  pageInfo: PageInfo;
};

export type Onboarding_StepsDeleteResponse = {
  __typename?: 'onboarding_stepsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Onboarding_Steps>;
};

export type Onboarding_StepsEdge = {
  __typename?: 'onboarding_stepsEdge';
  cursor: Scalars['String']['output'];
  node: Onboarding_Steps;
};

export type Onboarding_StepsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Onboarding_StepsFilter>>;
  completion_date?: InputMaybe<DatetimeFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Onboarding_StepsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Onboarding_StepsFilter>>;
  page?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type Onboarding_StepsInsertInput = {
  completion_date?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Onboarding_StepsInsertResponse = {
  __typename?: 'onboarding_stepsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Onboarding_Steps>;
};

export type Onboarding_StepsOrderBy = {
  completion_date?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  page?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type Onboarding_StepsUpdateInput = {
  completion_date?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Onboarding_StepsUpdateResponse = {
  __typename?: 'onboarding_stepsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Onboarding_Steps>;
};

export type Packs = Node & {
  __typename?: 'packs';
  allow_comments: Scalars['Boolean']['output'];
  categoriesCollection?: Maybe<CategoriesConnection>;
  commentsCollection?: Maybe<CommentsConnection>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  private: Scalars['Boolean']['output'];
  slug: Scalars['String']['output'];
  theme?: Maybe<Theme>;
  trip_packsCollection?: Maybe<Trip_PacksConnection>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id: Scalars['UUID']['output'];
  users: Users;
};


export type PacksCategoriesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CategoriesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CategoriesOrderBy>>;
};


export type PacksCommentsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CommentsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};


export type PacksTrip_PacksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_PacksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_PacksOrderBy>>;
};

export type PacksConnection = {
  __typename?: 'packsConnection';
  edges: Array<PacksEdge>;
  pageInfo: PageInfo;
};

export type PacksDeleteResponse = {
  __typename?: 'packsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Packs>;
};

export type PacksEdge = {
  __typename?: 'packsEdge';
  cursor: Scalars['String']['output'];
  node: Packs;
};

export type PacksFilter = {
  allow_comments?: InputMaybe<BooleanFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PacksFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PacksFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PacksFilter>>;
  private?: InputMaybe<BooleanFilter>;
  slug?: InputMaybe<StringFilter>;
  theme?: InputMaybe<ThemeFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type PacksInsertInput = {
  allow_comments?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Theme>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type PacksInsertResponse = {
  __typename?: 'packsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Packs>;
};

export type PacksOrderBy = {
  allow_comments?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  private?: InputMaybe<OrderByDirection>;
  slug?: InputMaybe<OrderByDirection>;
  theme?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type PacksUpdateInput = {
  allow_comments?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Theme>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type PacksUpdateResponse = {
  __typename?: 'packsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Packs>;
};

export type Polls = Node & {
  __typename?: 'polls';
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  questionsCollection?: Maybe<QuestionsConnection>;
  trip_id?: Maybe<Scalars['BigInt']['output']>;
  trips?: Maybe<Trips>;
  updated_at: Scalars['Datetime']['output'];
  user_answersCollection?: Maybe<User_AnswersConnection>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};


export type PollsQuestionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<QuestionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuestionsOrderBy>>;
};


export type PollsUser_AnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_AnswersOrderBy>>;
};

export type PollsConnection = {
  __typename?: 'pollsConnection';
  edges: Array<PollsEdge>;
  pageInfo: PageInfo;
};

export type PollsDeleteResponse = {
  __typename?: 'pollsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Polls>;
};

export type PollsEdge = {
  __typename?: 'pollsEdge';
  cursor: Scalars['String']['output'];
  node: Polls;
};

export type PollsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PollsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PollsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PollsFilter>>;
  trip_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type PollsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type PollsInsertResponse = {
  __typename?: 'pollsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Polls>;
};

export type PollsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  trip_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type PollsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type PollsUpdateResponse = {
  __typename?: 'pollsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Polls>;
};

export type Prices = Node & {
  __typename?: 'prices';
  active?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identifier?: Maybe<Subscription_Level>;
  interval?: Maybe<Pricing_Plan_Interval>;
  interval_count?: Maybe<Scalars['Int']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  product_id?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Products>;
  subscriptionsCollection?: Maybe<SubscriptionsConnection>;
  trial_period_days?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Pricing_Type>;
  unit_amount?: Maybe<Scalars['BigInt']['output']>;
};


export type PricesSubscriptionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<SubscriptionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SubscriptionsOrderBy>>;
};

export type PricesConnection = {
  __typename?: 'pricesConnection';
  edges: Array<PricesEdge>;
  pageInfo: PageInfo;
};

export type PricesDeleteResponse = {
  __typename?: 'pricesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prices>;
};

export type PricesEdge = {
  __typename?: 'pricesEdge';
  cursor: Scalars['String']['output'];
  node: Prices;
};

export type PricesFilter = {
  active?: InputMaybe<BooleanFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PricesFilter>>;
  currency?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  environment?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  identifier?: InputMaybe<Subscription_LevelFilter>;
  interval?: InputMaybe<Pricing_Plan_IntervalFilter>;
  interval_count?: InputMaybe<IntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PricesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PricesFilter>>;
  product_id?: InputMaybe<StringFilter>;
  trial_period_days?: InputMaybe<IntFilter>;
  type?: InputMaybe<Pricing_TypeFilter>;
  unit_amount?: InputMaybe<BigIntFilter>;
};

export type PricesInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Subscription_Level>;
  interval?: InputMaybe<Pricing_Plan_Interval>;
  interval_count?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  product_id?: InputMaybe<Scalars['String']['input']>;
  trial_period_days?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Pricing_Type>;
  unit_amount?: InputMaybe<Scalars['BigInt']['input']>;
};

export type PricesInsertResponse = {
  __typename?: 'pricesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prices>;
};

export type PricesOrderBy = {
  active?: InputMaybe<OrderByDirection>;
  currency?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  environment?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  identifier?: InputMaybe<OrderByDirection>;
  interval?: InputMaybe<OrderByDirection>;
  interval_count?: InputMaybe<OrderByDirection>;
  product_id?: InputMaybe<OrderByDirection>;
  trial_period_days?: InputMaybe<OrderByDirection>;
  type?: InputMaybe<OrderByDirection>;
  unit_amount?: InputMaybe<OrderByDirection>;
};

export type PricesUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Subscription_Level>;
  interval?: InputMaybe<Pricing_Plan_Interval>;
  interval_count?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  product_id?: InputMaybe<Scalars['String']['input']>;
  trial_period_days?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Pricing_Type>;
  unit_amount?: InputMaybe<Scalars['BigInt']['input']>;
};

export type PricesUpdateResponse = {
  __typename?: 'pricesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prices>;
};

export enum Pricing_Plan_Interval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

/** Boolean expression comparing fields on type "pricing_plan_interval" */
export type Pricing_Plan_IntervalFilter = {
  eq?: InputMaybe<Pricing_Plan_Interval>;
  in?: InputMaybe<Array<Pricing_Plan_Interval>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Pricing_Plan_Interval>;
};

export enum Pricing_Type {
  OneTime = 'one_time',
  Recurring = 'recurring'
}

/** Boolean expression comparing fields on type "pricing_type" */
export type Pricing_TypeFilter = {
  eq?: InputMaybe<Pricing_Type>;
  in?: InputMaybe<Array<Pricing_Type>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Pricing_Type>;
};

export type Products = Node & {
  __typename?: 'products';
  active: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Subscription_Level>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pricesCollection?: Maybe<PricesConnection>;
};


export type ProductsPricesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PricesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PricesOrderBy>>;
};

export type ProductsConnection = {
  __typename?: 'productsConnection';
  edges: Array<ProductsEdge>;
  pageInfo: PageInfo;
};

export type ProductsDeleteResponse = {
  __typename?: 'productsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Products>;
};

export type ProductsEdge = {
  __typename?: 'productsEdge';
  cursor: Scalars['String']['output'];
  node: Products;
};

export type ProductsFilter = {
  active?: InputMaybe<BooleanFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ProductsFilter>>;
  description?: InputMaybe<StringFilter>;
  environment?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  image?: InputMaybe<StringFilter>;
  name?: InputMaybe<Subscription_LevelFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ProductsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ProductsFilter>>;
};

export type ProductsInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Subscription_Level>;
};

export type ProductsInsertResponse = {
  __typename?: 'productsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Products>;
};

export type ProductsOrderBy = {
  active?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  environment?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  image?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
};

export type ProductsUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Subscription_Level>;
};

export type ProductsUpdateResponse = {
  __typename?: 'productsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Products>;
};

export type Questions = Node & {
  __typename?: 'questions';
  answersCollection?: Maybe<AnswersConnection>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  poll_id?: Maybe<Scalars['BigInt']['output']>;
  polls?: Maybe<Polls>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Datetime']['output'];
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};


export type QuestionsAnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnswersOrderBy>>;
};

export type QuestionsConnection = {
  __typename?: 'questionsConnection';
  edges: Array<QuestionsEdge>;
  pageInfo: PageInfo;
};

export type QuestionsDeleteResponse = {
  __typename?: 'questionsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Questions>;
};

export type QuestionsEdge = {
  __typename?: 'questionsEdge';
  cursor: Scalars['String']['output'];
  node: Questions;
};

export type QuestionsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<QuestionsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<QuestionsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<QuestionsFilter>>;
  poll_id?: InputMaybe<BigIntFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type QuestionsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  poll_id?: InputMaybe<Scalars['BigInt']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type QuestionsInsertResponse = {
  __typename?: 'questionsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Questions>;
};

export type QuestionsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  poll_id?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type QuestionsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  poll_id?: InputMaybe<Scalars['BigInt']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type QuestionsUpdateResponse = {
  __typename?: 'questionsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Questions>;
};

export type Replies = Node & {
  __typename?: 'replies';
  comment_id: Scalars['BigInt']['output'];
  comments: Comments;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id: Scalars['UUID']['output'];
  users: Users;
};

export type RepliesConnection = {
  __typename?: 'repliesConnection';
  edges: Array<RepliesEdge>;
  pageInfo: PageInfo;
};

export type RepliesDeleteResponse = {
  __typename?: 'repliesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Replies>;
};

export type RepliesEdge = {
  __typename?: 'repliesEdge';
  cursor: Scalars['String']['output'];
  node: Replies;
};

export type RepliesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<RepliesFilter>>;
  comment_id?: InputMaybe<BigIntFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<RepliesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<RepliesFilter>>;
  text?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type RepliesInsertInput = {
  comment_id?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type RepliesInsertResponse = {
  __typename?: 'repliesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Replies>;
};

export type RepliesOrderBy = {
  comment_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  text?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type RepliesUpdateInput = {
  comment_id?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type RepliesUpdateResponse = {
  __typename?: 'repliesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Replies>;
};

export enum Resource_Type {
  Group = 'GROUP',
  User = 'USER'
}

/** Boolean expression comparing fields on type "resource_type" */
export type Resource_TypeFilter = {
  eq?: InputMaybe<Resource_Type>;
  in?: InputMaybe<Array<Resource_Type>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Resource_Type>;
};

export type Shopping_List_Items = Node & {
  __typename?: 'shopping_list_items';
  completed: Scalars['Boolean']['output'];
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  quantity?: Maybe<Scalars['BigInt']['output']>;
  resource_type: Resource_Type;
  title?: Maybe<Scalars['String']['output']>;
  trip_id?: Maybe<Scalars['BigInt']['output']>;
  trips?: Maybe<Trips>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type Shopping_List_ItemsConnection = {
  __typename?: 'shopping_list_itemsConnection';
  edges: Array<Shopping_List_ItemsEdge>;
  pageInfo: PageInfo;
};

export type Shopping_List_ItemsDeleteResponse = {
  __typename?: 'shopping_list_itemsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Shopping_List_Items>;
};

export type Shopping_List_ItemsEdge = {
  __typename?: 'shopping_list_itemsEdge';
  cursor: Scalars['String']['output'];
  node: Shopping_List_Items;
};

export type Shopping_List_ItemsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Shopping_List_ItemsFilter>>;
  completed?: InputMaybe<BooleanFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Shopping_List_ItemsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Shopping_List_ItemsFilter>>;
  quantity?: InputMaybe<BigIntFilter>;
  resource_type?: InputMaybe<Resource_TypeFilter>;
  title?: InputMaybe<StringFilter>;
  trip_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type Shopping_List_ItemsInsertInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  quantity?: InputMaybe<Scalars['BigInt']['input']>;
  resource_type?: InputMaybe<Resource_Type>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Shopping_List_ItemsInsertResponse = {
  __typename?: 'shopping_list_itemsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Shopping_List_Items>;
};

export type Shopping_List_ItemsOrderBy = {
  completed?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  quantity?: InputMaybe<OrderByDirection>;
  resource_type?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  trip_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type Shopping_List_ItemsUpdateInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  quantity?: InputMaybe<Scalars['BigInt']['input']>;
  resource_type?: InputMaybe<Resource_Type>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Shopping_List_ItemsUpdateResponse = {
  __typename?: 'shopping_list_itemsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Shopping_List_Items>;
};

export enum Subscription_Level {
  Annual = 'ANNUAL',
  Free = 'FREE',
  Life = 'LIFE',
  Monthly = 'MONTHLY'
}

/** Boolean expression comparing fields on type "subscription_level" */
export type Subscription_LevelFilter = {
  eq?: InputMaybe<Subscription_Level>;
  in?: InputMaybe<Array<Subscription_Level>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Subscription_Level>;
};

export enum Subscription_Status {
  Active = 'active',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Trialing = 'trialing',
  Unpaid = 'unpaid'
}

/** Boolean expression comparing fields on type "subscription_status" */
export type Subscription_StatusFilter = {
  eq?: InputMaybe<Subscription_Status>;
  in?: InputMaybe<Array<Subscription_Status>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Subscription_Status>;
};

export type Subscriptions = Node & {
  __typename?: 'subscriptions';
  cancel_at?: Maybe<Scalars['Datetime']['output']>;
  cancel_at_period_end?: Maybe<Scalars['Boolean']['output']>;
  canceled_at?: Maybe<Scalars['Datetime']['output']>;
  created_at: Scalars['Datetime']['output'];
  current_period_end: Scalars['Datetime']['output'];
  current_period_start: Scalars['Datetime']['output'];
  ended_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  price_id?: Maybe<Scalars['String']['output']>;
  prices?: Maybe<Prices>;
  quantity?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Subscription_Status>;
  stripe_subscription_id?: Maybe<Scalars['String']['output']>;
  trial_end?: Maybe<Scalars['Datetime']['output']>;
  trial_start?: Maybe<Scalars['Datetime']['output']>;
  user_id: Scalars['UUID']['output'];
  users: Users;
};

export type SubscriptionsConnection = {
  __typename?: 'subscriptionsConnection';
  edges: Array<SubscriptionsEdge>;
  pageInfo: PageInfo;
};

export type SubscriptionsDeleteResponse = {
  __typename?: 'subscriptionsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Subscriptions>;
};

export type SubscriptionsEdge = {
  __typename?: 'subscriptionsEdge';
  cursor: Scalars['String']['output'];
  node: Subscriptions;
};

export type SubscriptionsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<SubscriptionsFilter>>;
  cancel_at?: InputMaybe<DatetimeFilter>;
  cancel_at_period_end?: InputMaybe<BooleanFilter>;
  canceled_at?: InputMaybe<DatetimeFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  current_period_end?: InputMaybe<DatetimeFilter>;
  current_period_start?: InputMaybe<DatetimeFilter>;
  ended_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<SubscriptionsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<SubscriptionsFilter>>;
  price_id?: InputMaybe<StringFilter>;
  quantity?: InputMaybe<IntFilter>;
  status?: InputMaybe<Subscription_StatusFilter>;
  stripe_subscription_id?: InputMaybe<StringFilter>;
  trial_end?: InputMaybe<DatetimeFilter>;
  trial_start?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type SubscriptionsInsertInput = {
  cancel_at?: InputMaybe<Scalars['Datetime']['input']>;
  cancel_at_period_end?: InputMaybe<Scalars['Boolean']['input']>;
  canceled_at?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  current_period_end?: InputMaybe<Scalars['Datetime']['input']>;
  current_period_start?: InputMaybe<Scalars['Datetime']['input']>;
  ended_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  price_id?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Subscription_Status>;
  stripe_subscription_id?: InputMaybe<Scalars['String']['input']>;
  trial_end?: InputMaybe<Scalars['Datetime']['input']>;
  trial_start?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type SubscriptionsInsertResponse = {
  __typename?: 'subscriptionsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Subscriptions>;
};

export type SubscriptionsOrderBy = {
  cancel_at?: InputMaybe<OrderByDirection>;
  cancel_at_period_end?: InputMaybe<OrderByDirection>;
  canceled_at?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  current_period_end?: InputMaybe<OrderByDirection>;
  current_period_start?: InputMaybe<OrderByDirection>;
  ended_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  price_id?: InputMaybe<OrderByDirection>;
  quantity?: InputMaybe<OrderByDirection>;
  status?: InputMaybe<OrderByDirection>;
  stripe_subscription_id?: InputMaybe<OrderByDirection>;
  trial_end?: InputMaybe<OrderByDirection>;
  trial_start?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type SubscriptionsUpdateInput = {
  cancel_at?: InputMaybe<Scalars['Datetime']['input']>;
  cancel_at_period_end?: InputMaybe<Scalars['Boolean']['input']>;
  canceled_at?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  current_period_end?: InputMaybe<Scalars['Datetime']['input']>;
  current_period_start?: InputMaybe<Scalars['Datetime']['input']>;
  ended_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  price_id?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Subscription_Status>;
  stripe_subscription_id?: InputMaybe<Scalars['String']['input']>;
  trial_end?: InputMaybe<Scalars['Datetime']['input']>;
  trial_start?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type SubscriptionsUpdateResponse = {
  __typename?: 'subscriptionsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Subscriptions>;
};

export enum Theme {
  Blue6 = 'BLUE6',
  Bluegreen6 = 'BLUEGREEN6',
  Breeze6 = 'BREEZE6',
  Celestial6 = 'CELESTIAL6',
  Circuit6 = 'CIRCUIT6',
  Colorblind10 = 'COLORBLIND10',
  Damask6 = 'DAMASK6',
  Depth6 = 'DEPTH6',
  Flow6 = 'FLOW6',
  Forte6 = 'FORTE6',
  Genesis6 = 'GENESIS6',
  Grayscale6 = 'GRAYSCALE6',
  Huecircle19 = 'HUECIRCLE19',
  Ionboardroom6 = 'IONBOARDROOM6',
  Jewelbright9 = 'JEWELBRIGHT9',
  Kilter6 = 'KILTER6',
  Tableau10 = 'TABLEAU10'
}

/** Boolean expression comparing fields on type "theme" */
export type ThemeFilter = {
  eq?: InputMaybe<Theme>;
  in?: InputMaybe<Array<Theme>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Theme>;
};

export type Todos = Node & {
  __typename?: 'todos';
  completed: Scalars['Boolean']['output'];
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  resource_type: Resource_Type;
  title?: Maybe<Scalars['String']['output']>;
  trip_id?: Maybe<Scalars['BigInt']['output']>;
  trips?: Maybe<Trips>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type TodosConnection = {
  __typename?: 'todosConnection';
  edges: Array<TodosEdge>;
  pageInfo: PageInfo;
};

export type TodosDeleteResponse = {
  __typename?: 'todosDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Todos>;
};

export type TodosEdge = {
  __typename?: 'todosEdge';
  cursor: Scalars['String']['output'];
  node: Todos;
};

export type TodosFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<TodosFilter>>;
  completed?: InputMaybe<BooleanFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<TodosFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<TodosFilter>>;
  resource_type?: InputMaybe<Resource_TypeFilter>;
  title?: InputMaybe<StringFilter>;
  trip_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type TodosInsertInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  resource_type?: InputMaybe<Resource_Type>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type TodosInsertResponse = {
  __typename?: 'todosInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Todos>;
};

export type TodosOrderBy = {
  completed?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  resource_type?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  trip_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type TodosUpdateInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  resource_type?: InputMaybe<Resource_Type>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type TodosUpdateResponse = {
  __typename?: 'todosUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Todos>;
};

export type Trip_Details = Node & {
  __typename?: 'trip_details';
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  trip_id?: Maybe<Scalars['BigInt']['output']>;
  trips?: Maybe<Trips>;
  type?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Datetime']['output'];
  url?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Trip_DetailsConnection = {
  __typename?: 'trip_detailsConnection';
  edges: Array<Trip_DetailsEdge>;
  pageInfo: PageInfo;
};

export type Trip_DetailsDeleteResponse = {
  __typename?: 'trip_detailsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Details>;
};

export type Trip_DetailsEdge = {
  __typename?: 'trip_detailsEdge';
  cursor: Scalars['String']['output'];
  node: Trip_Details;
};

export type Trip_DetailsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Trip_DetailsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Trip_DetailsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Trip_DetailsFilter>>;
  title?: InputMaybe<StringFilter>;
  trip_id?: InputMaybe<BigIntFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  url?: InputMaybe<StringFilter>;
  value?: InputMaybe<StringFilter>;
};

export type Trip_DetailsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Trip_DetailsInsertResponse = {
  __typename?: 'trip_detailsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Details>;
};

export type Trip_DetailsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  trip_id?: InputMaybe<OrderByDirection>;
  type?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  url?: InputMaybe<OrderByDirection>;
  value?: InputMaybe<OrderByDirection>;
};

export type Trip_DetailsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Trip_DetailsUpdateResponse = {
  __typename?: 'trip_detailsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Details>;
};

export enum Trip_Friend_Status {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

/** Boolean expression comparing fields on type "trip_friend_status" */
export type Trip_Friend_StatusFilter = {
  eq?: InputMaybe<Trip_Friend_Status>;
  in?: InputMaybe<Array<Trip_Friend_Status>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Trip_Friend_Status>;
};

export type Trip_Friends = Node & {
  __typename?: 'trip_friends';
  accepted_invite_on?: Maybe<Scalars['Datetime']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  status: Trip_Friend_Status;
  trip_id?: Maybe<Scalars['BigInt']['output']>;
  trips?: Maybe<Trips>;
  updated_at: Scalars['Datetime']['output'];
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type Trip_FriendsConnection = {
  __typename?: 'trip_friendsConnection';
  edges: Array<Trip_FriendsEdge>;
  pageInfo: PageInfo;
};

export type Trip_FriendsDeleteResponse = {
  __typename?: 'trip_friendsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Friends>;
};

export type Trip_FriendsEdge = {
  __typename?: 'trip_friendsEdge';
  cursor: Scalars['String']['output'];
  node: Trip_Friends;
};

export type Trip_FriendsFilter = {
  accepted_invite_on?: InputMaybe<DatetimeFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Trip_FriendsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Trip_FriendsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Trip_FriendsFilter>>;
  status?: InputMaybe<Trip_Friend_StatusFilter>;
  trip_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type Trip_FriendsInsertInput = {
  accepted_invite_on?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<Trip_Friend_Status>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Trip_FriendsInsertResponse = {
  __typename?: 'trip_friendsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Friends>;
};

export type Trip_FriendsOrderBy = {
  accepted_invite_on?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  status?: InputMaybe<OrderByDirection>;
  trip_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type Trip_FriendsUpdateInput = {
  accepted_invite_on?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<Trip_Friend_Status>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Trip_FriendsUpdateResponse = {
  __typename?: 'trip_friendsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Friends>;
};

export enum Trip_Invitation_Status {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

/** Boolean expression comparing fields on type "trip_invitation_status" */
export type Trip_Invitation_StatusFilter = {
  eq?: InputMaybe<Trip_Invitation_Status>;
  in?: InputMaybe<Array<Trip_Invitation_Status>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Trip_Invitation_Status>;
};

export type Trip_Packs = Node & {
  __typename?: 'trip_packs';
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pack_id?: Maybe<Scalars['BigInt']['output']>;
  packs?: Maybe<Packs>;
  trip_id?: Maybe<Scalars['BigInt']['output']>;
  trips?: Maybe<Trips>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type Trip_PacksConnection = {
  __typename?: 'trip_packsConnection';
  edges: Array<Trip_PacksEdge>;
  pageInfo: PageInfo;
};

export type Trip_PacksDeleteResponse = {
  __typename?: 'trip_packsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Packs>;
};

export type Trip_PacksEdge = {
  __typename?: 'trip_packsEdge';
  cursor: Scalars['String']['output'];
  node: Trip_Packs;
};

export type Trip_PacksFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Trip_PacksFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Trip_PacksFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Trip_PacksFilter>>;
  pack_id?: InputMaybe<BigIntFilter>;
  trip_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type Trip_PacksInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  pack_id?: InputMaybe<Scalars['BigInt']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Trip_PacksInsertResponse = {
  __typename?: 'trip_packsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Packs>;
};

export type Trip_PacksOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  pack_id?: InputMaybe<OrderByDirection>;
  trip_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type Trip_PacksUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  pack_id?: InputMaybe<Scalars['BigInt']['input']>;
  trip_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Trip_PacksUpdateResponse = {
  __typename?: 'trip_packsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trip_Packs>;
};

export type Trips = Node & {
  __typename?: 'trips';
  coordinates?: Maybe<Scalars['JSON']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ending_date?: Maybe<Scalars['Datetime']['output']>;
  ending_point?: Maybe<Scalars['String']['output']>;
  id: Scalars['BigInt']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pollsCollection?: Maybe<PollsConnection>;
  shopping_list_itemsCollection?: Maybe<Shopping_List_ItemsConnection>;
  slug: Scalars['String']['output'];
  starting_date?: Maybe<Scalars['Datetime']['output']>;
  starting_point?: Maybe<Scalars['String']['output']>;
  todosCollection?: Maybe<TodosConnection>;
  trip_detailsCollection?: Maybe<Trip_DetailsConnection>;
  trip_friendsCollection?: Maybe<Trip_FriendsConnection>;
  trip_packsCollection?: Maybe<Trip_PacksConnection>;
  updated_at: Scalars['Datetime']['output'];
  user_id: Scalars['UUID']['output'];
  users: Users;
};


export type TripsPollsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PollsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PollsOrderBy>>;
};


export type TripsShopping_List_ItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Shopping_List_ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Shopping_List_ItemsOrderBy>>;
};


export type TripsTodosCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<TodosFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};


export type TripsTrip_DetailsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_DetailsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_DetailsOrderBy>>;
};


export type TripsTrip_FriendsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_FriendsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_FriendsOrderBy>>;
};


export type TripsTrip_PacksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_PacksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_PacksOrderBy>>;
};

export type TripsConnection = {
  __typename?: 'tripsConnection';
  edges: Array<TripsEdge>;
  pageInfo: PageInfo;
};

export type TripsDeleteResponse = {
  __typename?: 'tripsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trips>;
};

export type TripsEdge = {
  __typename?: 'tripsEdge';
  cursor: Scalars['String']['output'];
  node: Trips;
};

export type TripsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<TripsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  ending_date?: InputMaybe<DatetimeFilter>;
  ending_point?: InputMaybe<StringFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<TripsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<TripsFilter>>;
  slug?: InputMaybe<StringFilter>;
  starting_date?: InputMaybe<DatetimeFilter>;
  starting_point?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type TripsInsertInput = {
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ending_date?: InputMaybe<Scalars['Datetime']['input']>;
  ending_point?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  starting_date?: InputMaybe<Scalars['Datetime']['input']>;
  starting_point?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type TripsInsertResponse = {
  __typename?: 'tripsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trips>;
};

export type TripsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  ending_date?: InputMaybe<OrderByDirection>;
  ending_point?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  slug?: InputMaybe<OrderByDirection>;
  starting_date?: InputMaybe<OrderByDirection>;
  starting_point?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type TripsUpdateInput = {
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ending_date?: InputMaybe<Scalars['Datetime']['input']>;
  ending_point?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  starting_date?: InputMaybe<Scalars['Datetime']['input']>;
  starting_point?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type TripsUpdateResponse = {
  __typename?: 'tripsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trips>;
};

export type User_Answers = Node & {
  __typename?: 'user_answers';
  answer_id?: Maybe<Scalars['BigInt']['output']>;
  answers?: Maybe<Answers>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  poll_id?: Maybe<Scalars['BigInt']['output']>;
  polls?: Maybe<Polls>;
  updated_at: Scalars['Datetime']['output'];
  user_id?: Maybe<Scalars['UUID']['output']>;
  users?: Maybe<Users>;
};

export type User_AnswersConnection = {
  __typename?: 'user_answersConnection';
  edges: Array<User_AnswersEdge>;
  pageInfo: PageInfo;
};

export type User_AnswersDeleteResponse = {
  __typename?: 'user_answersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Answers>;
};

export type User_AnswersEdge = {
  __typename?: 'user_answersEdge';
  cursor: Scalars['String']['output'];
  node: User_Answers;
};

export type User_AnswersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<User_AnswersFilter>>;
  answer_id?: InputMaybe<BigIntFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<User_AnswersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<User_AnswersFilter>>;
  poll_id?: InputMaybe<BigIntFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type User_AnswersInsertInput = {
  answer_id?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  poll_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type User_AnswersInsertResponse = {
  __typename?: 'user_answersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Answers>;
};

export type User_AnswersOrderBy = {
  answer_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  poll_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type User_AnswersUpdateInput = {
  answer_id?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  poll_id?: InputMaybe<Scalars['BigInt']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type User_AnswersUpdateResponse = {
  __typename?: 'user_answersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Answers>;
};

export enum User_Role {
  Admin = 'ADMIN',
  User = 'USER'
}

/** Boolean expression comparing fields on type "user_role" */
export type User_RoleFilter = {
  eq?: InputMaybe<User_Role>;
  in?: InputMaybe<Array<User_Role>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<User_Role>;
};

export type Users = Node & {
  __typename?: 'users';
  address_1?: Maybe<Scalars['String']['output']>;
  address_2?: Maybe<Scalars['String']['output']>;
  answersCollection?: Maybe<AnswersConnection>;
  city?: Maybe<Scalars['String']['output']>;
  commentsCollection?: Maybe<CommentsConnection>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  customersCollection?: Maybe<CustomersConnection>;
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  friendsCollection?: Maybe<FriendsConnection>;
  id: Scalars['UUID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  itemsCollection?: Maybe<ItemsConnection>;
  last_name?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['JSON']['output']>;
  measuring_system?: Maybe<Measuring_System>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  notificationsCollection?: Maybe<NotificationsConnection>;
  onboard_date?: Maybe<Scalars['Datetime']['output']>;
  onboarding_stepsCollection?: Maybe<Onboarding_StepsConnection>;
  packsCollection?: Maybe<PacksConnection>;
  pollsCollection?: Maybe<PollsConnection>;
  questionsCollection?: Maybe<QuestionsConnection>;
  repliesCollection?: Maybe<RepliesConnection>;
  role?: Maybe<User_Role>;
  shopping_list_itemsCollection?: Maybe<Shopping_List_ItemsConnection>;
  state?: Maybe<Scalars['String']['output']>;
  subscription_level?: Maybe<Subscription_Level>;
  subscriptionsCollection?: Maybe<SubscriptionsConnection>;
  todosCollection?: Maybe<TodosConnection>;
  trail_name?: Maybe<Scalars['String']['output']>;
  trip_friendsCollection?: Maybe<Trip_FriendsConnection>;
  trip_packsCollection?: Maybe<Trip_PacksConnection>;
  tripsCollection?: Maybe<TripsConnection>;
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_answersCollection?: Maybe<User_AnswersConnection>;
};


export type UsersAnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnswersOrderBy>>;
};


export type UsersCommentsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CommentsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};


export type UsersCustomersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CustomersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CustomersOrderBy>>;
};


export type UsersFriendsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<FriendsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FriendsOrderBy>>;
};


export type UsersItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ItemsOrderBy>>;
};


export type UsersNotificationsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<NotificationsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};


export type UsersOnboarding_StepsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Onboarding_StepsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Onboarding_StepsOrderBy>>;
};


export type UsersPacksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PacksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PacksOrderBy>>;
};


export type UsersPollsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PollsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PollsOrderBy>>;
};


export type UsersQuestionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<QuestionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuestionsOrderBy>>;
};


export type UsersRepliesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<RepliesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RepliesOrderBy>>;
};


export type UsersShopping_List_ItemsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Shopping_List_ItemsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Shopping_List_ItemsOrderBy>>;
};


export type UsersSubscriptionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<SubscriptionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SubscriptionsOrderBy>>;
};


export type UsersTodosCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<TodosFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};


export type UsersTrip_FriendsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_FriendsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_FriendsOrderBy>>;
};


export type UsersTrip_PacksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Trip_PacksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Trip_PacksOrderBy>>;
};


export type UsersTripsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<TripsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripsOrderBy>>;
};


export type UsersUser_AnswersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_AnswersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_AnswersOrderBy>>;
};

export type UsersConnection = {
  __typename?: 'usersConnection';
  edges: Array<UsersEdge>;
  pageInfo: PageInfo;
};

export type UsersDeleteResponse = {
  __typename?: 'usersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type UsersEdge = {
  __typename?: 'usersEdge';
  cursor: Scalars['String']['output'];
  node: Users;
};

export type UsersFilter = {
  address_1?: InputMaybe<StringFilter>;
  address_2?: InputMaybe<StringFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<UsersFilter>>;
  city?: InputMaybe<StringFilter>;
  country?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  email?: InputMaybe<StringFilter>;
  first_name?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  image?: InputMaybe<StringFilter>;
  last_name?: InputMaybe<StringFilter>;
  measuring_system?: InputMaybe<Measuring_SystemFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<UsersFilter>;
  onboard_date?: InputMaybe<DatetimeFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<UsersFilter>>;
  role?: InputMaybe<User_RoleFilter>;
  state?: InputMaybe<StringFilter>;
  subscription_level?: InputMaybe<Subscription_LevelFilter>;
  trail_name?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type UsersInsertInput = {
  address_1?: InputMaybe<Scalars['String']['input']>;
  address_2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['JSON']['input']>;
  measuring_system?: InputMaybe<Measuring_System>;
  onboard_date?: InputMaybe<Scalars['Datetime']['input']>;
  role?: InputMaybe<User_Role>;
  state?: InputMaybe<Scalars['String']['input']>;
  subscription_level?: InputMaybe<Subscription_Level>;
  trail_name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type UsersInsertResponse = {
  __typename?: 'usersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type UsersOrderBy = {
  address_1?: InputMaybe<OrderByDirection>;
  address_2?: InputMaybe<OrderByDirection>;
  city?: InputMaybe<OrderByDirection>;
  country?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  email?: InputMaybe<OrderByDirection>;
  first_name?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  image?: InputMaybe<OrderByDirection>;
  last_name?: InputMaybe<OrderByDirection>;
  measuring_system?: InputMaybe<OrderByDirection>;
  onboard_date?: InputMaybe<OrderByDirection>;
  role?: InputMaybe<OrderByDirection>;
  state?: InputMaybe<OrderByDirection>;
  subscription_level?: InputMaybe<OrderByDirection>;
  trail_name?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type UsersUpdateInput = {
  address_1?: InputMaybe<Scalars['String']['input']>;
  address_2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['JSON']['input']>;
  measuring_system?: InputMaybe<Measuring_System>;
  onboard_date?: InputMaybe<Scalars['Datetime']['input']>;
  role?: InputMaybe<User_Role>;
  state?: InputMaybe<Scalars['String']['input']>;
  subscription_level?: InputMaybe<Subscription_Level>;
  trail_name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type UsersUpdateResponse = {
  __typename?: 'usersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type CurrentUserQueryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type CurrentUserQueryQuery = { __typename?: 'Query', usersCollection?: { __typename?: 'usersConnection', edges: Array<{ __typename?: 'usersEdge', currentUser: { __typename?: 'users', id: any, image?: string | null, first_name?: string | null, last_name?: string | null } }> } | null };


export const CurrentUserQueryDocument = /*#__PURE__*/ gql`
    query CurrentUserQuery($id: UUID) {
  usersCollection(filter: {id: {eq: $id}}) {
    edges {
      currentUser: node {
        id
        image
        first_name
        last_name
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CurrentUserQuery(variables?: CurrentUserQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CurrentUserQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserQueryQuery>(CurrentUserQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CurrentUserQuery', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;