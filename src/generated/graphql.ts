/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AllItemsResponse = {
  __typename?: 'AllItemsResponse';
  errors?: Maybe<BaseError>;
  items: Array<Maybe<Item>>;
};

export type Answer = {
  __typename?: 'Answer';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  question?: Maybe<Question>;
  question_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type BaseError = {
  __typename?: 'BaseError';
  message: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type BaseUser = {
  address_1?: Maybe<Scalars['String']['output']>;
  address_2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  measuring_system?: Maybe<MeasuringSystem>;
  onboard_date?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<Role>;
  state?: Maybe<Scalars['String']['output']>;
  subscription_level?: Maybe<SubscriptionLevel>;
  trail_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type CategoriesInput = {
  packId: Scalars['Int']['input'];
};

export type Category = {
  __typename?: 'Category';
  category_items: Array<Maybe<CategoryItem>>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  pack_id: Scalars['Int']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type CategoryItem = {
  __typename?: 'CategoryItem';
  category?: Maybe<Category>;
  category_id: Scalars['Int']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  item?: Maybe<Item>;
  item_id: Scalars['Int']['output'];
  position?: Maybe<Scalars['Int']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type CategoryItemResponse = {
  __typename?: 'CategoryItemResponse';
  category_item?: Maybe<CategoryItem>;
  errors?: Maybe<BaseError>;
};

export type CategoryResponse = {
  __typename?: 'CategoryResponse';
  category?: Maybe<Category>;
  errors?: Maybe<BaseError>;
};

export type ClosetInput = {
  pack_id?: InputMaybe<Scalars['Int']['input']>;
};

export type ClosetPageResponse = {
  __typename?: 'ClosetPageResponse';
  errors?: Maybe<BaseError>;
  packs: Array<Maybe<Pack>>;
  selectedPack?: Maybe<Pack>;
};

export type Comment = {
  __typename?: 'Comment';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  pack_id?: Maybe<Scalars['Int']['output']>;
  replies: Array<Maybe<Reply>>;
  text?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<BaseError>;
};

export type CreateAnswerInput = {
  content: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
};

export type CreateAnswerResponse = {
  __typename?: 'CreateAnswerResponse';
  answer?: Maybe<Answer>;
  errors?: Maybe<BaseError>;
};

export type CreateCategoryInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  pack_id: Scalars['Int']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryItemInput = {
  category_id: Scalars['Int']['input'];
  item_id: Scalars['Int']['input'];
};

export type CreateCheckoutSessionInput = {
  subscriptionLevel: SubscriptionLevel;
};

export type CreateCheckoutSessionResponse = {
  __typename?: 'CreateCheckoutSessionResponse';
  errors?: Maybe<BaseError>;
  session?: Maybe<StripeSession>;
};

export type CreateCommentInput = {
  pack_id: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFreeSubscriptionInput = {
  email: Scalars['String']['input'];
  subscriptionLevel: SubscriptionLevel;
};

export type CreateFreeSubscriptionResponse = {
  __typename?: 'CreateFreeSubscriptionResponse';
  errors?: Maybe<BaseError>;
  subscription?: Maybe<Subscription>;
};

export type CreateItemInput = {
  consumable?: InputMaybe<Scalars['Boolean']['input']>;
  generic_type?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  worn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateItemResponse = {
  __typename?: 'CreateItemResponse';
  category_item?: Maybe<CategoryItem>;
  errors?: Maybe<BaseError>;
};

export type CreateOnboardStepInput = {
  page: Scalars['String']['input'];
};

export type CreateOnboardStepResponse = {
  __typename?: 'CreateOnboardStepResponse';
  errors?: Maybe<BaseError>;
  onboardingStep?: Maybe<OnboardingStep>;
};

export type CreatePackInput = {
  allow_comments: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  private: Scalars['Boolean']['input'];
  theme: Theme;
};

export type CreatePollInput = {
  answers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  question?: InputMaybe<Scalars['String']['input']>;
  tripId: Scalars['Int']['input'];
};

export type CreatePollResponse = {
  __typename?: 'CreatePollResponse';
  errors?: Maybe<BaseError>;
  poll?: Maybe<Poll>;
};

export type CreateReplyInput = {
  comment_id: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type CreateShoppingItemInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  resource_type: ResourceType;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id: Scalars['Int']['input'];
};

export type CreateTodoInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  resource_type: ResourceType;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id: Scalars['Int']['input'];
};

export type CreateTripDetailInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id: Scalars['Int']['input'];
  type: DetailType;
  url?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTripInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  ending_date?: InputMaybe<Scalars['DateTime']['input']>;
  ending_point?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pack_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  starting_date?: InputMaybe<Scalars['DateTime']['input']>;
  starting_point?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};

export type CreateUserAnswerInput = {
  answer_id: Scalars['Int']['input'];
  poll_id?: InputMaybe<Scalars['Int']['input']>;
  user_id: Scalars['ID']['input'];
};

export type CreateUserAnswerResponse = {
  __typename?: 'CreateUserAnswerResponse';
  errors?: Maybe<BaseError>;
  userAnswer?: Maybe<UserAnswer>;
};

export type Csv = {
  category_name?: InputMaybe<Scalars['String']['input']>;
  consumable?: InputMaybe<Scalars['Boolean']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  item_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  worn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CsvImportInput = {
  data: Array<Csv>;
  pack_id?: InputMaybe<Scalars['Int']['input']>;
};

export type CsvImportResponse = {
  __typename?: 'CsvImportResponse';
  errors?: Maybe<BaseError>;
  pack?: Maybe<Pack>;
  success: Scalars['Boolean']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  id?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type DashboardData = {
  __typename?: 'DashboardData';
  friends: Array<Maybe<Friend>>;
  invitations: Array<Maybe<TripFriend>>;
  news: Array<Maybe<News>>;
  upcomingTrips: Array<Maybe<Trip>>;
};

export type DashboardResponse = {
  __typename?: 'DashboardResponse';
  data?: Maybe<DashboardData>;
  errors?: Maybe<BaseError>;
};

export type DeleteCategoryItemInput = {
  category_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  item_id?: InputMaybe<Scalars['Int']['input']>;
};

export type DeleteCategoryItemResponse = {
  __typename?: 'DeleteCategoryItemResponse';
  category_item?: Maybe<CategoryItem>;
  errors?: Maybe<BaseError>;
};

export type DeleteCategoryResponse = {
  __typename?: 'DeleteCategoryResponse';
  category?: Maybe<Category>;
  errors?: Maybe<BaseError>;
};

export type DeleteCommentResponse = {
  __typename?: 'DeleteCommentResponse';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type DeleteDetailResponse = {
  __typename?: 'DeleteDetailResponse';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type DeleteItemInput = {
  id: Scalars['Int']['input'];
};

export type DeleteItemResponse = {
  __typename?: 'DeleteItemResponse';
  errors?: Maybe<BaseError>;
  item?: Maybe<Item>;
};

export type DeleteReplyResponse = {
  __typename?: 'DeleteReplyResponse';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type DeleteShoppingItemInput = {
  id: Scalars['Int']['input'];
};

export type DeleteShoppingItemResponse = {
  __typename?: 'DeleteShoppingItemResponse';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type DeleteTodoInput = {
  id: Scalars['Int']['input'];
};

export type DeleteTodoResponse = {
  __typename?: 'DeleteTodoResponse';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type DeleteTripDetailInput = {
  id: Scalars['Int']['input'];
};

export enum DetailType {
  Hike = 'HIKE',
  Trip = 'TRIP'
}

export type DiscourseInput = {
  payload: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type DiscoursePayload = {
  __typename?: 'DiscoursePayload';
  errors?: Maybe<BaseError>;
  redirect?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DraggableLocation = {
  droppableId?: InputMaybe<Scalars['Int']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
};

export type Friend = {
  __typename?: 'Friend';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  friend_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  invite_accepted_on?: Maybe<Scalars['DateTime']['output']>;
  invite_sent_on?: Maybe<Scalars['DateTime']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type FriendsQueryInput = {
  orderBy?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortOptions?: InputMaybe<SortOptions>;
};

export type FriendsResponse = {
  __typename?: 'FriendsResponse';
  count?: Maybe<Scalars['Int']['output']>;
  errors?: Maybe<BaseError>;
  friends?: Maybe<Array<Maybe<Friend>>>;
};

export type InviteFriendInput = {
  friend_id: Scalars['String']['input'];
};

export type InviteFriendResponse = {
  __typename?: 'InviteFriendResponse';
  errors?: Maybe<BaseError>;
  result?: Maybe<User>;
};

export type InviteFriendsToTripInput = {
  friends: Array<InputMaybe<Scalars['String']['input']>>;
  tripId: Scalars['Int']['input'];
};

export type Item = {
  __typename?: 'Item';
  category_items?: Maybe<Array<Maybe<CategoryItem>>>;
  consumable?: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTime']['output'];
  generic_type?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  price: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['String']['output'];
  weight?: Maybe<Scalars['String']['output']>;
  worn?: Maybe<Scalars['Boolean']['output']>;
};

export type ItemResponse = {
  __typename?: 'ItemResponse';
  errors?: Maybe<BaseError>;
  item?: Maybe<Item>;
};

export type ManageSubscriptionResponse = {
  __typename?: 'ManageSubscriptionResponse';
  errors?: Maybe<BaseError>;
  session?: Maybe<StripeSession>;
};

export type MarkAllAsReadPayload = {
  __typename?: 'MarkAllAsReadPayload';
  errors?: Maybe<BaseError>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
};

export type MePayload = {
  __typename?: 'MePayload';
  errors?: Maybe<BaseError>;
  onboardingSteps?: Maybe<Array<Maybe<OnboardingStep>>>;
  user?: Maybe<User>;
};

export enum MeasuringSystem {
  Imperial = 'IMPERIAL',
  Metric = 'METRIC'
}

export type Mutation = {
  __typename?: 'Mutation';
  batchUpdateShoppingItems?: Maybe<ShoppingItemsResponse>;
  batchUpdateTodos?: Maybe<TodosResponse>;
  createAnswer: CreateAnswerResponse;
  createCategory?: Maybe<CategoryResponse>;
  createCategoryItem: CategoryItemResponse;
  createCheckoutSession?: Maybe<CreateCheckoutSessionResponse>;
  createComment: CommentResponse;
  createFreeSubscription?: Maybe<CreateFreeSubscriptionResponse>;
  createItem: CreateItemResponse;
  createOnboardStep?: Maybe<CreateOnboardStepResponse>;
  createPack: PackResponse;
  createPoll: CreatePollResponse;
  createReply: ReplyResponse;
  createShoppingItem?: Maybe<ShoppingItemResponse>;
  createTodo?: Maybe<TodoResponse>;
  createTrip?: Maybe<TripResponse>;
  createTripDetail?: Maybe<TripDetailResponse>;
  createUserAnswer: CreateUserAnswerResponse;
  csvImport: CsvImportResponse;
  deleteCategory?: Maybe<DeleteCategoryResponse>;
  deleteCategoryItem?: Maybe<DeleteCategoryItemResponse>;
  deleteComment: DeleteCommentResponse;
  deleteItem: DeleteItemResponse;
  deleteReply: DeleteReplyResponse;
  deleteShoppingItem?: Maybe<DeleteShoppingItemResponse>;
  deleteTodo?: Maybe<DeleteTodoResponse>;
  deleteTripDetail?: Maybe<DeleteDetailResponse>;
  inviteFriend?: Maybe<InviteFriendResponse>;
  inviteFriendsToTrip: TripFriendsResponse;
  loginToForums: DiscoursePayload;
  manageSubscription?: Maybe<ManageSubscriptionResponse>;
  markAllAsRead: MarkAllAsReadPayload;
  removeFriend?: Maybe<RemoveFriendResponse>;
  removeFromTrip?: Maybe<RemoveFromTripResponse>;
  removeInvitation?: Maybe<RemoveInvitationResponse>;
  removePoll: RemovePollResponse;
  sendWelcomeEmail: SendWelcomeEmailPayload;
  setSession: SetSessionPayload;
  updateAvatar: UpdateAvatarPayload;
  updateCategory?: Maybe<CategoryResponse>;
  updateComment: CommentResponse;
  updateItem?: Maybe<ItemResponse>;
  updateNotification: UpdateNotificationPayload;
  updateOnboardingSteps?: Maybe<UpdateOnboardingStepsResponse>;
  updatePack: UpdatePackResponse;
  updatePassword: UpdatePasswordPayload;
  updatePosition?: Maybe<UpdatePositionResponse>;
  updateReply: ReplyResponse;
  updateShoppingItem?: Maybe<ShoppingItemResponse>;
  updateTodo?: Maybe<TodoResponse>;
  updateTrip?: Maybe<TripResponse>;
  updateTripDetail: TripDetailResponse;
  updateTripDetails: TripDetailsResponse;
  updateTripFriend?: Maybe<UpdateTripFriendResponse>;
  updateTripPack: UpdateTripPackResponse;
  updateUser: UpdateUserPayload;
};


export type MutationBatchUpdateShoppingItemsArgs = {
  input?: InputMaybe<ShoppingItemsInput>;
};


export type MutationBatchUpdateTodosArgs = {
  input?: InputMaybe<TodosInput>;
};


export type MutationCreateAnswerArgs = {
  input: CreateAnswerInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCategoryItemArgs = {
  input: CreateCategoryItemInput;
};


export type MutationCreateCheckoutSessionArgs = {
  input?: InputMaybe<CreateCheckoutSessionInput>;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateFreeSubscriptionArgs = {
  input?: InputMaybe<CreateFreeSubscriptionInput>;
};


export type MutationCreateItemArgs = {
  category_id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateItemInput;
};


export type MutationCreateOnboardStepArgs = {
  input: CreateOnboardStepInput;
};


export type MutationCreatePackArgs = {
  input: CreatePackInput;
};


export type MutationCreatePollArgs = {
  input: CreatePollInput;
};


export type MutationCreateReplyArgs = {
  input: CreateReplyInput;
};


export type MutationCreateShoppingItemArgs = {
  input: CreateShoppingItemInput;
};


export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


export type MutationCreateTripArgs = {
  input: CreateTripInput;
};


export type MutationCreateTripDetailArgs = {
  input: CreateTripDetailInput;
};


export type MutationCreateUserAnswerArgs = {
  input: CreateUserAnswerInput;
};


export type MutationCsvImportArgs = {
  input: CsvImportInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteCategoryItemArgs = {
  input?: InputMaybe<DeleteCategoryItemInput>;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteItemArgs = {
  input: DeleteItemInput;
};


export type MutationDeleteReplyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteShoppingItemArgs = {
  input: DeleteShoppingItemInput;
};


export type MutationDeleteTodoArgs = {
  input: DeleteTodoInput;
};


export type MutationDeleteTripDetailArgs = {
  input: DeleteTripDetailInput;
};


export type MutationInviteFriendArgs = {
  input: InviteFriendInput;
};


export type MutationInviteFriendsToTripArgs = {
  input: InviteFriendsToTripInput;
};


export type MutationLoginToForumsArgs = {
  input: DiscourseInput;
};


export type MutationMarkAllAsReadArgs = {
  user_id: Scalars['ID']['input'];
};


export type MutationRemoveFriendArgs = {
  input?: InputMaybe<RemoveFriendInput>;
};


export type MutationRemoveFromTripArgs = {
  input: RemoveFromTripInput;
};


export type MutationRemoveInvitationArgs = {
  input: RemoveInvitationInput;
};


export type MutationRemovePollArgs = {
  input: RemovePollInput;
};


export type MutationSetSessionArgs = {
  input: SetSessionInput;
};


export type MutationUpdateAvatarArgs = {
  input: UpdateAvatarInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['Int']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateCommentArgs = {
  id: Scalars['Int']['input'];
  input: UpdateCommentInput;
};


export type MutationUpdateItemArgs = {
  id: Scalars['Int']['input'];
  input: UpdateItemInput;
};


export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};


export type MutationUpdateOnboardingStepsArgs = {
  input: UpdateOnboardingStepsInput;
};


export type MutationUpdatePackArgs = {
  id: Scalars['Int']['input'];
  input: UpdatePackInput;
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};


export type MutationUpdatePositionArgs = {
  input: UpdatePositionInput;
};


export type MutationUpdateReplyArgs = {
  id: Scalars['Int']['input'];
  input: UpdateReplyInput;
};


export type MutationUpdateShoppingItemArgs = {
  input: UpdateShoppingItemInput;
};


export type MutationUpdateTodoArgs = {
  input: UpdateTodoInput;
};


export type MutationUpdateTripArgs = {
  input: UpdateTripInput;
};


export type MutationUpdateTripDetailArgs = {
  input: UpdateTripDetailInput;
};


export type MutationUpdateTripDetailsArgs = {
  input: UpdateTripDetailsInput;
};


export type MutationUpdateTripFriendArgs = {
  input: UpdateTripFriendInput;
};


export type MutationUpdateTripPackArgs = {
  input: UpdateTripPackInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type News = {
  __typename?: 'News';
  author?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  published?: Maybe<Scalars['DateTime']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Notification = {
  __typename?: 'Notification';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  read_on_date?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user_id: Scalars['String']['output'];
};

export type NotificationsInput = {
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  user_id: Scalars['ID']['input'];
};

export type NotificationsPayload = {
  __typename?: 'NotificationsPayload';
  errors?: Maybe<BaseError>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  totalCount: Scalars['Int']['output'];
};

export type OnboardingStep = {
  __typename?: 'OnboardingStep';
  completion_date?: Maybe<Scalars['DateTime']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  page: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_id: Scalars['String']['output'];
};

export type Pack = {
  __typename?: 'Pack';
  allow_comments?: Maybe<Scalars['Boolean']['output']>;
  categories?: Maybe<Array<Maybe<Category>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  private?: Maybe<Scalars['Boolean']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Theme>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type PackInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type PackResponse = {
  __typename?: 'PackResponse';
  errors?: Maybe<BaseError>;
  pack?: Maybe<Pack>;
};

export type PacksResponse = {
  __typename?: 'PacksResponse';
  errors?: Maybe<BaseError>;
  packs: Array<Maybe<Pack>>;
};

export type PlanningInput = {
  trip_id?: InputMaybe<Scalars['Int']['input']>;
};

export type PlanningPageResponse = {
  __typename?: 'PlanningPageResponse';
  errors?: Maybe<BaseError>;
  friends: Array<Maybe<TripFriend>>;
  pack?: Maybe<Pack>;
  poll?: Maybe<Poll>;
  shoppingItems: Array<Maybe<ShoppingItem>>;
  todos: Array<Maybe<Todo>>;
  tripDetails: Array<Maybe<TripDetail>>;
  trips: Array<Maybe<Trip>>;
};

export type Poll = {
  __typename?: 'Poll';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  question?: Maybe<Question>;
  trip_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_answers?: Maybe<Array<Maybe<UserAnswer>>>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type Price = {
  __typename?: 'Price';
  active?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<SubscriptionLevel>;
  interval?: Maybe<PricingPlanInterval>;
  interval_count?: Maybe<Scalars['Int']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  product?: Maybe<Product>;
  product_id?: Maybe<Scalars['String']['output']>;
  trial_period_days?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<PricingType>;
  unit_amount?: Maybe<Scalars['Int']['output']>;
};

export type PricesResponse = {
  __typename?: 'PricesResponse';
  errors?: Maybe<BaseError>;
  prices?: Maybe<Array<Maybe<Price>>>;
};

export enum PricingPlanInterval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export enum PricingType {
  OneTime = 'one_time',
  Recurring = 'recurring'
}

export type Product = {
  __typename?: 'Product';
  active?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<SubscriptionLevel>;
};

export enum Provider {
  Email = 'EMAIL',
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE',
  Twitter = 'TWITTER'
}

export type PublicPackResponse = {
  __typename?: 'PublicPackResponse';
  errors?: Maybe<BaseError>;
  pack?: Maybe<Pack>;
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  allItems: AllItemsResponse;
  categories?: Maybe<Array<Maybe<Category>>>;
  closet: ClosetPageResponse;
  fetchDashboard: DashboardResponse;
  friends?: Maybe<FriendsResponse>;
  me?: Maybe<MePayload>;
  notifications: NotificationsPayload;
  pack?: Maybe<PackResponse>;
  packs?: Maybe<PacksResponse>;
  planning?: Maybe<PlanningPageResponse>;
  prices?: Maybe<PricesResponse>;
  publicPack: PublicPackResponse;
  search: SearchPayload;
  shoppingItems?: Maybe<Array<Maybe<ShoppingItem>>>;
  subscription?: Maybe<SubscriptionResponse>;
  todos?: Maybe<Array<Maybe<Todo>>>;
  trip?: Maybe<TripResponse>;
  tripDetails?: Maybe<Array<Maybe<TripDetail>>>;
  tripFriends: TripFriendsResponse;
  trips: TripsResponse;
  user: User;
};


export type QueryCategoriesArgs = {
  input?: InputMaybe<CategoriesInput>;
};


export type QueryClosetArgs = {
  input?: InputMaybe<ClosetInput>;
};


export type QueryFriendsArgs = {
  input?: InputMaybe<FriendsQueryInput>;
};


export type QueryNotificationsArgs = {
  input: NotificationsInput;
};


export type QueryPackArgs = {
  input: PackInput;
};


export type QueryPlanningArgs = {
  input?: InputMaybe<PlanningInput>;
};


export type QueryPublicPackArgs = {
  input: PackInput;
};


export type QuerySearchArgs = {
  input?: InputMaybe<SearchInput>;
};


export type QueryShoppingItemsArgs = {
  input: ShoppingItemsInput;
};


export type QueryTodosArgs = {
  input: TodosInput;
};


export type QueryTripArgs = {
  input?: InputMaybe<TripInput>;
};


export type QueryTripDetailsArgs = {
  input: TripDetailsInput;
};


export type QueryTripFriendsArgs = {
  input: TripFriendsInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Question = {
  __typename?: 'Question';
  answers?: Maybe<Array<Maybe<Answer>>>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  poll?: Maybe<Poll>;
  poll_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userAnswers?: Maybe<Array<Maybe<UserAnswer>>>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export enum RedirectReason {
  AccessDenied = 'ACCESS_DENIED',
  SessionExpired = 'SESSION_EXPIRED'
}

export type RemoveFriendInput = {
  id: Scalars['Int']['input'];
};

export type RemoveFriendResponse = {
  __typename?: 'RemoveFriendResponse';
  errors?: Maybe<BaseError>;
  friend?: Maybe<Friend>;
};

export type RemoveFromTripInput = {
  tripId: Scalars['Int']['input'];
};

export type RemoveFromTripResponse = {
  __typename?: 'RemoveFromTripResponse';
  errors?: Maybe<BaseError>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RemoveInvitationInput = {
  id: Scalars['String']['input'];
};

export type RemoveInvitationResponse = {
  __typename?: 'RemoveInvitationResponse';
  errors?: Maybe<BaseError>;
  result?: Maybe<User>;
};

export type RemovePollInput = {
  id: Scalars['Int']['input'];
};

export type RemovePollResponse = {
  __typename?: 'RemovePollResponse';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type Reply = {
  __typename?: 'Reply';
  comment?: Maybe<Comment>;
  comment_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type ReplyResponse = {
  __typename?: 'ReplyResponse';
  errors?: Maybe<BaseError>;
  reply?: Maybe<Reply>;
};

export enum ResourceType {
  Group = 'GROUP',
  User = 'USER'
}

export type Result = {
  combine?: InputMaybe<Scalars['Boolean']['input']>;
  destination?: InputMaybe<DraggableLocation>;
  draggableId?: InputMaybe<Scalars['Int']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<DraggableLocation>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SearchInput = {
  query?: InputMaybe<Scalars['String']['input']>;
};

export type SearchPayload = {
  __typename?: 'SearchPayload';
  count?: Maybe<Scalars['Int']['output']>;
  errors?: Maybe<BaseError>;
  results?: Maybe<Array<Maybe<User>>>;
};

export type SendWelcomeEmailPayload = {
  __typename?: 'SendWelcomeEmailPayload';
  errors?: Maybe<BaseError>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SetSessionInput = {
  access_token: Scalars['String']['input'];
  refresh_token: Scalars['String']['input'];
};

export type SetSessionPayload = {
  __typename?: 'SetSessionPayload';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type ShoppingItem = {
  __typename?: 'ShoppingItem';
  completed?: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  resource_type?: Maybe<ResourceType>;
  title?: Maybe<Scalars['String']['output']>;
  trip_id: Scalars['Int']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type ShoppingItemResponse = {
  __typename?: 'ShoppingItemResponse';
  errors?: Maybe<BaseError>;
  item?: Maybe<ShoppingItem>;
};

export type ShoppingItemsInput = {
  trip_id?: InputMaybe<Scalars['Int']['input']>;
  value?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ShoppingItemsResponse = {
  __typename?: 'ShoppingItemsResponse';
  shoppingItems?: Maybe<Array<Maybe<ShoppingItem>>>;
};

export type SortOptions = {
  ascending: Scalars['Boolean']['input'];
  foreignTable: Scalars['String']['input'];
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type StripeCard = {
  __typename?: 'StripeCard';
  brand?: Maybe<Scalars['String']['output']>;
  exp_month?: Maybe<Scalars['Int']['output']>;
  exp_year?: Maybe<Scalars['Int']['output']>;
  last4?: Maybe<Scalars['String']['output']>;
};

export type StripeCharge = {
  __typename?: 'StripeCharge';
  amount?: Maybe<Scalars['Int']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  payment_method_details?: Maybe<StripePaymentMethodDetails>;
};

export type StripeCustomer = {
  __typename?: 'StripeCustomer';
  address?: Maybe<StripeCustomerAddress>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  subscriptions?: Maybe<StripeSubscriptionData>;
};

export type StripeCustomerAddress = {
  __typename?: 'StripeCustomerAddress';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type StripeInvoice = {
  __typename?: 'StripeInvoice';
  amount_due?: Maybe<Scalars['Int']['output']>;
  amount_paid?: Maybe<Scalars['Int']['output']>;
  amount_remaining?: Maybe<Scalars['Int']['output']>;
  charge?: Maybe<StripeCharge>;
  created?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  hosted_invoice_url?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoice_pdf?: Maybe<Scalars['String']['output']>;
  lines?: Maybe<StripeInvoiceLineItemData>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type StripeInvoiceLineItem = {
  __typename?: 'StripeInvoiceLineItem';
  amount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  price?: Maybe<StripePrice>;
};

export type StripeInvoiceLineItemData = {
  __typename?: 'StripeInvoiceLineItemData';
  data?: Maybe<Array<Maybe<StripeInvoiceLineItem>>>;
};

export type StripePaymentMethodDetails = {
  __typename?: 'StripePaymentMethodDetails';
  card?: Maybe<StripeCard>;
};

export type StripePrice = {
  __typename?: 'StripePrice';
  created?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StripeProduct>;
  unit_amount?: Maybe<Scalars['Int']['output']>;
};

export type StripeProduct = {
  __typename?: 'StripeProduct';
  active?: Maybe<Scalars['Boolean']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type StripeSession = {
  __typename?: 'StripeSession';
  created?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  return_url?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type StripeSubscription = {
  __typename?: 'StripeSubscription';
  current_period_end?: Maybe<Scalars['DateTime']['output']>;
  current_period_start?: Maybe<Scalars['DateTime']['output']>;
  default_payment_method?: Maybe<StripePaymentMethodDetails>;
  default_source?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  items?: Maybe<StripeSubscriptionItemsData>;
  latest_invoice?: Maybe<StripeInvoice>;
  status?: Maybe<StripeSubscriptionStatus>;
};

export type StripeSubscriptionData = {
  __typename?: 'StripeSubscriptionData';
  data?: Maybe<Array<Maybe<StripeSubscription>>>;
};

export type StripeSubscriptionItem = {
  __typename?: 'StripeSubscriptionItem';
  created?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  price?: Maybe<StripePrice>;
  quantity?: Maybe<Scalars['Int']['output']>;
  subscription?: Maybe<Scalars['String']['output']>;
};

export type StripeSubscriptionItemsData = {
  __typename?: 'StripeSubscriptionItemsData';
  data?: Maybe<Array<Maybe<StripeSubscriptionItem>>>;
};

export enum StripeSubscriptionStatus {
  Active = 'active',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  Nvoicecanceled = 'nvoicecanceled',
  PastDue = 'past_due',
  Trialing = 'trialing',
  Unpaid = 'unpaid'
}

export type Subscription = {
  __typename?: 'Subscription';
  cancel_at?: Maybe<Scalars['DateTime']['output']>;
  cancel_at_period_end?: Maybe<Scalars['Boolean']['output']>;
  canceled_at?: Maybe<Scalars['DateTime']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  current_period_end?: Maybe<Scalars['DateTime']['output']>;
  current_period_start?: Maybe<Scalars['DateTime']['output']>;
  ended_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  price?: Maybe<Price>;
  price_id?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<StripeSubscriptionStatus>;
  stripe_subscription_id?: Maybe<Scalars['String']['output']>;
  trial_end?: Maybe<Scalars['DateTime']['output']>;
  trial_start?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export enum SubscriptionLevel {
  Annual = 'ANNUAL',
  Free = 'FREE',
  Life = 'LIFE',
  Monthly = 'MONTHLY'
}

export type SubscriptionResponse = {
  __typename?: 'SubscriptionResponse';
  data?: Maybe<SubscriptionResponseData>;
  errors?: Maybe<BaseError>;
};

export type SubscriptionResponseData = {
  __typename?: 'SubscriptionResponseData';
  billingHistory: Array<Maybe<StripeInvoice>>;
  subscription?: Maybe<StripeSubscription>;
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

export type Todo = {
  __typename?: 'Todo';
  completed?: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  resource_type?: Maybe<ResourceType>;
  title?: Maybe<Scalars['String']['output']>;
  trip_id: Scalars['Int']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type TodoResponse = {
  __typename?: 'TodoResponse';
  errors?: Maybe<BaseError>;
  todo?: Maybe<Todo>;
};

export type TodosInput = {
  tripId?: InputMaybe<Scalars['Int']['input']>;
  value?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TodosResponse = {
  __typename?: 'TodosResponse';
  todos?: Maybe<Array<Maybe<Todo>>>;
};

export type Trip = {
  __typename?: 'Trip';
  coordinates?: Maybe<Scalars['JSON']['output']>;
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  ending_date?: Maybe<Scalars['DateTime']['output']>;
  ending_point?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  polls?: Maybe<Array<Maybe<Poll>>>;
  slug?: Maybe<Scalars['String']['output']>;
  starting_date?: Maybe<Scalars['DateTime']['output']>;
  starting_point?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  user_id: Scalars['String']['output'];
};

export type TripDetail = {
  __typename?: 'TripDetail';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  trip_id: Scalars['Int']['output'];
  type?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type TripDetailResponse = {
  __typename?: 'TripDetailResponse';
  errors?: Maybe<BaseError>;
  tripDetail?: Maybe<TripDetail>;
};

export type TripDetailsInput = {
  tripId: Scalars['Int']['input'];
  type?: InputMaybe<DetailType>;
};

export type TripDetailsResponse = {
  __typename?: 'TripDetailsResponse';
  errors?: Maybe<BaseError>;
  tripDetails: Array<Maybe<TripDetail>>;
};

export type TripFriend = {
  __typename?: 'TripFriend';
  accepted_invite_on?: Maybe<Scalars['DateTime']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  pack?: Maybe<Pack>;
  status?: Maybe<TripFriendStatus>;
  trip?: Maybe<Trip>;
  trip_id: Scalars['Int']['output'];
  updated_at: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  user_id: Scalars['String']['output'];
};

export enum TripFriendStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type TripFriendsInput = {
  tripId: Scalars['Int']['input'];
};

export type TripFriendsResponse = {
  __typename?: 'TripFriendsResponse';
  errors?: Maybe<BaseError>;
  friends?: Maybe<Array<Maybe<TripFriend>>>;
};

export type TripInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type TripPack = {
  __typename?: 'TripPack';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  pack_id: Scalars['Int']['output'];
  trip_id: Scalars['Int']['output'];
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user_id: Scalars['Int']['output'];
};

export type TripResponse = {
  __typename?: 'TripResponse';
  data?: Maybe<Trip>;
  errors?: Maybe<BaseError>;
};

export type TripsResponse = {
  __typename?: 'TripsResponse';
  data: Array<Maybe<Trip>>;
  errors?: Maybe<BaseError>;
};

export type UpdateAvatarInput = {
  file?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

export type UpdateAvatarPayload = {
  __typename?: 'UpdateAvatarPayload';
  errors?: Maybe<BaseError>;
  user?: Maybe<User>;
};

export type UpdateCategoryInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  packId?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommentInput = {
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateItemInput = {
  consumable?: InputMaybe<Scalars['Boolean']['input']>;
  generic_type?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  worn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateNotificationInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  read_on_date?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNotificationPayload = {
  __typename?: 'UpdateNotificationPayload';
  errors?: Maybe<BaseError>;
  notification?: Maybe<Notification>;
};

export type UpdateOnboardingStepsInput = {
  completion_date?: InputMaybe<Scalars['DateTime']['input']>;
  page: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type UpdateOnboardingStepsResponse = {
  __typename?: 'UpdateOnboardingStepsResponse';
  errors?: Maybe<BaseError>;
  onboardingSteps?: Maybe<Array<Maybe<OnboardingStep>>>;
};

export type UpdatePackInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Theme>;
};

export type UpdatePackResponse = {
  __typename?: 'UpdatePackResponse';
  errors?: Maybe<BaseError>;
  pack?: Maybe<Pack>;
};

export type UpdatePasswordInput = {
  password: Scalars['String']['input'];
};

export type UpdatePasswordPayload = {
  __typename?: 'UpdatePasswordPayload';
  errors?: Maybe<BaseError>;
  success: Scalars['Boolean']['output'];
};

export type UpdatePositionInput = {
  result: Result;
};

export type UpdatePositionResponse = {
  __typename?: 'UpdatePositionResponse';
  categoryItems?: Maybe<Array<Maybe<CategoryItem>>>;
};

export type UpdateReplyInput = {
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShoppingItemInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  resource_type?: InputMaybe<ResourceType>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTodoInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['Int']['input'];
  resource_type?: InputMaybe<ResourceType>;
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTripDetailInput = {
  id: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  trip_id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<DetailType>;
  url?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTripDetailsInput = {
  details: Array<UpdateTripDetailInput>;
  trip_id: Scalars['Int']['input'];
};

export type UpdateTripFriendInput = {
  accepted_invite_on?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['Int']['input'];
  status?: InputMaybe<TripFriendStatus>;
  trip_id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTripFriendResponse = {
  __typename?: 'UpdateTripFriendResponse';
  errors?: Maybe<BaseError>;
  tripFriend?: Maybe<TripFriend>;
};

export type UpdateTripInput = {
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ending_date?: InputMaybe<Scalars['DateTime']['input']>;
  ending_point?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  pack_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  starting_date?: InputMaybe<Scalars['DateTime']['input']>;
  starting_point?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['DateTime']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTripPackInput = {
  pack_id: Scalars['Int']['input'];
  trip_id: Scalars['Int']['input'];
};

export type UpdateTripPackResponse = {
  __typename?: 'UpdateTripPackResponse';
  errors?: Maybe<BaseError>;
  pack?: Maybe<Pack>;
};

export type UpdateUserInput = {
  address_1?: InputMaybe<Scalars['String']['input']>;
  address_2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  measuring_system?: InputMaybe<MeasuringSystem>;
  onboard_date?: InputMaybe<Scalars['DateTime']['input']>;
  role?: InputMaybe<Role>;
  state?: InputMaybe<Scalars['String']['input']>;
  subscription_level?: InputMaybe<SubscriptionLevel>;
  trail_name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  errors?: Maybe<BaseError>;
  user?: Maybe<User>;
};

export type User = BaseUser & {
  __typename?: 'User';
  address_1?: Maybe<Scalars['String']['output']>;
  address_2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  friend?: Maybe<Friend>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  measuring_system: MeasuringSystem;
  notifications: Array<Notification>;
  onboard_date?: Maybe<Scalars['DateTime']['output']>;
  onboarding_steps?: Maybe<Array<Maybe<OnboardingStep>>>;
  packs?: Maybe<Array<Maybe<Pack>>>;
  packsCount?: Maybe<Scalars['Int']['output']>;
  role: Role;
  state?: Maybe<Scalars['String']['output']>;
  subscription_level: SubscriptionLevel;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
  trail_name?: Maybe<Scalars['String']['output']>;
  trips?: Maybe<Array<Maybe<Trip>>>;
  tripsCount?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type UserAnswer = {
  __typename?: 'UserAnswer';
  answer_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  poll_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type BaseErrorFragment = { __typename?: 'BaseError', path: string, message: string } & { ' $fragmentName'?: 'BaseErrorFragment' };

export type BaseUserFragment = { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, notifications: Array<(
    { __typename?: 'Notification' }
    & { ' $fragmentRefs'?: { 'NotificationFragment': NotificationFragment } }
  )>, onboarding_steps?: Array<(
    { __typename?: 'OnboardingStep' }
    & { ' $fragmentRefs'?: { 'OnboardingStepFragment': OnboardingStepFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'BaseUserFragment' };

export type CategoryFragment = { __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<(
    { __typename?: 'CategoryItem' }
    & { ' $fragmentRefs'?: { 'CategoryItemFragment': CategoryItemFragment } }
  ) | null> } & { ' $fragmentName'?: 'CategoryFragment' };

export type CategoryItemFragment = { __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: (
    { __typename?: 'Item' }
    & { ' $fragmentRefs'?: { 'ItemFragment': ItemFragment } }
  ) | null } & { ' $fragmentName'?: 'CategoryItemFragment' };

export type CustomerFragment = { __typename?: 'Customer', id?: string | null, stripe_customer_id?: string | null, user_id?: string | null, user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
  ) | null } & { ' $fragmentName'?: 'CustomerFragment' };

export type CommentFragment = { __typename?: 'Comment', id: number, text?: string | null, user_id?: string | null, pack_id?: number | null, created_at?: any | null, updated_at?: any | null } & { ' $fragmentName'?: 'CommentFragment' };

export type FriendFragment = { __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
  ) | null } & { ' $fragmentName'?: 'FriendFragment' };

export type ItemFragment = { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } & { ' $fragmentName'?: 'ItemFragment' };

export type NewsFragment = { __typename?: 'News', title?: string | null, link?: string | null, description?: string | null, author?: string | null, published?: any | null, created?: any | null, source?: string | null, image?: string | null } & { ' $fragmentName'?: 'NewsFragment' };

export type NotificationFragment = { __typename?: 'Notification', id: number, title?: string | null, content?: string | null, user_id: string, read_on_date?: any | null, created_at?: any | null, updated_at?: any | null } & { ' $fragmentName'?: 'NotificationFragment' };

export type OnboardingStepFragment = { __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } & { ' $fragmentName'?: 'OnboardingStepFragment' };

export type PackFragment = { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<(
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFragment': CategoryFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'PackFragment' };

export type PollFragment = { __typename?: 'Poll', id?: number | null, user_id?: string | null, trip_id?: number | null, created_at?: any | null, updated_at?: any | null, question?: (
    { __typename?: 'Question' }
    & { ' $fragmentRefs'?: { 'QuestionFragment': QuestionFragment } }
  ) | null, user_answers?: Array<(
    { __typename?: 'UserAnswer' }
    & { ' $fragmentRefs'?: { 'UserAnswerFragment': UserAnswerFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'PollFragment' };

export type QuestionFragment = { __typename?: 'Question', id?: number | null, title?: string | null, poll_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null, answers?: Array<(
    { __typename?: 'Answer' }
    & { ' $fragmentRefs'?: { 'AnswerFragment': AnswerFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'QuestionFragment' };

export type AnswerFragment = { __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null } & { ' $fragmentName'?: 'AnswerFragment' };

export type UserAnswerFragment = { __typename?: 'UserAnswer', id?: number | null, answer_id?: number | null, user_id?: string | null, poll_id?: number | null, created_at?: any | null, updated_at?: any | null } & { ' $fragmentName'?: 'UserAnswerFragment' };

export type PriceFragment = { __typename?: 'Price', id?: string | null, product_id?: string | null, identifier?: SubscriptionLevel | null, active?: boolean | null, description?: string | null, unit_amount?: number | null, currency?: string | null, type?: PricingType | null, interval?: PricingPlanInterval | null, interval_count?: number | null, trial_period_days?: number | null, metadata?: any | null, product?: (
    { __typename?: 'Product' }
    & { ' $fragmentRefs'?: { 'ProductFragment': ProductFragment } }
  ) | null } & { ' $fragmentName'?: 'PriceFragment' };

export type ProductFragment = { __typename?: 'Product', id?: string | null, active?: boolean | null, name?: SubscriptionLevel | null, description?: string | null, image?: string | null, metadata?: any | null } & { ' $fragmentName'?: 'ProductFragment' };

export type ReplyFragment = { __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null } & { ' $fragmentName'?: 'ReplyFragment' };

export type ShoppingItemFragment = { __typename?: 'ShoppingItem', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, quantity?: number | null, created_at: any, updated_at: any } & { ' $fragmentName'?: 'ShoppingItemFragment' };

export type StripeSubscriptionFragment = { __typename?: 'StripeSubscription', id?: string | null, current_period_end?: any | null, current_period_start?: any | null, default_source?: string | null, status?: StripeSubscriptionStatus | null, default_payment_method?: (
    { __typename?: 'StripePaymentMethodDetails' }
    & { ' $fragmentRefs'?: { 'StripePaymentMethodDetailsFragment': StripePaymentMethodDetailsFragment } }
  ) | null, latest_invoice?: (
    { __typename?: 'StripeInvoice' }
    & { ' $fragmentRefs'?: { 'StripeInvoiceFragment': StripeInvoiceFragment } }
  ) | null, items?: (
    { __typename?: 'StripeSubscriptionItemsData' }
    & { ' $fragmentRefs'?: { 'StripeSubscriptionItemsDataFragment': StripeSubscriptionItemsDataFragment } }
  ) | null } & { ' $fragmentName'?: 'StripeSubscriptionFragment' };

export type StripeInvoiceFragment = { __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: (
    { __typename?: 'StripeCharge' }
    & { ' $fragmentRefs'?: { 'StripeChargeFragment': StripeChargeFragment } }
  ) | null, lines?: (
    { __typename?: 'StripeInvoiceLineItemData' }
    & { ' $fragmentRefs'?: { 'StripeInvoiceLineItemDataFragment': StripeInvoiceLineItemDataFragment } }
  ) | null } & { ' $fragmentName'?: 'StripeInvoiceFragment' };

export type StripeInvoiceLineItemDataFragment = { __typename?: 'StripeInvoiceLineItemData', data?: Array<(
    { __typename?: 'StripeInvoiceLineItem' }
    & { ' $fragmentRefs'?: { 'StripeInvoiceLineItemFragment': StripeInvoiceLineItemFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'StripeInvoiceLineItemDataFragment' };

export type StripeChargeFragment = { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: (
    { __typename?: 'StripePaymentMethodDetails' }
    & { ' $fragmentRefs'?: { 'StripePaymentMethodDetailsFragment': StripePaymentMethodDetailsFragment } }
  ) | null } & { ' $fragmentName'?: 'StripeChargeFragment' };

export type StripePaymentMethodDetailsFragment = { __typename?: 'StripePaymentMethodDetails', card?: (
    { __typename?: 'StripeCard' }
    & { ' $fragmentRefs'?: { 'StripeCardFragment': StripeCardFragment } }
  ) | null } & { ' $fragmentName'?: 'StripePaymentMethodDetailsFragment' };

export type StripeCardFragment = { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } & { ' $fragmentName'?: 'StripeCardFragment' };

export type StripeInvoiceLineItemFragment = { __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: (
    { __typename?: 'StripePrice' }
    & { ' $fragmentRefs'?: { 'StripePriceFragment': StripePriceFragment } }
  ) | null } & { ' $fragmentName'?: 'StripeInvoiceLineItemFragment' };

export type StripeSubscriptionItemsDataFragment = { __typename?: 'StripeSubscriptionItemsData', data?: Array<(
    { __typename?: 'StripeSubscriptionItem' }
    & { ' $fragmentRefs'?: { 'StripeSubscriptionItemFragment': StripeSubscriptionItemFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'StripeSubscriptionItemsDataFragment' };

export type StripeSubscriptionItemFragment = { __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: (
    { __typename?: 'StripePrice' }
    & { ' $fragmentRefs'?: { 'StripePriceFragment': StripePriceFragment } }
  ) | null } & { ' $fragmentName'?: 'StripeSubscriptionItemFragment' };

export type StripePriceFragment = { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: (
    { __typename?: 'StripeProduct' }
    & { ' $fragmentRefs'?: { 'StripeProductFragment': StripeProductFragment } }
  ) | null } & { ' $fragmentName'?: 'StripePriceFragment' };

export type StripeProductFragment = { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } & { ' $fragmentName'?: 'StripeProductFragment' };

export type StripeSessionFragment = { __typename?: 'StripeSession', id?: string | null, created?: any | null, url?: string | null, return_url?: string | null } & { ' $fragmentName'?: 'StripeSessionFragment' };

export type StripeCustomerFragment = { __typename?: 'StripeCustomer', id?: string | null, email?: string | null, address?: (
    { __typename?: 'StripeCustomerAddress' }
    & { ' $fragmentRefs'?: { 'StripeCustomerAddressFragment': StripeCustomerAddressFragment } }
  ) | null, subscriptions?: (
    { __typename?: 'StripeSubscriptionData' }
    & { ' $fragmentRefs'?: { 'StripeSubscriptionDataFragment': StripeSubscriptionDataFragment } }
  ) | null } & { ' $fragmentName'?: 'StripeCustomerFragment' };

export type StripeCustomerAddressFragment = { __typename?: 'StripeCustomerAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } & { ' $fragmentName'?: 'StripeCustomerAddressFragment' };

export type StripeSubscriptionDataFragment = { __typename?: 'StripeSubscriptionData', data?: Array<(
    { __typename?: 'StripeSubscription' }
    & { ' $fragmentRefs'?: { 'StripeSubscriptionFragment': StripeSubscriptionFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'StripeSubscriptionDataFragment' };

export type SubscriptionFragment = { __typename?: 'Subscription', id?: string | null, user_id?: string | null, stripe_subscription_id?: string | null, status?: StripeSubscriptionStatus | null, metadata?: any | null, price_id?: string | null, quantity?: number | null, cancel_at_period_end?: boolean | null, created_at?: any | null, current_period_start?: any | null, current_period_end?: any | null, ended_at?: any | null, cancel_at?: any | null, canceled_at?: any | null, trial_start?: any | null, trial_end?: any | null, user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
  ) | null, price?: (
    { __typename?: 'Price' }
    & { ' $fragmentRefs'?: { 'PriceFragment': PriceFragment } }
  ) | null } & { ' $fragmentName'?: 'SubscriptionFragment' };

export type TripFragment = { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } & { ' $fragmentName'?: 'TripFragment' };

export type TripDetailFragment = { __typename?: 'TripDetail', id: number, title?: string | null, url?: string | null, value?: string | null, type?: string | null, trip_id: number, created_at: any, updated_at: any } & { ' $fragmentName'?: 'TripDetailFragment' };

export type TripFriendFragment = { __typename?: 'TripFriend', id: number, trip_id: number, user_id: string, accepted_invite_on?: any | null, status?: TripFriendStatus | null, created_at: any, updated_at: any, pack?: (
    { __typename?: 'Pack' }
    & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
  ) | null, user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
  ) | null, trip?: (
    { __typename?: 'Trip' }
    & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
  ) | null } & { ' $fragmentName'?: 'TripFriendFragment' };

export type TodoFragment = { __typename?: 'Todo', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, created_at: any, updated_at: any } & { ' $fragmentName'?: 'TodoFragment' };

export type CreateAnswerMutationVariables = Exact<{
  input: CreateAnswerInput;
}>;


export type CreateAnswerMutation = { __typename?: 'Mutation', createAnswer: { __typename?: 'CreateAnswerResponse', answer?: (
      { __typename?: 'Answer' }
      & { ' $fragmentRefs'?: { 'AnswerFragment': AnswerFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory?: { __typename?: 'CategoryResponse', category?: (
      { __typename?: 'Category' }
      & { ' $fragmentRefs'?: { 'CategoryFragment': CategoryFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory?: { __typename?: 'DeleteCategoryResponse', category?: { __typename?: 'Category', id: number } | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory?: { __typename?: 'CategoryResponse', category?: (
      { __typename?: 'Category' }
      & { ' $fragmentRefs'?: { 'CategoryFragment': CategoryFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateCategoryItemMutationVariables = Exact<{
  input: CreateCategoryItemInput;
}>;


export type CreateCategoryItemMutation = { __typename?: 'Mutation', createCategoryItem: { __typename?: 'CategoryItemResponse', category_item?: (
      { __typename?: 'CategoryItem' }
      & { ' $fragmentRefs'?: { 'CategoryItemFragment': CategoryItemFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type DeleteCategoryItemMutationVariables = Exact<{
  input: DeleteCategoryItemInput;
}>;


export type DeleteCategoryItemMutation = { __typename?: 'Mutation', deleteCategoryItem?: { __typename?: 'DeleteCategoryItemResponse', category_item?: { __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any } | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentResponse', comment?: (
      { __typename?: 'Comment', user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null, replies: Array<(
        { __typename?: 'Reply' }
        & { ' $fragmentRefs'?: { 'ReplyFragment': ReplyFragment } }
      ) | null> }
      & { ' $fragmentRefs'?: { 'CommentFragment': CommentFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: { __typename?: 'DeleteCommentResponse', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'CommentResponse', comment?: (
      { __typename?: 'Comment', user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null, replies: Array<(
        { __typename?: 'Reply', user?: (
          { __typename?: 'User' }
          & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
        ) | null }
        & { ' $fragmentRefs'?: { 'ReplyFragment': ReplyFragment } }
      ) | null> }
      & { ' $fragmentRefs'?: { 'CommentFragment': CommentFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type InviteFriendMutationVariables = Exact<{
  input: InviteFriendInput;
}>;


export type InviteFriendMutation = { __typename?: 'Mutation', inviteFriend?: { __typename?: 'InviteFriendResponse', result?: (
      { __typename?: 'User', tripsCount?: number | null, packsCount?: number | null, friend?: (
        { __typename?: 'Friend' }
        & { ' $fragmentRefs'?: { 'FriendFragment': FriendFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type RemoveFriendMutationVariables = Exact<{
  input: RemoveFriendInput;
}>;


export type RemoveFriendMutation = { __typename?: 'Mutation', removeFriend?: { __typename?: 'RemoveFriendResponse', friend?: (
      { __typename?: 'Friend' }
      & { ' $fragmentRefs'?: { 'FriendFragment': FriendFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type RemoveInvitationMutationVariables = Exact<{
  input: RemoveInvitationInput;
}>;


export type RemoveInvitationMutation = { __typename?: 'Mutation', removeInvitation?: { __typename?: 'RemoveInvitationResponse', result?: (
      { __typename?: 'User', tripsCount?: number | null, packsCount?: number | null, friend?: (
        { __typename?: 'Friend' }
        & { ' $fragmentRefs'?: { 'FriendFragment': FriendFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateItemMutationVariables = Exact<{
  category_id: Scalars['Int']['input'];
  input: CreateItemInput;
}>;


export type CreateItemMutation = { __typename?: 'Mutation', createItem: { __typename?: 'CreateItemResponse', category_item?: (
      { __typename?: 'CategoryItem' }
      & { ' $fragmentRefs'?: { 'CategoryItemFragment': CategoryItemFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CsvImportMutationVariables = Exact<{
  input: CsvImportInput;
}>;


export type CsvImportMutation = { __typename?: 'Mutation', csvImport: { __typename?: 'CsvImportResponse', success: boolean, pack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type DeleteItemMutationVariables = Exact<{
  input: DeleteItemInput;
}>;


export type DeleteItemMutation = { __typename?: 'Mutation', deleteItem: { __typename?: 'DeleteItemResponse', item?: (
      { __typename?: 'Item' }
      & { ' $fragmentRefs'?: { 'ItemFragment': ItemFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateItemMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateItemInput;
}>;


export type UpdateItemMutation = { __typename?: 'Mutation', updateItem?: { __typename?: 'ItemResponse', item?: (
      { __typename?: 'Item' }
      & { ' $fragmentRefs'?: { 'ItemFragment': ItemFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type MarkAllAsReadMutationVariables = Exact<{
  user_id: Scalars['ID']['input'];
}>;


export type MarkAllAsReadMutation = { __typename?: 'Mutation', markAllAsRead: { __typename?: 'MarkAllAsReadPayload', notifications?: Array<(
      { __typename?: 'Notification' }
      & { ' $fragmentRefs'?: { 'NotificationFragment': NotificationFragment } }
    ) | null> | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateNotificationMutationVariables = Exact<{
  input: UpdateNotificationInput;
}>;


export type UpdateNotificationMutation = { __typename?: 'Mutation', updateNotification: { __typename?: 'UpdateNotificationPayload', notification?: (
      { __typename?: 'Notification' }
      & { ' $fragmentRefs'?: { 'NotificationFragment': NotificationFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreateOnboardingStepMutationVariables = Exact<{
  input: CreateOnboardStepInput;
}>;


export type CreateOnboardingStepMutation = { __typename?: 'Mutation', createOnboardStep?: { __typename?: 'CreateOnboardStepResponse', onboardingStep?: (
      { __typename?: 'OnboardingStep' }
      & { ' $fragmentRefs'?: { 'OnboardingStepFragment': OnboardingStepFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreatePackMutationVariables = Exact<{
  input: CreatePackInput;
}>;


export type CreatePackMutation = { __typename?: 'Mutation', createPack: { __typename?: 'PackResponse', pack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdatePackMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdatePackInput;
}>;


export type UpdatePackMutation = { __typename?: 'Mutation', updatePack: { __typename?: 'UpdatePackResponse', pack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreatePollMutationVariables = Exact<{
  input: CreatePollInput;
}>;


export type CreatePollMutation = { __typename?: 'Mutation', createPoll: { __typename?: 'CreatePollResponse', poll?: (
      { __typename?: 'Poll' }
      & { ' $fragmentRefs'?: { 'PollFragment': PollFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type RemovePollMutationVariables = Exact<{
  input: RemovePollInput;
}>;


export type RemovePollMutation = { __typename?: 'Mutation', removePoll: { __typename?: 'RemovePollResponse', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreateReplyMutationVariables = Exact<{
  input: CreateReplyInput;
}>;


export type CreateReplyMutation = { __typename?: 'Mutation', createReply: { __typename?: 'ReplyResponse', reply?: (
      { __typename?: 'Reply', user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'ReplyFragment': ReplyFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type DeleteReplyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteReplyMutation = { __typename?: 'Mutation', deleteReply: { __typename?: 'DeleteReplyResponse', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateReplyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateReplyInput;
}>;


export type UpdateReplyMutation = { __typename?: 'Mutation', updateReply: { __typename?: 'ReplyResponse', reply?: (
      { __typename?: 'Reply', user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'ReplyFragment': ReplyFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreateShoppingItemMutationVariables = Exact<{
  input: CreateShoppingItemInput;
}>;


export type CreateShoppingItemMutation = { __typename?: 'Mutation', createShoppingItem?: { __typename?: 'ShoppingItemResponse', item?: (
      { __typename?: 'ShoppingItem' }
      & { ' $fragmentRefs'?: { 'ShoppingItemFragment': ShoppingItemFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type DeleteShoppingItemMutationVariables = Exact<{
  input: DeleteShoppingItemInput;
}>;


export type DeleteShoppingItemMutation = { __typename?: 'Mutation', deleteShoppingItem?: { __typename?: 'DeleteShoppingItemResponse', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateShoppingItemMutationVariables = Exact<{
  input: UpdateShoppingItemInput;
}>;


export type UpdateShoppingItemMutation = { __typename?: 'Mutation', updateShoppingItem?: { __typename?: 'ShoppingItemResponse', item?: (
      { __typename?: 'ShoppingItem' }
      & { ' $fragmentRefs'?: { 'ShoppingItemFragment': ShoppingItemFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', createTodo?: { __typename?: 'TodoResponse', todo?: (
      { __typename?: 'Todo' }
      & { ' $fragmentRefs'?: { 'TodoFragment': TodoFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type DeleteTodoMutationVariables = Exact<{
  input: DeleteTodoInput;
}>;


export type DeleteTodoMutation = { __typename?: 'Mutation', deleteTodo?: { __typename?: 'DeleteTodoResponse', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateTodoMutationVariables = Exact<{
  input: UpdateTodoInput;
}>;


export type UpdateTodoMutation = { __typename?: 'Mutation', updateTodo?: { __typename?: 'TodoResponse', todo?: (
      { __typename?: 'Todo' }
      & { ' $fragmentRefs'?: { 'TodoFragment': TodoFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateTripDetailMutationVariables = Exact<{
  input: CreateTripDetailInput;
}>;


export type CreateTripDetailMutation = { __typename?: 'Mutation', createTripDetail?: { __typename?: 'TripDetailResponse', tripDetail?: (
      { __typename?: 'TripDetail' }
      & { ' $fragmentRefs'?: { 'TripDetailFragment': TripDetailFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type DeleteTripDetailMutationVariables = Exact<{
  input: DeleteTripDetailInput;
}>;


export type DeleteTripDetailMutation = { __typename?: 'Mutation', deleteTripDetail?: { __typename?: 'DeleteDetailResponse', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateTripDetailMutationVariables = Exact<{
  input: UpdateTripDetailInput;
}>;


export type UpdateTripDetailMutation = { __typename?: 'Mutation', updateTripDetail: { __typename?: 'TripDetailResponse', tripDetail?: (
      { __typename?: 'TripDetail' }
      & { ' $fragmentRefs'?: { 'TripDetailFragment': TripDetailFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateTripDetailsMutationVariables = Exact<{
  input: UpdateTripDetailsInput;
}>;


export type UpdateTripDetailsMutation = { __typename?: 'Mutation', updateTripDetails: { __typename?: 'TripDetailsResponse', tripDetails: Array<(
      { __typename?: 'TripDetail' }
      & { ' $fragmentRefs'?: { 'TripDetailFragment': TripDetailFragment } }
    ) | null>, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type AddFriendMutationVariables = Exact<{
  input: InviteFriendsToTripInput;
}>;


export type AddFriendMutation = { __typename?: 'Mutation', inviteFriendsToTrip: { __typename?: 'TripFriendsResponse', friends?: Array<(
      { __typename?: 'TripFriend', user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'TripFriendFragment': TripFriendFragment } }
    ) | null> | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type RemoveFromTripMutationVariables = Exact<{
  input: RemoveFromTripInput;
}>;


export type RemoveFromTripMutation = { __typename?: 'Mutation', removeFromTrip?: { __typename?: 'RemoveFromTripResponse', success?: boolean | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateTripFriendMutationVariables = Exact<{
  input: UpdateTripFriendInput;
}>;


export type UpdateTripFriendMutation = { __typename?: 'Mutation', updateTripFriend?: { __typename?: 'UpdateTripFriendResponse', tripFriend?: (
      { __typename?: 'TripFriend', trip?: (
        { __typename?: 'Trip', user?: (
          { __typename?: 'User' }
          & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
        ) | null }
        & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
      ) | null, user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'TripFriendFragment': TripFriendFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateTripPackMutationVariables = Exact<{
  input: UpdateTripPackInput;
}>;


export type UpdateTripPackMutation = { __typename?: 'Mutation', updateTripPack: { __typename?: 'UpdateTripPackResponse', pack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreateTripMutationVariables = Exact<{
  input: CreateTripInput;
}>;


export type CreateTripMutation = { __typename?: 'Mutation', createTrip?: { __typename?: 'TripResponse', data?: (
      { __typename?: 'Trip' }
      & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type UpdateTripMutationVariables = Exact<{
  input: UpdateTripInput;
}>;


export type UpdateTripMutation = { __typename?: 'Mutation', updateTrip?: { __typename?: 'TripResponse', data?: (
      { __typename?: 'Trip' }
      & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateUserAnswerMutationVariables = Exact<{
  input: CreateUserAnswerInput;
}>;


export type CreateUserAnswerMutation = { __typename?: 'Mutation', createUserAnswer: { __typename?: 'CreateUserAnswerResponse', userAnswer?: (
      { __typename?: 'UserAnswer' }
      & { ' $fragmentRefs'?: { 'UserAnswerFragment': UserAnswerFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type CreateCheckoutSessionMutationVariables = Exact<{
  input: CreateCheckoutSessionInput;
}>;


export type CreateCheckoutSessionMutation = { __typename?: 'Mutation', createCheckoutSession?: { __typename?: 'CreateCheckoutSessionResponse', session?: (
      { __typename?: 'StripeSession' }
      & { ' $fragmentRefs'?: { 'StripeSessionFragment': StripeSessionFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type CreateFreeSubscriptionMutationVariables = Exact<{
  input: CreateFreeSubscriptionInput;
}>;


export type CreateFreeSubscriptionMutation = { __typename?: 'Mutation', createFreeSubscription?: { __typename?: 'CreateFreeSubscriptionResponse', subscription?: (
      { __typename?: 'Subscription' }
      & { ' $fragmentRefs'?: { 'SubscriptionFragment': SubscriptionFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type LoginToForumsMutationVariables = Exact<{
  input: DiscourseInput;
}>;


export type LoginToForumsMutation = { __typename?: 'Mutation', loginToForums: { __typename?: 'DiscoursePayload', success: boolean, redirect?: string | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type ManageSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type ManageSubscriptionMutation = { __typename?: 'Mutation', manageSubscription?: { __typename?: 'ManageSubscriptionResponse', session?: (
      { __typename?: 'StripeSession' }
      & { ' $fragmentRefs'?: { 'StripeSessionFragment': StripeSessionFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type SendWelcomeEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendWelcomeEmailMutation = { __typename?: 'Mutation', sendWelcomeEmail: { __typename?: 'SendWelcomeEmailPayload', success?: boolean | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type SetSessionMutationVariables = Exact<{
  input: SetSessionInput;
}>;


export type SetSessionMutation = { __typename?: 'Mutation', setSession: { __typename?: 'SetSessionPayload', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateAvatarMutationVariables = Exact<{
  input: UpdateAvatarInput;
}>;


export type UpdateAvatarMutation = { __typename?: 'Mutation', updateAvatar: { __typename?: 'UpdateAvatarPayload', user?: (
      { __typename?: 'User' }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdatePasswordMutationVariables = Exact<{
  input: UpdatePasswordInput;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: { __typename?: 'UpdatePasswordPayload', success: boolean, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserPayload', user?: (
      { __typename?: 'User' }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type AllItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllItemsQuery = { __typename?: 'Query', allItems: { __typename?: 'AllItemsResponse', items: Array<(
      { __typename?: 'Item' }
      & { ' $fragmentRefs'?: { 'ItemFragment': ItemFragment } }
    ) | null>, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type ClosetPageQueryVariables = Exact<{
  input?: InputMaybe<ClosetInput>;
}>;


export type ClosetPageQuery = { __typename?: 'Query', closet: { __typename?: 'ClosetPageResponse', packs: Array<(
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null>, selectedPack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type FetchDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchDashboardQuery = { __typename?: 'Query', fetchDashboard: { __typename?: 'DashboardResponse', data?: { __typename?: 'DashboardData', upcomingTrips: Array<(
        { __typename?: 'Trip' }
        & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
      ) | null>, news: Array<(
        { __typename?: 'News' }
        & { ' $fragmentRefs'?: { 'NewsFragment': NewsFragment } }
      ) | null>, friends: Array<(
        { __typename?: 'Friend' }
        & { ' $fragmentRefs'?: { 'FriendFragment': FriendFragment } }
      ) | null>, invitations: Array<(
        { __typename?: 'TripFriend', trip?: (
          { __typename?: 'Trip', user?: (
            { __typename?: 'User' }
            & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
          ) | null }
          & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
        ) | null, user?: (
          { __typename?: 'User' }
          & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
        ) | null }
        & { ' $fragmentRefs'?: { 'TripFriendFragment': TripFriendFragment } }
      ) | null> } | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type FriendsQueryVariables = Exact<{
  input?: InputMaybe<FriendsQueryInput>;
}>;


export type FriendsQuery = { __typename?: 'Query', friends?: { __typename?: 'FriendsResponse', count?: number | null, friends?: Array<(
      { __typename?: 'Friend' }
      & { ' $fragmentRefs'?: { 'FriendFragment': FriendFragment } }
    ) | null> | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'MePayload', user?: (
      { __typename?: 'User', notifications: Array<(
        { __typename?: 'Notification' }
        & { ' $fragmentRefs'?: { 'NotificationFragment': NotificationFragment } }
      )> }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type NotificationsQueryVariables = Exact<{
  input: NotificationsInput;
}>;


export type NotificationsQuery = { __typename?: 'Query', notifications: { __typename?: 'NotificationsPayload', totalCount: number, notifications?: Array<(
      { __typename?: 'Notification' }
      & { ' $fragmentRefs'?: { 'NotificationFragment': NotificationFragment } }
    ) | null> | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type PackQueryVariables = Exact<{
  input: PackInput;
}>;


export type PackQuery = { __typename?: 'Query', pack?: { __typename?: 'PackResponse', pack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type PacksQueryVariables = Exact<{ [key: string]: never; }>;


export type PacksQuery = { __typename?: 'Query', packs?: { __typename?: 'PacksResponse', packs: Array<(
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null>, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type PlanningPageQueryVariables = Exact<{
  input?: InputMaybe<PlanningInput>;
}>;


export type PlanningPageQuery = { __typename?: 'Query', planning?: { __typename?: 'PlanningPageResponse', trips: Array<(
      { __typename?: 'Trip' }
      & { ' $fragmentRefs'?: { 'TripFragment': TripFragment } }
    ) | null>, pack?: (
      { __typename?: 'Pack' }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, tripDetails: Array<(
      { __typename?: 'TripDetail' }
      & { ' $fragmentRefs'?: { 'TripDetailFragment': TripDetailFragment } }
    ) | null>, todos: Array<(
      { __typename?: 'Todo' }
      & { ' $fragmentRefs'?: { 'TodoFragment': TodoFragment } }
    ) | null>, shoppingItems: Array<(
      { __typename?: 'ShoppingItem' }
      & { ' $fragmentRefs'?: { 'ShoppingItemFragment': ShoppingItemFragment } }
    ) | null>, friends: Array<(
      { __typename?: 'TripFriend', user?: (
        { __typename?: 'User' }
        & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'TripFriendFragment': TripFriendFragment } }
    ) | null>, poll?: (
      { __typename?: 'Poll' }
      & { ' $fragmentRefs'?: { 'PollFragment': PollFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } | null };

export type PublicPackQueryVariables = Exact<{
  input: PackInput;
}>;


export type PublicPackQuery = { __typename?: 'Query', publicPack: { __typename?: 'PublicPackResponse', pack?: (
      { __typename?: 'Pack', comments?: Array<(
        { __typename?: 'Comment', user?: (
          { __typename?: 'User' }
          & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
        ) | null, replies: Array<(
          { __typename?: 'Reply', user?: (
            { __typename?: 'User' }
            & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
          ) | null }
          & { ' $fragmentRefs'?: { 'ReplyFragment': ReplyFragment } }
        ) | null> }
        & { ' $fragmentRefs'?: { 'CommentFragment': CommentFragment } }
      ) | null> | null }
      & { ' $fragmentRefs'?: { 'PackFragment': PackFragment } }
    ) | null, user?: (
      { __typename?: 'User' }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type SearchQueryVariables = Exact<{
  input?: InputMaybe<SearchInput>;
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchPayload', count?: number | null, results?: Array<(
      { __typename?: 'User', tripsCount?: number | null, packsCount?: number | null, friend?: (
        { __typename?: 'Friend' }
        & { ' $fragmentRefs'?: { 'FriendFragment': FriendFragment } }
      ) | null }
      & { ' $fragmentRefs'?: { 'BaseUserFragment': BaseUserFragment } }
    ) | null> | null, errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null } };

export type SubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionQuery = { __typename?: 'Query', subscription?: { __typename?: 'SubscriptionResponse', errors?: (
      { __typename?: 'BaseError' }
      & { ' $fragmentRefs'?: { 'BaseErrorFragment': BaseErrorFragment } }
    ) | null, data?: { __typename?: 'SubscriptionResponseData', subscription?: (
        { __typename?: 'StripeSubscription' }
        & { ' $fragmentRefs'?: { 'StripeSubscriptionFragment': StripeSubscriptionFragment } }
      ) | null, billingHistory: Array<(
        { __typename?: 'StripeInvoice' }
        & { ' $fragmentRefs'?: { 'StripeInvoiceFragment': StripeInvoiceFragment } }
      ) | null> } | null } | null };

export const BaseErrorFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<BaseErrorFragment, unknown>;
export const NotificationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<NotificationFragment, unknown>;
export const OnboardingStepFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<OnboardingStepFragment, unknown>;
export const BaseUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<BaseUserFragment, unknown>;
export const CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_customer_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<CustomerFragment, unknown>;
export const CommentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<CommentFragment, unknown>;
export const FriendFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<FriendFragment, unknown>;
export const NewsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"News"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]} as unknown as DocumentNode<NewsFragment, unknown>;
export const AnswerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Answer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<AnswerFragment, unknown>;
export const QuestionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Answer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<QuestionFragment, unknown>;
export const UserAnswerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<UserAnswerFragment, unknown>;
export const PollFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Poll"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Poll"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAnswer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Answer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<PollFragment, unknown>;
export const ReplyFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reply"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Reply"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"comment_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<ReplyFragment, unknown>;
export const ShoppingItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShoppingItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShoppingItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<ShoppingItemFragment, unknown>;
export const StripeSessionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSession"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"return_url"}}]}}]} as unknown as DocumentNode<StripeSessionFragment, unknown>;
export const StripeCustomerAddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCustomerAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomerAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]} as unknown as DocumentNode<StripeCustomerAddressFragment, unknown>;
export const StripeCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}}]} as unknown as DocumentNode<StripeCardFragment, unknown>;
export const StripePaymentMethodDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}}]} as unknown as DocumentNode<StripePaymentMethodDetailsFragment, unknown>;
export const StripeChargeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCharge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCharge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}}]} as unknown as DocumentNode<StripeChargeFragment, unknown>;
export const StripeProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]} as unknown as DocumentNode<StripeProductFragment, unknown>;
export const StripePriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]} as unknown as DocumentNode<StripePriceFragment, unknown>;
export const StripeInvoiceLineItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}}]} as unknown as DocumentNode<StripeInvoiceLineItemFragment, unknown>;
export const StripeInvoiceLineItemDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItemData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}}]} as unknown as DocumentNode<StripeInvoiceLineItemDataFragment, unknown>;
export const StripeInvoiceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCharge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCharge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCharge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItemData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItem"}}]}}]}}]} as unknown as DocumentNode<StripeInvoiceFragment, unknown>;
export const StripeSubscriptionItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}}]} as unknown as DocumentNode<StripeSubscriptionItemFragment, unknown>;
export const StripeSubscriptionItemsDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItemsData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}}]} as unknown as DocumentNode<StripeSubscriptionItemsDataFragment, unknown>;
export const StripeSubscriptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"default_payment_method"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCharge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCharge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItemData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCharge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItemsData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItem"}}]}}]}}]} as unknown as DocumentNode<StripeSubscriptionFragment, unknown>;
export const StripeSubscriptionDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscription"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCharge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCharge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItemData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCharge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItemsData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"default_payment_method"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}}]}}]}}]} as unknown as DocumentNode<StripeSubscriptionDataFragment, unknown>;
export const StripeCustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCustomer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCustomerAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCharge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCharge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItemData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCharge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItemsData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"default_payment_method"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCustomerAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCustomerAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscription"}}]}}]}}]} as unknown as DocumentNode<StripeCustomerFragment, unknown>;
export const ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<ProductFragment, unknown>;
export const PriceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"product_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"interval_count"}},{"kind":"Field","name":{"kind":"Name","value":"trial_period_days"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<PriceFragment, unknown>;
export const SubscriptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Subscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_subscription_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price_id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_at_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"ended_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"trial_start"}},{"kind":"Field","name":{"kind":"Name","value":"trial_end"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Price"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"product_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"interval_count"}},{"kind":"Field","name":{"kind":"Name","value":"trial_period_days"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}}]}}]} as unknown as DocumentNode<SubscriptionFragment, unknown>;
export const TripDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<TripDetailFragment, unknown>;
export const ItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<ItemFragment, unknown>;
export const CategoryItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<CategoryItemFragment, unknown>;
export const CategoryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}}]} as unknown as DocumentNode<CategoryFragment, unknown>;
export const PackFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}}]} as unknown as DocumentNode<PackFragment, unknown>;
export const TripFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<TripFragment, unknown>;
export const TripFriendFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripFriend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripFriend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_invite_on"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<TripFriendFragment, unknown>;
export const TodoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Todo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<TodoFragment, unknown>;
export const CreateAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAnswerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Answer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateAnswerMutation, CreateAnswerMutationVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const CreateCategoryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategoryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategoryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category_item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateCategoryItemMutation, CreateCategoryItemMutationVariables>;
export const DeleteCategoryItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategoryItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCategoryItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategoryItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category_item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteCategoryItemMutation, DeleteCategoryItemMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reply"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reply"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Reply"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"comment_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const UpdateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reply"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reply"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Reply"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"comment_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const InviteFriendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteFriend"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteFriendInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteFriend"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}},{"kind":"Field","name":{"kind":"Name","value":"friend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Friend"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tripsCount"}},{"kind":"Field","name":{"kind":"Name","value":"packsCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<InviteFriendMutation, InviteFriendMutationVariables>;
export const RemoveFriendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFriend"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveFriendInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFriend"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Friend"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<RemoveFriendMutation, RemoveFriendMutationVariables>;
export const RemoveInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}},{"kind":"Field","name":{"kind":"Name","value":"friend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Friend"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tripsCount"}},{"kind":"Field","name":{"kind":"Name","value":"packsCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<RemoveInvitationMutation, RemoveInvitationMutationVariables>;
export const CreateItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"category_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category_item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateItemMutation, CreateItemMutationVariables>;
export const CsvImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CsvImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CsvImportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"csvImport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CsvImportMutation, CsvImportMutationVariables>;
export const DeleteItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteItemMutation, DeleteItemMutationVariables>;
export const UpdateItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateItemMutation, UpdateItemMutationVariables>;
export const MarkAllAsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkAllAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markAllAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<MarkAllAsReadMutation, MarkAllAsReadMutationVariables>;
export const UpdateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNotificationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateNotificationMutation, UpdateNotificationMutationVariables>;
export const CreateOnboardingStepDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOnboardingStep"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnboardStepInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOnboardStep"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onboardingStep"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateOnboardingStepMutation, CreateOnboardingStepMutationVariables>;
export const CreatePackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreatePackMutation, CreatePackMutationVariables>;
export const UpdatePackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdatePackMutation, UpdatePackMutationVariables>;
export const CreatePollDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePoll"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePollInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPoll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Poll"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Answer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Poll"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Poll"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAnswer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreatePollMutation, CreatePollMutationVariables>;
export const RemovePollDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePoll"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemovePollInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePoll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<RemovePollMutation, RemovePollMutationVariables>;
export const CreateReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateReplyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reply"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reply"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Reply"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"comment_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateReplyMutation, CreateReplyMutationVariables>;
export const DeleteReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteReplyMutation, DeleteReplyMutationVariables>;
export const UpdateReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateReplyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reply"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reply"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Reply"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"comment_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateReplyMutation, UpdateReplyMutationVariables>;
export const CreateShoppingItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShoppingItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateShoppingItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShoppingItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShoppingItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShoppingItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShoppingItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateShoppingItemMutation, CreateShoppingItemMutationVariables>;
export const DeleteShoppingItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteShoppingItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteShoppingItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteShoppingItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteShoppingItemMutation, DeleteShoppingItemMutationVariables>;
export const UpdateShoppingItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateShoppingItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateShoppingItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateShoppingItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShoppingItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShoppingItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShoppingItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateShoppingItemMutation, UpdateShoppingItemMutationVariables>;
export const CreateTodoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTodo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTodoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTodo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Todo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Todo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateTodoMutation, CreateTodoMutationVariables>;
export const DeleteTodoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTodo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTodoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTodo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteTodoMutation, DeleteTodoMutationVariables>;
export const UpdateTodoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTodo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTodoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTodo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Todo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Todo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateTodoMutation, UpdateTodoMutationVariables>;
export const CreateTripDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTripDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTripDetailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTripDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tripDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripDetail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateTripDetailMutation, CreateTripDetailMutationVariables>;
export const DeleteTripDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTripDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTripDetailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTripDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<DeleteTripDetailMutation, DeleteTripDetailMutationVariables>;
export const UpdateTripDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTripDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTripDetailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTripDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tripDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripDetail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateTripDetailMutation, UpdateTripDetailMutationVariables>;
export const UpdateTripDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTripDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTripDetailsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTripDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tripDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripDetail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateTripDetailsMutation, UpdateTripDetailsMutationVariables>;
export const AddFriendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFriend"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteFriendsToTripInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteFriendsToTrip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripFriend"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripFriend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripFriend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_invite_on"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<AddFriendMutation, AddFriendMutationVariables>;
export const RemoveFromTripDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromTrip"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveFromTripInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromTrip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<RemoveFromTripMutation, RemoveFromTripMutationVariables>;
export const UpdateTripFriendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTripFriend"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTripFriendInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTripFriend"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tripFriend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripFriend"}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripFriend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripFriend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_invite_on"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateTripFriendMutation, UpdateTripFriendMutationVariables>;
export const UpdateTripPackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTripPack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTripPackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTripPack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateTripPackMutation, UpdateTripPackMutationVariables>;
export const CreateTripDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTrip"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTripInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTrip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateTripMutation, CreateTripMutationVariables>;
export const UpdateTripDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTrip"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTripInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTrip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateTripMutation, UpdateTripMutationVariables>;
export const CreateUserAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserAnswerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAnswer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAnswer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateUserAnswerMutation, CreateUserAnswerMutationVariables>;
export const CreateCheckoutSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCheckoutSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCheckoutSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCheckoutSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSession"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSession"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"return_url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateCheckoutSessionMutation, CreateCheckoutSessionMutationVariables>;
export const CreateFreeSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFreeSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFreeSubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFreeSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Subscription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Price"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Price"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"product_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"interval_count"}},{"kind":"Field","name":{"kind":"Name","value":"trial_period_days"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Subscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_subscription_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price_id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_at_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"ended_at"}},{"kind":"Field","name":{"kind":"Name","value":"cancel_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"trial_start"}},{"kind":"Field","name":{"kind":"Name","value":"trial_end"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Price"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateFreeSubscriptionMutation, CreateFreeSubscriptionMutationVariables>;
export const LoginToForumsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginToForums"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DiscourseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginToForums"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"redirect"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<LoginToForumsMutation, LoginToForumsMutationVariables>;
export const ManageSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manageSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSession"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSession"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"return_url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<ManageSubscriptionMutation, ManageSubscriptionMutationVariables>;
export const SendWelcomeEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendWelcomeEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendWelcomeEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<SendWelcomeEmailMutation, SendWelcomeEmailMutationVariables>;
export const SetSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<SetSessionMutation, SetSessionMutationVariables>;
export const UpdateAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAvatarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateAvatarMutation, UpdateAvatarMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const AllItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<AllItemsQuery, AllItemsQueryVariables>;
export const ClosetPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClosetPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClosetInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"selectedPack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<ClosetPageQuery, ClosetPageQueryVariables>;
export const FetchDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upcomingTrips"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"news"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"News"}}]}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Friend"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripFriend"}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"News"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"News"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripFriend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripFriend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_invite_on"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<FetchDashboardQuery, FetchDashboardQueryVariables>;
export const FriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Friends"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FriendsQueryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Friend"}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<FriendsQuery, FriendsQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const NotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<NotificationsQuery, NotificationsQueryVariables>;
export const PackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Pack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<PackQuery, PackQueryVariables>;
export const PacksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Packs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<PacksQuery, PacksQueryVariables>;
export const PlanningPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlanningPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlanningInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planning"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trips"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tripDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripDetail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"todos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Todo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shoppingItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShoppingItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TripFriend"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"poll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Poll"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Trip"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Trip"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"starting_point"}},{"kind":"Field","name":{"kind":"Name","value":"ending_point"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"starting_date"}},{"kind":"Field","name":{"kind":"Name","value":"ending_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Answer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"poll_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Todo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Todo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShoppingItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShoppingItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"resource_type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TripFriend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TripFriend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_invite_on"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Trip"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Poll"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Poll"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"trip_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAnswer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<PlanningPageQuery, PlanningPageQueryVariables>;
export const PublicPackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicPack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicPack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pack"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Comment"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reply"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Item"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"generic_type"}},{"kind":"Field","name":{"kind":"Name","value":"consumable"}},{"kind":"Field","name":{"kind":"Name","value":"worn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"item_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Item"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Category"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"category_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pack"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pack"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"allow_comments"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Category"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Comment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"pack_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reply"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Reply"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"comment_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<PublicPackQuery, PublicPackQueryVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}},{"kind":"Field","name":{"kind":"Name","value":"friend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Friend"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tripsCount"}},{"kind":"Field","name":{"kind":"Name","value":"packsCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Notification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"read_on_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardingStep"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"trail_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_level"}},{"kind":"Field","name":{"kind":"Name","value":"measuring_system"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Notification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onboard_date"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding_steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardingStep"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address_1"}},{"kind":"Field","name":{"kind":"Name","value":"address_2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Friend"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Friend"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"friend_id"}},{"kind":"Field","name":{"kind":"Name","value":"invite_sent_on"}},{"kind":"Field","name":{"kind":"Name","value":"invite_accepted_on"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;
export const SubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseError"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoice"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"exp_month"}},{"kind":"Field","name":{"kind":"Name","value":"exp_year"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePaymentMethodDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentMethodDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeCharge"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeCharge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"payment_method_details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeProduct"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripePrice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeProduct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit_amount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoiceLineItemData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeInvoice"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeInvoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount_due"}},{"kind":"Field","name":{"kind":"Name","value":"amount_paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount_remaining"}},{"kind":"Field","name":{"kind":"Name","value":"hosted_invoice_url"}},{"kind":"Field","name":{"kind":"Name","value":"invoice_pdf"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeCharge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoiceLineItemData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscriptionItemsData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseError"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BaseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StripeSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StripeSubscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_end"}},{"kind":"Field","name":{"kind":"Name","value":"current_period_start"}},{"kind":"Field","name":{"kind":"Name","value":"default_payment_method"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripePaymentMethodDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"default_source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"latest_invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeInvoice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StripeSubscriptionItemsData"}}]}}]}}]} as unknown as DocumentNode<SubscriptionQuery, SubscriptionQueryVariables>;