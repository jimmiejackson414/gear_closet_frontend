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
  notifications?: Maybe<Array<Maybe<Notification>>>;
  onboardingSteps?: Maybe<Array<Maybe<OnboardingStep>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
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
  setAuth: SetAuthPayload;
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


export type MutationSetAuthArgs = {
  input: SetAuthInput;
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

export type SetAuthInput = {
  refresh_token: Scalars['String']['input'];
};

export type SetAuthPayload = {
  __typename?: 'SetAuthPayload';
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
  notifications?: Maybe<Array<Maybe<Notification>>>;
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

export type BaseErrorFragment = { __typename?: 'BaseError', path: string, message: string };


export type BaseErrorFragmentVariables = Exact<{ [key: string]: never; }>;

export type BaseUserFragment = { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null };


export type BaseUserFragmentVariables = Exact<{ [key: string]: never; }>;

export type CategoryFragment = { __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> };


export type CategoryFragmentVariables = Exact<{ [key: string]: never; }>;

export type CategoryItemFragment = { __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null };


export type CategoryItemFragmentVariables = Exact<{ [key: string]: never; }>;

export type CustomerFragment = { __typename?: 'Customer', id?: string | null, stripe_customer_id?: string | null, user_id?: string | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null };


export type CustomerFragmentVariables = Exact<{ [key: string]: never; }>;

export type CommentFragment = { __typename?: 'Comment', id: number, text?: string | null, user_id?: string | null, pack_id?: number | null, created_at?: any | null, updated_at?: any | null };


export type CommentFragmentVariables = Exact<{ [key: string]: never; }>;

export type FriendFragment = { __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null };


export type FriendFragmentVariables = Exact<{ [key: string]: never; }>;

export type ItemFragment = { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any };


export type ItemFragmentVariables = Exact<{ [key: string]: never; }>;

export type NewsFragment = { __typename?: 'News', title?: string | null, link?: string | null, description?: string | null, author?: string | null, published?: any | null, created?: any | null, source?: string | null, image?: string | null };


export type NewsFragmentVariables = Exact<{ [key: string]: never; }>;

export type NotificationFragment = { __typename?: 'Notification', id: number, title?: string | null, content?: string | null, user_id: string, read_on_date?: any | null, created_at?: any | null, updated_at?: any | null };


export type NotificationFragmentVariables = Exact<{ [key: string]: never; }>;

export type OnboardingStepFragment = { __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null };


export type OnboardingStepFragmentVariables = Exact<{ [key: string]: never; }>;

export type PackFragment = { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null };


export type PackFragmentVariables = Exact<{ [key: string]: never; }>;

export type PollFragment = { __typename?: 'Poll', id?: number | null, user_id?: string | null, trip_id?: number | null, created_at?: any | null, updated_at?: any | null, question?: { __typename?: 'Question', id?: number | null, title?: string | null, poll_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null, answers?: Array<{ __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, user_answers?: Array<{ __typename?: 'UserAnswer', id?: number | null, answer_id?: number | null, user_id?: string | null, poll_id?: number | null, created_at?: any | null, updated_at?: any | null } | null> | null };


export type PollFragmentVariables = Exact<{ [key: string]: never; }>;

export type QuestionFragment = { __typename?: 'Question', id?: number | null, title?: string | null, poll_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null, answers?: Array<{ __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null } | null> | null };


export type QuestionFragmentVariables = Exact<{ [key: string]: never; }>;

export type AnswerFragment = { __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null };


export type AnswerFragmentVariables = Exact<{ [key: string]: never; }>;

export type UserAnswerFragment = { __typename?: 'UserAnswer', id?: number | null, answer_id?: number | null, user_id?: string | null, poll_id?: number | null, created_at?: any | null, updated_at?: any | null };


export type UserAnswerFragmentVariables = Exact<{ [key: string]: never; }>;

export type PriceFragment = { __typename?: 'Price', id?: string | null, product_id?: string | null, identifier?: SubscriptionLevel | null, active?: boolean | null, description?: string | null, unit_amount?: number | null, currency?: string | null, type?: PricingType | null, interval?: PricingPlanInterval | null, interval_count?: number | null, trial_period_days?: number | null, metadata?: any | null, product?: { __typename?: 'Product', id?: string | null, active?: boolean | null, name?: SubscriptionLevel | null, description?: string | null, image?: string | null, metadata?: any | null } | null };


export type PriceFragmentVariables = Exact<{ [key: string]: never; }>;

export type ProductFragment = { __typename?: 'Product', id?: string | null, active?: boolean | null, name?: SubscriptionLevel | null, description?: string | null, image?: string | null, metadata?: any | null };


export type ProductFragmentVariables = Exact<{ [key: string]: never; }>;

export type ReplyFragment = { __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null };


export type ReplyFragmentVariables = Exact<{ [key: string]: never; }>;

export type ShoppingItemFragment = { __typename?: 'ShoppingItem', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, quantity?: number | null, created_at: any, updated_at: any };


export type ShoppingItemFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeSubscriptionFragment = { __typename?: 'StripeSubscription', id?: string | null, current_period_end?: any | null, current_period_start?: any | null, default_source?: string | null, status?: StripeSubscriptionStatus | null, default_payment_method?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null, latest_invoice?: { __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null } | null, lines?: { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null, items?: { __typename?: 'StripeSubscriptionItemsData', data?: Array<{ __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null };


export type StripeSubscriptionFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeInvoiceFragment = { __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null } | null, lines?: { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null };


export type StripeInvoiceFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeInvoiceLineItemDataFragment = { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null };


export type StripeInvoiceLineItemDataFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeChargeFragment = { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null };


export type StripeChargeFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripePaymentMethodDetailsFragment = { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null };


export type StripePaymentMethodDetailsFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeCardFragment = { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null };


export type StripeCardFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeInvoiceLineItemFragment = { __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null };


export type StripeInvoiceLineItemFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeSubscriptionItemsDataFragment = { __typename?: 'StripeSubscriptionItemsData', data?: Array<{ __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null };


export type StripeSubscriptionItemsDataFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeSubscriptionItemFragment = { __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null };


export type StripeSubscriptionItemFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripePriceFragment = { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null };


export type StripePriceFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeProductFragment = { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null };


export type StripeProductFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeSessionFragment = { __typename?: 'StripeSession', id?: string | null, created?: any | null, url?: string | null, return_url?: string | null };


export type StripeSessionFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeCustomerFragment = { __typename?: 'StripeCustomer', id?: string | null, email?: string | null, address?: { __typename?: 'StripeCustomerAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null, subscriptions?: { __typename?: 'StripeSubscriptionData', data?: Array<{ __typename?: 'StripeSubscription', id?: string | null, current_period_end?: any | null, current_period_start?: any | null, default_source?: string | null, status?: StripeSubscriptionStatus | null, default_payment_method?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null, latest_invoice?: { __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null } | null, lines?: { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null, items?: { __typename?: 'StripeSubscriptionItemsData', data?: Array<{ __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null> | null } | null };


export type StripeCustomerFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeCustomerAddressFragment = { __typename?: 'StripeCustomerAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null };


export type StripeCustomerAddressFragmentVariables = Exact<{ [key: string]: never; }>;

export type StripeSubscriptionDataFragment = { __typename?: 'StripeSubscriptionData', data?: Array<{ __typename?: 'StripeSubscription', id?: string | null, current_period_end?: any | null, current_period_start?: any | null, default_source?: string | null, status?: StripeSubscriptionStatus | null, default_payment_method?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null, latest_invoice?: { __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null } | null, lines?: { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null, items?: { __typename?: 'StripeSubscriptionItemsData', data?: Array<{ __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null> | null };


export type StripeSubscriptionDataFragmentVariables = Exact<{ [key: string]: never; }>;

export type SubscriptionFragment = { __typename?: 'Subscription', id?: string | null, user_id?: string | null, stripe_subscription_id?: string | null, status?: StripeSubscriptionStatus | null, metadata?: any | null, price_id?: string | null, quantity?: number | null, cancel_at_period_end?: boolean | null, created_at?: any | null, current_period_start?: any | null, current_period_end?: any | null, ended_at?: any | null, cancel_at?: any | null, canceled_at?: any | null, trial_start?: any | null, trial_end?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, price?: { __typename?: 'Price', id?: string | null, product_id?: string | null, identifier?: SubscriptionLevel | null, active?: boolean | null, description?: string | null, unit_amount?: number | null, currency?: string | null, type?: PricingType | null, interval?: PricingPlanInterval | null, interval_count?: number | null, trial_period_days?: number | null, metadata?: any | null, product?: { __typename?: 'Product', id?: string | null, active?: boolean | null, name?: SubscriptionLevel | null, description?: string | null, image?: string | null, metadata?: any | null } | null } | null };


export type SubscriptionFragmentVariables = Exact<{ [key: string]: never; }>;

export type TripFragment = { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any };


export type TripFragmentVariables = Exact<{ [key: string]: never; }>;

export type TripDetailFragment = { __typename?: 'TripDetail', id: number, title?: string | null, url?: string | null, value?: string | null, type?: string | null, trip_id: number, created_at: any, updated_at: any };


export type TripDetailFragmentVariables = Exact<{ [key: string]: never; }>;

export type TripFriendFragment = { __typename?: 'TripFriend', id: number, trip_id: number, user_id: string, accepted_invite_on?: any | null, status?: TripFriendStatus | null, created_at: any, updated_at: any, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, trip?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null };


export type TripFriendFragmentVariables = Exact<{ [key: string]: never; }>;

export type TodoFragment = { __typename?: 'Todo', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, created_at: any, updated_at: any };


export type TodoFragmentVariables = Exact<{ [key: string]: never; }>;

export type CreateAnswerMutationVariables = Exact<{
  input: CreateAnswerInput;
}>;


export type CreateAnswerMutation = { __typename?: 'Mutation', createAnswer: { __typename?: 'CreateAnswerResponse', answer?: { __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory?: { __typename?: 'CategoryResponse', category?: { __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory?: { __typename?: 'DeleteCategoryResponse', category?: { __typename?: 'Category', id: number } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory?: { __typename?: 'CategoryResponse', category?: { __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateCategoryItemMutationVariables = Exact<{
  input: CreateCategoryItemInput;
}>;


export type CreateCategoryItemMutation = { __typename?: 'Mutation', createCategoryItem: { __typename?: 'CategoryItemResponse', category_item?: { __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type DeleteCategoryItemMutationVariables = Exact<{
  input: DeleteCategoryItemInput;
}>;


export type DeleteCategoryItemMutation = { __typename?: 'Mutation', deleteCategoryItem?: { __typename?: 'DeleteCategoryItemResponse', category_item?: { __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentResponse', comment?: { __typename?: 'Comment', id: number, text?: string | null, user_id?: string | null, pack_id?: number | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, replies: Array<{ __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null } | null> } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: { __typename?: 'DeleteCommentResponse', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'CommentResponse', comment?: { __typename?: 'Comment', id: number, text?: string | null, user_id?: string | null, pack_id?: number | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, replies: Array<{ __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null> } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type InviteFriendMutationVariables = Exact<{
  input: InviteFriendInput;
}>;


export type InviteFriendMutation = { __typename?: 'Mutation', inviteFriend?: { __typename?: 'InviteFriendResponse', result?: { __typename?: 'User', tripsCount?: number | null, packsCount?: number | null, id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, friend?: { __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type RemoveFriendMutationVariables = Exact<{
  input: RemoveFriendInput;
}>;


export type RemoveFriendMutation = { __typename?: 'Mutation', removeFriend?: { __typename?: 'RemoveFriendResponse', friend?: { __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type RemoveInvitationMutationVariables = Exact<{
  input: RemoveInvitationInput;
}>;


export type RemoveInvitationMutation = { __typename?: 'Mutation', removeInvitation?: { __typename?: 'RemoveInvitationResponse', result?: { __typename?: 'User', tripsCount?: number | null, packsCount?: number | null, id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, friend?: { __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateItemMutationVariables = Exact<{
  category_id: Scalars['Int']['input'];
  input: CreateItemInput;
}>;


export type CreateItemMutation = { __typename?: 'Mutation', createItem: { __typename?: 'CreateItemResponse', category_item?: { __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CsvImportMutationVariables = Exact<{
  input: CsvImportInput;
}>;


export type CsvImportMutation = { __typename?: 'Mutation', csvImport: { __typename?: 'CsvImportResponse', success: boolean, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type DeleteItemMutationVariables = Exact<{
  input: DeleteItemInput;
}>;


export type DeleteItemMutation = { __typename?: 'Mutation', deleteItem: { __typename?: 'DeleteItemResponse', item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateItemMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateItemInput;
}>;


export type UpdateItemMutation = { __typename?: 'Mutation', updateItem?: { __typename?: 'ItemResponse', item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type MarkAllAsReadMutationVariables = Exact<{
  user_id: Scalars['ID']['input'];
}>;


export type MarkAllAsReadMutation = { __typename?: 'Mutation', markAllAsRead: { __typename?: 'MarkAllAsReadPayload', notifications?: Array<{ __typename?: 'Notification', id: number, title?: string | null, content?: string | null, user_id: string, read_on_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateNotificationMutationVariables = Exact<{
  input: UpdateNotificationInput;
}>;


export type UpdateNotificationMutation = { __typename?: 'Mutation', updateNotification: { __typename?: 'UpdateNotificationPayload', notification?: { __typename?: 'Notification', id: number, title?: string | null, content?: string | null, user_id: string, read_on_date?: any | null, created_at?: any | null, updated_at?: any | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreateOnboardingStepMutationVariables = Exact<{
  input: CreateOnboardStepInput;
}>;


export type CreateOnboardingStepMutation = { __typename?: 'Mutation', createOnboardStep?: { __typename?: 'CreateOnboardStepResponse', onboardingStep?: { __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreatePackMutationVariables = Exact<{
  input: CreatePackInput;
}>;


export type CreatePackMutation = { __typename?: 'Mutation', createPack: { __typename?: 'PackResponse', pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdatePackMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdatePackInput;
}>;


export type UpdatePackMutation = { __typename?: 'Mutation', updatePack: { __typename?: 'UpdatePackResponse', pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreatePollMutationVariables = Exact<{
  input: CreatePollInput;
}>;


export type CreatePollMutation = { __typename?: 'Mutation', createPoll: { __typename?: 'CreatePollResponse', poll?: { __typename?: 'Poll', id?: number | null, user_id?: string | null, trip_id?: number | null, created_at?: any | null, updated_at?: any | null, question?: { __typename?: 'Question', id?: number | null, title?: string | null, poll_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null, answers?: Array<{ __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, user_answers?: Array<{ __typename?: 'UserAnswer', id?: number | null, answer_id?: number | null, user_id?: string | null, poll_id?: number | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type RemovePollMutationVariables = Exact<{
  input: RemovePollInput;
}>;


export type RemovePollMutation = { __typename?: 'Mutation', removePoll: { __typename?: 'RemovePollResponse', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreateReplyMutationVariables = Exact<{
  input: CreateReplyInput;
}>;


export type CreateReplyMutation = { __typename?: 'Mutation', createReply: { __typename?: 'ReplyResponse', reply?: { __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type DeleteReplyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteReplyMutation = { __typename?: 'Mutation', deleteReply: { __typename?: 'DeleteReplyResponse', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateReplyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateReplyInput;
}>;


export type UpdateReplyMutation = { __typename?: 'Mutation', updateReply: { __typename?: 'ReplyResponse', reply?: { __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreateShoppingItemMutationVariables = Exact<{
  input: CreateShoppingItemInput;
}>;


export type CreateShoppingItemMutation = { __typename?: 'Mutation', createShoppingItem?: { __typename?: 'ShoppingItemResponse', item?: { __typename?: 'ShoppingItem', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, quantity?: number | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type DeleteShoppingItemMutationVariables = Exact<{
  input: DeleteShoppingItemInput;
}>;


export type DeleteShoppingItemMutation = { __typename?: 'Mutation', deleteShoppingItem?: { __typename?: 'DeleteShoppingItemResponse', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateShoppingItemMutationVariables = Exact<{
  input: UpdateShoppingItemInput;
}>;


export type UpdateShoppingItemMutation = { __typename?: 'Mutation', updateShoppingItem?: { __typename?: 'ShoppingItemResponse', item?: { __typename?: 'ShoppingItem', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, quantity?: number | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', createTodo?: { __typename?: 'TodoResponse', todo?: { __typename?: 'Todo', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type DeleteTodoMutationVariables = Exact<{
  input: DeleteTodoInput;
}>;


export type DeleteTodoMutation = { __typename?: 'Mutation', deleteTodo?: { __typename?: 'DeleteTodoResponse', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateTodoMutationVariables = Exact<{
  input: UpdateTodoInput;
}>;


export type UpdateTodoMutation = { __typename?: 'Mutation', updateTodo?: { __typename?: 'TodoResponse', todo?: { __typename?: 'Todo', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateTripDetailMutationVariables = Exact<{
  input: CreateTripDetailInput;
}>;


export type CreateTripDetailMutation = { __typename?: 'Mutation', createTripDetail?: { __typename?: 'TripDetailResponse', tripDetail?: { __typename?: 'TripDetail', id: number, title?: string | null, url?: string | null, value?: string | null, type?: string | null, trip_id: number, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type DeleteTripDetailMutationVariables = Exact<{
  input: DeleteTripDetailInput;
}>;


export type DeleteTripDetailMutation = { __typename?: 'Mutation', deleteTripDetail?: { __typename?: 'DeleteDetailResponse', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateTripDetailMutationVariables = Exact<{
  input: UpdateTripDetailInput;
}>;


export type UpdateTripDetailMutation = { __typename?: 'Mutation', updateTripDetail: { __typename?: 'TripDetailResponse', tripDetail?: { __typename?: 'TripDetail', id: number, title?: string | null, url?: string | null, value?: string | null, type?: string | null, trip_id: number, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateTripDetailsMutationVariables = Exact<{
  input: UpdateTripDetailsInput;
}>;


export type UpdateTripDetailsMutation = { __typename?: 'Mutation', updateTripDetails: { __typename?: 'TripDetailsResponse', tripDetails: Array<{ __typename?: 'TripDetail', id: number, title?: string | null, url?: string | null, value?: string | null, type?: string | null, trip_id: number, created_at: any, updated_at: any } | null>, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type AddFriendMutationVariables = Exact<{
  input: InviteFriendsToTripInput;
}>;


export type AddFriendMutation = { __typename?: 'Mutation', inviteFriendsToTrip: { __typename?: 'TripFriendsResponse', friends?: Array<{ __typename?: 'TripFriend', id: number, trip_id: number, user_id: string, accepted_invite_on?: any | null, status?: TripFriendStatus | null, created_at: any, updated_at: any, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, trip?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null } | null> | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type RemoveFromTripMutationVariables = Exact<{
  input: RemoveFromTripInput;
}>;


export type RemoveFromTripMutation = { __typename?: 'Mutation', removeFromTrip?: { __typename?: 'RemoveFromTripResponse', success?: boolean | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateTripFriendMutationVariables = Exact<{
  input: UpdateTripFriendInput;
}>;


export type UpdateTripFriendMutation = { __typename?: 'Mutation', updateTripFriend?: { __typename?: 'UpdateTripFriendResponse', tripFriend?: { __typename?: 'TripFriend', id: number, trip_id: number, user_id: string, accepted_invite_on?: any | null, status?: TripFriendStatus | null, created_at: any, updated_at: any, trip?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateTripPackMutationVariables = Exact<{
  input: UpdateTripPackInput;
}>;


export type UpdateTripPackMutation = { __typename?: 'Mutation', updateTripPack: { __typename?: 'UpdateTripPackResponse', pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreateTripMutationVariables = Exact<{
  input: CreateTripInput;
}>;


export type CreateTripMutation = { __typename?: 'Mutation', createTrip?: { __typename?: 'TripResponse', data?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type UpdateTripMutationVariables = Exact<{
  input: UpdateTripInput;
}>;


export type UpdateTripMutation = { __typename?: 'Mutation', updateTrip?: { __typename?: 'TripResponse', data?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateUserAnswerMutationVariables = Exact<{
  input: CreateUserAnswerInput;
}>;


export type CreateUserAnswerMutation = { __typename?: 'Mutation', createUserAnswer: { __typename?: 'CreateUserAnswerResponse', userAnswer?: { __typename?: 'UserAnswer', id?: number | null, answer_id?: number | null, user_id?: string | null, poll_id?: number | null, created_at?: any | null, updated_at?: any | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type CreateCheckoutSessionMutationVariables = Exact<{
  input: CreateCheckoutSessionInput;
}>;


export type CreateCheckoutSessionMutation = { __typename?: 'Mutation', createCheckoutSession?: { __typename?: 'CreateCheckoutSessionResponse', session?: { __typename?: 'StripeSession', id?: string | null, created?: any | null, url?: string | null, return_url?: string | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type CreateFreeSubscriptionMutationVariables = Exact<{
  input: CreateFreeSubscriptionInput;
}>;


export type CreateFreeSubscriptionMutation = { __typename?: 'Mutation', createFreeSubscription?: { __typename?: 'CreateFreeSubscriptionResponse', subscription?: { __typename?: 'Subscription', id?: string | null, user_id?: string | null, stripe_subscription_id?: string | null, status?: StripeSubscriptionStatus | null, metadata?: any | null, price_id?: string | null, quantity?: number | null, cancel_at_period_end?: boolean | null, created_at?: any | null, current_period_start?: any | null, current_period_end?: any | null, ended_at?: any | null, cancel_at?: any | null, canceled_at?: any | null, trial_start?: any | null, trial_end?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, price?: { __typename?: 'Price', id?: string | null, product_id?: string | null, identifier?: SubscriptionLevel | null, active?: boolean | null, description?: string | null, unit_amount?: number | null, currency?: string | null, type?: PricingType | null, interval?: PricingPlanInterval | null, interval_count?: number | null, trial_period_days?: number | null, metadata?: any | null, product?: { __typename?: 'Product', id?: string | null, active?: boolean | null, name?: SubscriptionLevel | null, description?: string | null, image?: string | null, metadata?: any | null } | null } | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type LoginToForumsMutationVariables = Exact<{
  input: DiscourseInput;
}>;


export type LoginToForumsMutation = { __typename?: 'Mutation', loginToForums: { __typename?: 'DiscoursePayload', success: boolean, redirect?: string | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type ManageSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type ManageSubscriptionMutation = { __typename?: 'Mutation', manageSubscription?: { __typename?: 'ManageSubscriptionResponse', session?: { __typename?: 'StripeSession', id?: string | null, created?: any | null, url?: string | null, return_url?: string | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type SendWelcomeEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendWelcomeEmailMutation = { __typename?: 'Mutation', sendWelcomeEmail: { __typename?: 'SendWelcomeEmailPayload', success?: boolean | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type SetAuthMutationVariables = Exact<{
  input: SetAuthInput;
}>;


export type SetAuthMutation = { __typename?: 'Mutation', setAuth: { __typename?: 'SetAuthPayload', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateAvatarMutationVariables = Exact<{
  input: UpdateAvatarInput;
}>;


export type UpdateAvatarMutation = { __typename?: 'Mutation', updateAvatar: { __typename?: 'UpdateAvatarPayload', user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdatePasswordMutationVariables = Exact<{
  input: UpdatePasswordInput;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: { __typename?: 'UpdatePasswordPayload', success: boolean, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserPayload', user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type AllItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllItemsQuery = { __typename?: 'Query', allItems: { __typename?: 'AllItemsResponse', items: Array<{ __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null>, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type ClosetPageQueryVariables = Exact<{
  input?: InputMaybe<ClosetInput>;
}>;


export type ClosetPageQuery = { __typename?: 'Query', closet: { __typename?: 'ClosetPageResponse', packs: Array<{ __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null>, selectedPack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type FetchDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchDashboardQuery = { __typename?: 'Query', fetchDashboard: { __typename?: 'DashboardResponse', data?: { __typename?: 'DashboardData', upcomingTrips: Array<{ __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null>, news: Array<{ __typename?: 'News', title?: string | null, link?: string | null, description?: string | null, author?: string | null, published?: any | null, created?: any | null, source?: string | null, image?: string | null } | null>, friends: Array<{ __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null>, invitations: Array<{ __typename?: 'TripFriend', id: number, trip_id: number, user_id: string, accepted_invite_on?: any | null, status?: TripFriendStatus | null, created_at: any, updated_at: any, trip?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null } | null> } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type FriendsQueryVariables = Exact<{
  input?: InputMaybe<FriendsQueryInput>;
}>;


export type FriendsQuery = { __typename?: 'Query', friends?: { __typename?: 'FriendsResponse', count?: number | null, friends?: Array<{ __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null> | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'MePayload', totalCount?: number | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, notifications?: Array<{ __typename?: 'Notification', id: number, title?: string | null, content?: string | null, user_id: string, read_on_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type NotificationsQueryVariables = Exact<{
  input: NotificationsInput;
}>;


export type NotificationsQuery = { __typename?: 'Query', notifications: { __typename?: 'NotificationsPayload', totalCount: number, notifications?: Array<{ __typename?: 'Notification', id: number, title?: string | null, content?: string | null, user_id: string, read_on_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type PackQueryVariables = Exact<{
  input: PackInput;
}>;


export type PackQuery = { __typename?: 'Query', pack?: { __typename?: 'PackResponse', pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type PacksQueryVariables = Exact<{ [key: string]: never; }>;


export type PacksQuery = { __typename?: 'Query', packs?: { __typename?: 'PacksResponse', packs: Array<{ __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null>, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type PlanningPageQueryVariables = Exact<{
  input?: InputMaybe<PlanningInput>;
}>;


export type PlanningPageQuery = { __typename?: 'Query', planning?: { __typename?: 'PlanningPageResponse', trips: Array<{ __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null>, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, tripDetails: Array<{ __typename?: 'TripDetail', id: number, title?: string | null, url?: string | null, value?: string | null, type?: string | null, trip_id: number, created_at: any, updated_at: any } | null>, todos: Array<{ __typename?: 'Todo', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, created_at: any, updated_at: any } | null>, shoppingItems: Array<{ __typename?: 'ShoppingItem', id: number, title?: string | null, completed?: boolean | null, trip_id: number, resource_type?: ResourceType | null, quantity?: number | null, created_at: any, updated_at: any } | null>, friends: Array<{ __typename?: 'TripFriend', id: number, trip_id: number, user_id: string, accepted_invite_on?: any | null, status?: TripFriendStatus | null, created_at: any, updated_at: any, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, trip?: { __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null } | null>, poll?: { __typename?: 'Poll', id?: number | null, user_id?: string | null, trip_id?: number | null, created_at?: any | null, updated_at?: any | null, question?: { __typename?: 'Question', id?: number | null, title?: string | null, poll_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null, answers?: Array<{ __typename?: 'Answer', id?: number | null, content?: string | null, question_id?: number | null, user_id?: string | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, user_answers?: Array<{ __typename?: 'UserAnswer', id?: number | null, answer_id?: number | null, user_id?: string | null, poll_id?: number | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } | null };

export type PublicPackQueryVariables = Exact<{
  input: PackInput;
}>;


export type PublicPackQuery = { __typename?: 'Query', publicPack: { __typename?: 'PublicPackResponse', pack?: { __typename?: 'Pack', id?: number | null, name?: string | null, user_id?: string | null, theme?: Theme | null, slug?: string | null, private?: boolean | null, allow_comments?: boolean | null, created_at?: any | null, updated_at?: any | null, comments?: Array<{ __typename?: 'Comment', id: number, text?: string | null, user_id?: string | null, pack_id?: number | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, replies: Array<{ __typename?: 'Reply', id: number, user_id?: string | null, comment_id?: number | null, text?: string | null, updated_at?: any | null, created_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null> } | null> | null, categories?: Array<{ __typename?: 'Category', id: number, name?: string | null, pack_id: number, unit?: string | null, slug?: string | null, created_at: any, updated_at: any, category_items: Array<{ __typename?: 'CategoryItem', id: number, category_id: number, item_id: number, position?: number | null, created_at: any, updated_at: any, item?: { __typename?: 'Item', id: number, name?: string | null, weight?: string | null, price: number, generic_type?: string | null, consumable?: boolean | null, worn?: boolean | null, quantity?: number | null, unit?: string | null, slug?: string | null, url?: string | null, user_id: string, created_at: any, updated_at: any } | null } | null> } | null> | null } | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type SearchQueryVariables = Exact<{
  input?: InputMaybe<SearchInput>;
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchPayload', count?: number | null, results?: Array<{ __typename?: 'User', tripsCount?: number | null, packsCount?: number | null, id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, friend?: { __typename?: 'Friend', id?: number | null, user_id?: string | null, friend_id?: string | null, invite_sent_on?: any | null, invite_accepted_on?: any | null, created_at?: any | null, updated_at?: any | null, user?: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, email: string, trail_name?: string | null, role: Role, image?: string | null, subscription_level: SubscriptionLevel, measuring_system: MeasuringSystem, onboard_date?: any | null, address_1?: string | null, address_2?: string | null, city?: string | null, state?: string | null, country?: string | null, location?: string | null, created_at?: any | null, updated_at?: any | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null, onboarding_steps?: Array<{ __typename?: 'OnboardingStep', user_id: string, page: string, completion_date?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null> | null, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export type SubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionQuery = { __typename?: 'Query', subscription?: { __typename?: 'SubscriptionResponse', errors?: { __typename?: 'BaseError', path: string, message: string } | null, data?: { __typename?: 'SubscriptionResponseData', subscription?: { __typename?: 'StripeSubscription', id?: string | null, current_period_end?: any | null, current_period_start?: any | null, default_source?: string | null, status?: StripeSubscriptionStatus | null, default_payment_method?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null, latest_invoice?: { __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null } | null, lines?: { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null, items?: { __typename?: 'StripeSubscriptionItemsData', data?: Array<{ __typename?: 'StripeSubscriptionItem', id?: string | null, created?: any | null, metadata?: any | null, quantity?: number | null, subscription?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null, billingHistory: Array<{ __typename?: 'StripeInvoice', id?: string | null, description?: string | null, total?: number | null, created?: any | null, currency?: string | null, amount_due?: number | null, amount_paid?: number | null, amount_remaining?: number | null, hosted_invoice_url?: string | null, invoice_pdf?: string | null, charge?: { __typename?: 'StripeCharge', id?: string | null, amount?: number | null, created?: any | null, payment_method_details?: { __typename?: 'StripePaymentMethodDetails', card?: { __typename?: 'StripeCard', brand?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null } | null } | null } | null, lines?: { __typename?: 'StripeInvoiceLineItemData', data?: Array<{ __typename?: 'StripeInvoiceLineItem', id?: string | null, amount?: number | null, description?: string | null, price?: { __typename?: 'StripePrice', id?: string | null, created?: any | null, unit_amount?: number | null, product?: { __typename?: 'StripeProduct', id?: string | null, active?: boolean | null, description?: string | null, name?: string | null, created?: any | null } | null } | null } | null> | null } | null } | null> } | null } | null };

export type TripsQueryVariables = Exact<{ [key: string]: never; }>;


export type TripsQuery = { __typename?: 'Query', trips: { __typename?: 'TripsResponse', data: Array<{ __typename?: 'Trip', id: number, name?: string | null, description?: string | null, user_id: string, starting_point?: string | null, ending_point?: string | null, slug?: string | null, coordinates?: any | null, starting_date?: any | null, ending_date?: any | null, created_at: any, updated_at: any } | null>, errors?: { __typename?: 'BaseError', path: string, message: string } | null } };

export const BaseErrorFragmentDoc = /*#__PURE__*/ gql`
    fragment BaseError on BaseError {
  path
  message
}
    `;
export const OnboardingStepFragmentDoc = /*#__PURE__*/ gql`
    fragment OnboardingStep on OnboardingStep {
  user_id
  page
  completion_date
  created_at
  updated_at
}
    `;
export const BaseUserFragmentDoc = /*#__PURE__*/ gql`
    fragment BaseUser on User {
  id
  first_name
  last_name
  email
  trail_name
  role
  image
  subscription_level
  measuring_system
  onboard_date
  onboarding_steps {
    ...OnboardingStep
  }
  address_1
  address_2
  city
  state
  country
  location
  created_at
  updated_at
}
    `;
export const CustomerFragmentDoc = /*#__PURE__*/ gql`
    fragment Customer on Customer {
  id
  stripe_customer_id
  user_id
  user {
    ...BaseUser
  }
}
    `;
export const CommentFragmentDoc = /*#__PURE__*/ gql`
    fragment Comment on Comment {
  id
  text
  user_id
  pack_id
  created_at
  updated_at
}
    `;
export const FriendFragmentDoc = /*#__PURE__*/ gql`
    fragment Friend on Friend {
  id
  user_id
  friend_id
  invite_sent_on
  invite_accepted_on
  created_at
  updated_at
  user {
    ...BaseUser
  }
}
    `;
export const NewsFragmentDoc = /*#__PURE__*/ gql`
    fragment News on News {
  title
  link
  description
  author
  published
  created
  source
  image
}
    `;
export const NotificationFragmentDoc = /*#__PURE__*/ gql`
    fragment Notification on Notification {
  id
  title
  content
  user_id
  read_on_date
  created_at
  updated_at
}
    `;
export const AnswerFragmentDoc = /*#__PURE__*/ gql`
    fragment Answer on Answer {
  id
  content
  question_id
  user_id
  created_at
  updated_at
}
    `;
export const QuestionFragmentDoc = /*#__PURE__*/ gql`
    fragment Question on Question {
  id
  title
  poll_id
  user_id
  created_at
  updated_at
  answers {
    ...Answer
  }
}
    `;
export const UserAnswerFragmentDoc = /*#__PURE__*/ gql`
    fragment UserAnswer on UserAnswer {
  id
  answer_id
  user_id
  poll_id
  created_at
  updated_at
}
    `;
export const PollFragmentDoc = /*#__PURE__*/ gql`
    fragment Poll on Poll {
  id
  user_id
  trip_id
  created_at
  updated_at
  question {
    ...Question
  }
  user_answers {
    ...UserAnswer
  }
}
    `;
export const ReplyFragmentDoc = /*#__PURE__*/ gql`
    fragment Reply on Reply {
  id
  user_id
  comment_id
  text
  updated_at
  created_at
}
    `;
export const ShoppingItemFragmentDoc = /*#__PURE__*/ gql`
    fragment ShoppingItem on ShoppingItem {
  id
  title
  completed
  trip_id
  resource_type
  quantity
  created_at
  updated_at
}
    `;
export const StripeSessionFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeSession on StripeSession {
  id
  created
  url
  return_url
}
    `;
export const StripeCustomerAddressFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeCustomerAddress on StripeCustomerAddress {
  city
  country
  line1
  line2
  postal_code
  state
}
    `;
export const StripeCardFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeCard on StripeCard {
  brand
  last4
  exp_month
  exp_year
}
    `;
export const StripePaymentMethodDetailsFragmentDoc = /*#__PURE__*/ gql`
    fragment StripePaymentMethodDetails on StripePaymentMethodDetails {
  card {
    ...StripeCard
  }
}
    `;
export const StripeChargeFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeCharge on StripeCharge {
  id
  amount
  created
  payment_method_details {
    ...StripePaymentMethodDetails
  }
}
    `;
export const StripeProductFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeProduct on StripeProduct {
  id
  active
  description
  name
  created
}
    `;
export const StripePriceFragmentDoc = /*#__PURE__*/ gql`
    fragment StripePrice on StripePrice {
  id
  created
  product {
    ...StripeProduct
  }
  unit_amount
}
    `;
export const StripeInvoiceLineItemFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeInvoiceLineItem on StripeInvoiceLineItem {
  id
  amount
  description
  price {
    ...StripePrice
  }
}
    `;
export const StripeInvoiceLineItemDataFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeInvoiceLineItemData on StripeInvoiceLineItemData {
  data {
    ...StripeInvoiceLineItem
  }
}
    `;
export const StripeInvoiceFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeInvoice on StripeInvoice {
  id
  description
  total
  created
  currency
  amount_due
  amount_paid
  amount_remaining
  hosted_invoice_url
  invoice_pdf
  charge {
    ...StripeCharge
  }
  lines {
    ...StripeInvoiceLineItemData
  }
}
    `;
export const StripeSubscriptionItemFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeSubscriptionItem on StripeSubscriptionItem {
  id
  created
  metadata
  price {
    ...StripePrice
  }
  quantity
  subscription
}
    `;
export const StripeSubscriptionItemsDataFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeSubscriptionItemsData on StripeSubscriptionItemsData {
  data {
    ...StripeSubscriptionItem
  }
}
    `;
export const StripeSubscriptionFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeSubscription on StripeSubscription {
  id
  current_period_end
  current_period_start
  default_payment_method {
    ...StripePaymentMethodDetails
  }
  default_source
  status
  latest_invoice {
    ...StripeInvoice
  }
  items {
    ...StripeSubscriptionItemsData
  }
}
    `;
export const StripeSubscriptionDataFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeSubscriptionData on StripeSubscriptionData {
  data {
    ...StripeSubscription
  }
}
    `;
export const StripeCustomerFragmentDoc = /*#__PURE__*/ gql`
    fragment StripeCustomer on StripeCustomer {
  id
  address {
    ...StripeCustomerAddress
  }
  email
  subscriptions {
    ...StripeSubscriptionData
  }
}
    `;
export const ProductFragmentDoc = /*#__PURE__*/ gql`
    fragment Product on Product {
  id
  active
  name
  description
  image
  metadata
}
    `;
export const PriceFragmentDoc = /*#__PURE__*/ gql`
    fragment Price on Price {
  id
  product_id
  identifier
  active
  description
  unit_amount
  currency
  type
  interval
  interval_count
  trial_period_days
  metadata
  product {
    ...Product
  }
}
    `;
export const SubscriptionFragmentDoc = /*#__PURE__*/ gql`
    fragment Subscription on Subscription {
  id
  user_id
  stripe_subscription_id
  status
  metadata
  price_id
  quantity
  cancel_at_period_end
  created_at
  current_period_start
  current_period_end
  ended_at
  cancel_at
  canceled_at
  trial_start
  trial_end
  user {
    ...BaseUser
  }
  price {
    ...Price
  }
}
    `;
export const TripDetailFragmentDoc = /*#__PURE__*/ gql`
    fragment TripDetail on TripDetail {
  id
  title
  url
  value
  type
  trip_id
  created_at
  updated_at
}
    `;
export const ItemFragmentDoc = /*#__PURE__*/ gql`
    fragment Item on Item {
  id
  name
  weight
  price
  generic_type
  consumable
  worn
  quantity
  unit
  slug
  url
  user_id
  created_at
  updated_at
}
    `;
export const CategoryItemFragmentDoc = /*#__PURE__*/ gql`
    fragment CategoryItem on CategoryItem {
  id
  category_id
  item_id
  position
  created_at
  updated_at
  item {
    ...Item
  }
}
    `;
export const CategoryFragmentDoc = /*#__PURE__*/ gql`
    fragment Category on Category {
  id
  name
  pack_id
  unit
  slug
  created_at
  updated_at
  category_items {
    ...CategoryItem
  }
}
    `;
export const PackFragmentDoc = /*#__PURE__*/ gql`
    fragment Pack on Pack {
  id
  name
  user_id
  theme
  slug
  private
  allow_comments
  created_at
  updated_at
  categories {
    ...Category
  }
}
    `;
export const TripFragmentDoc = /*#__PURE__*/ gql`
    fragment Trip on Trip {
  id
  name
  description
  user_id
  starting_point
  ending_point
  slug
  coordinates
  starting_date
  ending_date
  created_at
  updated_at
}
    `;
export const TripFriendFragmentDoc = /*#__PURE__*/ gql`
    fragment TripFriend on TripFriend {
  id
  trip_id
  user_id
  accepted_invite_on
  status
  created_at
  updated_at
  pack {
    ...Pack
  }
  user {
    ...BaseUser
  }
  trip {
    ...Trip
  }
}
    `;
export const TodoFragmentDoc = /*#__PURE__*/ gql`
    fragment Todo on Todo {
  id
  title
  completed
  trip_id
  resource_type
  created_at
  updated_at
}
    `;
export const CreateAnswerDocument = /*#__PURE__*/ gql`
    mutation CreateAnswer($input: CreateAnswerInput!) {
  createAnswer(input: $input) {
    answer {
      ...Answer
    }
    errors {
      ...BaseError
    }
  }
}
    ${AnswerFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateCategoryDocument = /*#__PURE__*/ gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    category {
      ...Category
    }
    errors {
      ...BaseError
    }
  }
}
    ${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteCategoryDocument = /*#__PURE__*/ gql`
    mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id) {
    category {
      id
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateCategoryDocument = /*#__PURE__*/ gql`
    mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
  updateCategory(id: $id, input: $input) {
    category {
      ...Category
    }
    errors {
      ...BaseError
    }
  }
}
    ${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateCategoryItemDocument = /*#__PURE__*/ gql`
    mutation CreateCategoryItem($input: CreateCategoryItemInput!) {
  createCategoryItem(input: $input) {
    category_item {
      ...CategoryItem
    }
    errors {
      ...BaseError
    }
  }
}
    ${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteCategoryItemDocument = /*#__PURE__*/ gql`
    mutation DeleteCategoryItem($input: DeleteCategoryItemInput!) {
  deleteCategoryItem(input: $input) {
    category_item {
      id
      category_id
      item_id
      position
      created_at
      updated_at
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const CreateCommentDocument = /*#__PURE__*/ gql`
    mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    comment {
      ...Comment
      user {
        ...BaseUser
      }
      replies {
        ...Reply
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${CommentFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${ReplyFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteCommentDocument = /*#__PURE__*/ gql`
    mutation DeleteComment($id: Int!) {
  deleteComment(id: $id) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateCommentDocument = /*#__PURE__*/ gql`
    mutation UpdateComment($id: Int!, $input: UpdateCommentInput!) {
  updateComment(id: $id, input: $input) {
    comment {
      ...Comment
      user {
        ...BaseUser
      }
      replies {
        ...Reply
        user {
          ...BaseUser
        }
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${CommentFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${ReplyFragmentDoc}
${BaseErrorFragmentDoc}`;
export const InviteFriendDocument = /*#__PURE__*/ gql`
    mutation InviteFriend($input: InviteFriendInput!) {
  inviteFriend(input: $input) {
    result {
      ...BaseUser
      friend {
        ...Friend
      }
      tripsCount
      packsCount
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${FriendFragmentDoc}
${BaseErrorFragmentDoc}`;
export const RemoveFriendDocument = /*#__PURE__*/ gql`
    mutation RemoveFriend($input: RemoveFriendInput!) {
  removeFriend(input: $input) {
    friend {
      ...Friend
    }
    errors {
      ...BaseError
    }
  }
}
    ${FriendFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const RemoveInvitationDocument = /*#__PURE__*/ gql`
    mutation RemoveInvitation($input: RemoveInvitationInput!) {
  removeInvitation(input: $input) {
    result {
      ...BaseUser
      friend {
        ...Friend
      }
      tripsCount
      packsCount
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${FriendFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateItemDocument = /*#__PURE__*/ gql`
    mutation CreateItem($category_id: Int!, $input: CreateItemInput!) {
  createItem(category_id: $category_id, input: $input) {
    category_item {
      ...CategoryItem
    }
    errors {
      ...BaseError
    }
  }
}
    ${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CsvImportDocument = /*#__PURE__*/ gql`
    mutation CsvImport($input: CsvImportInput!) {
  csvImport(input: $input) {
    success
    pack {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteItemDocument = /*#__PURE__*/ gql`
    mutation DeleteItem($input: DeleteItemInput!) {
  deleteItem(input: $input) {
    item {
      ...Item
    }
    errors {
      ...BaseError
    }
  }
}
    ${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdateItemDocument = /*#__PURE__*/ gql`
    mutation UpdateItem($id: Int!, $input: UpdateItemInput!) {
  updateItem(id: $id, input: $input) {
    item {
      ...Item
    }
    errors {
      ...BaseError
    }
  }
}
    ${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const MarkAllAsReadDocument = /*#__PURE__*/ gql`
    mutation MarkAllAsRead($user_id: ID!) {
  markAllAsRead(user_id: $user_id) {
    notifications {
      ...Notification
    }
    errors {
      ...BaseError
    }
  }
}
    ${NotificationFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdateNotificationDocument = /*#__PURE__*/ gql`
    mutation UpdateNotification($input: UpdateNotificationInput!) {
  updateNotification(input: $input) {
    notification {
      ...Notification
    }
    errors {
      ...BaseError
    }
  }
}
    ${NotificationFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateOnboardingStepDocument = /*#__PURE__*/ gql`
    mutation CreateOnboardingStep($input: CreateOnboardStepInput!) {
  createOnboardStep(input: $input) {
    onboardingStep {
      ...OnboardingStep
    }
    errors {
      ...BaseError
    }
  }
}
    ${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreatePackDocument = /*#__PURE__*/ gql`
    mutation CreatePack($input: CreatePackInput!) {
  createPack(input: $input) {
    pack {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdatePackDocument = /*#__PURE__*/ gql`
    mutation UpdatePack($id: Int!, $input: UpdatePackInput!) {
  updatePack(id: $id, input: $input) {
    pack {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreatePollDocument = /*#__PURE__*/ gql`
    mutation CreatePoll($input: CreatePollInput!) {
  createPoll(input: $input) {
    poll {
      ...Poll
    }
    errors {
      ...BaseError
    }
  }
}
    ${PollFragmentDoc}
${QuestionFragmentDoc}
${AnswerFragmentDoc}
${UserAnswerFragmentDoc}
${BaseErrorFragmentDoc}`;
export const RemovePollDocument = /*#__PURE__*/ gql`
    mutation RemovePoll($input: RemovePollInput!) {
  removePoll(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const CreateReplyDocument = /*#__PURE__*/ gql`
    mutation CreateReply($input: CreateReplyInput!) {
  createReply(input: $input) {
    reply {
      ...Reply
      user {
        ...BaseUser
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${ReplyFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteReplyDocument = /*#__PURE__*/ gql`
    mutation DeleteReply($id: Int!) {
  deleteReply(id: $id) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateReplyDocument = /*#__PURE__*/ gql`
    mutation UpdateReply($id: Int!, $input: UpdateReplyInput!) {
  updateReply(id: $id, input: $input) {
    reply {
      ...Reply
      user {
        ...BaseUser
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${ReplyFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateShoppingItemDocument = /*#__PURE__*/ gql`
    mutation CreateShoppingItem($input: CreateShoppingItemInput!) {
  createShoppingItem(input: $input) {
    item {
      ...ShoppingItem
    }
    errors {
      ...BaseError
    }
  }
}
    ${ShoppingItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteShoppingItemDocument = /*#__PURE__*/ gql`
    mutation DeleteShoppingItem($input: DeleteShoppingItemInput!) {
  deleteShoppingItem(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateShoppingItemDocument = /*#__PURE__*/ gql`
    mutation UpdateShoppingItem($input: UpdateShoppingItemInput!) {
  updateShoppingItem(input: $input) {
    item {
      ...ShoppingItem
    }
    errors {
      ...BaseError
    }
  }
}
    ${ShoppingItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateTodoDocument = /*#__PURE__*/ gql`
    mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    todo {
      ...Todo
    }
    errors {
      ...BaseError
    }
  }
}
    ${TodoFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteTodoDocument = /*#__PURE__*/ gql`
    mutation DeleteTodo($input: DeleteTodoInput!) {
  deleteTodo(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateTodoDocument = /*#__PURE__*/ gql`
    mutation UpdateTodo($input: UpdateTodoInput!) {
  updateTodo(input: $input) {
    todo {
      ...Todo
    }
    errors {
      ...BaseError
    }
  }
}
    ${TodoFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateTripDetailDocument = /*#__PURE__*/ gql`
    mutation CreateTripDetail($input: CreateTripDetailInput!) {
  createTripDetail(input: $input) {
    tripDetail {
      ...TripDetail
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripDetailFragmentDoc}
${BaseErrorFragmentDoc}`;
export const DeleteTripDetailDocument = /*#__PURE__*/ gql`
    mutation DeleteTripDetail($input: DeleteTripDetailInput!) {
  deleteTripDetail(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateTripDetailDocument = /*#__PURE__*/ gql`
    mutation UpdateTripDetail($input: UpdateTripDetailInput!) {
  updateTripDetail(input: $input) {
    tripDetail {
      ...TripDetail
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripDetailFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdateTripDetailsDocument = /*#__PURE__*/ gql`
    mutation UpdateTripDetails($input: UpdateTripDetailsInput!) {
  updateTripDetails(input: $input) {
    tripDetails {
      ...TripDetail
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripDetailFragmentDoc}
${BaseErrorFragmentDoc}`;
export const AddFriendDocument = /*#__PURE__*/ gql`
    mutation AddFriend($input: InviteFriendsToTripInput!) {
  inviteFriendsToTrip(input: $input) {
    friends {
      ...TripFriend
      user {
        ...BaseUser
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFriendFragmentDoc}
${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${TripFragmentDoc}
${BaseErrorFragmentDoc}`;
export const RemoveFromTripDocument = /*#__PURE__*/ gql`
    mutation RemoveFromTrip($input: RemoveFromTripInput!) {
  removeFromTrip(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateTripFriendDocument = /*#__PURE__*/ gql`
    mutation UpdateTripFriend($input: UpdateTripFriendInput!) {
  updateTripFriend(input: $input) {
    tripFriend {
      ...TripFriend
      trip {
        ...Trip
        user {
          ...BaseUser
        }
      }
      user {
        ...BaseUser
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFriendFragmentDoc}
${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${TripFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdateTripPackDocument = /*#__PURE__*/ gql`
    mutation UpdateTripPack($input: UpdateTripPackInput!) {
  updateTripPack(input: $input) {
    pack {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateTripDocument = /*#__PURE__*/ gql`
    mutation CreateTrip($input: CreateTripInput!) {
  createTrip(input: $input) {
    data {
      ...Trip
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdateTripDocument = /*#__PURE__*/ gql`
    mutation UpdateTrip($input: UpdateTripInput!) {
  updateTrip(input: $input) {
    data {
      ...Trip
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateUserAnswerDocument = /*#__PURE__*/ gql`
    mutation CreateUserAnswer($input: CreateUserAnswerInput!) {
  createUserAnswer(input: $input) {
    userAnswer {
      ...UserAnswer
    }
    errors {
      ...BaseError
    }
  }
}
    ${UserAnswerFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateCheckoutSessionDocument = /*#__PURE__*/ gql`
    mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
  createCheckoutSession(input: $input) {
    session {
      ...StripeSession
    }
    errors {
      ...BaseError
    }
  }
}
    ${StripeSessionFragmentDoc}
${BaseErrorFragmentDoc}`;
export const CreateFreeSubscriptionDocument = /*#__PURE__*/ gql`
    mutation CreateFreeSubscription($input: CreateFreeSubscriptionInput!) {
  createFreeSubscription(input: $input) {
    subscription {
      ...Subscription
    }
    errors {
      ...BaseError
    }
  }
}
    ${SubscriptionFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${PriceFragmentDoc}
${ProductFragmentDoc}
${BaseErrorFragmentDoc}`;
export const LoginToForumsDocument = /*#__PURE__*/ gql`
    mutation LoginToForums($input: DiscourseInput!) {
  loginToForums(input: $input) {
    success
    redirect
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const ManageSubscriptionDocument = /*#__PURE__*/ gql`
    mutation ManageSubscription {
  manageSubscription {
    session {
      ...StripeSession
    }
    errors {
      ...BaseError
    }
  }
}
    ${StripeSessionFragmentDoc}
${BaseErrorFragmentDoc}`;
export const SendWelcomeEmailDocument = /*#__PURE__*/ gql`
    mutation SendWelcomeEmail {
  sendWelcomeEmail {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const SetAuthDocument = /*#__PURE__*/ gql`
    mutation SetAuth($input: SetAuthInput!) {
  setAuth(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateAvatarDocument = /*#__PURE__*/ gql`
    mutation UpdateAvatar($input: UpdateAvatarInput!) {
  updateAvatar(input: $input) {
    user {
      ...BaseUser
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const UpdatePasswordDocument = /*#__PURE__*/ gql`
    mutation UpdatePassword($input: UpdatePasswordInput!) {
  updatePassword(input: $input) {
    success
    errors {
      ...BaseError
    }
  }
}
    ${BaseErrorFragmentDoc}`;
export const UpdateUserDocument = /*#__PURE__*/ gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    user {
      ...BaseUser
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const AllItemsDocument = /*#__PURE__*/ gql`
    query AllItems {
  allItems {
    items {
      ...Item
    }
    errors {
      ...BaseError
    }
  }
}
    ${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const ClosetPageDocument = /*#__PURE__*/ gql`
    query ClosetPage($input: ClosetInput) {
  closet(input: $input) {
    packs {
      ...Pack
    }
    selectedPack {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const FetchDashboardDocument = /*#__PURE__*/ gql`
    query FetchDashboard {
  fetchDashboard {
    data {
      upcomingTrips {
        ...Trip
      }
      news {
        ...News
      }
      friends {
        ...Friend
      }
      invitations {
        ...TripFriend
        trip {
          ...Trip
          user {
            ...BaseUser
          }
        }
        user {
          ...BaseUser
        }
      }
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFragmentDoc}
${NewsFragmentDoc}
${FriendFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${TripFriendFragmentDoc}
${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const FriendsDocument = /*#__PURE__*/ gql`
    query Friends($input: FriendsQueryInput) {
  friends(input: $input) {
    friends {
      ...Friend
    }
    count
    errors {
      ...BaseError
    }
  }
}
    ${FriendFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${BaseErrorFragmentDoc}`;
export const MeDocument = /*#__PURE__*/ gql`
    query Me {
  me {
    user {
      ...BaseUser
    }
    notifications {
      ...Notification
    }
    totalCount
    errors {
      ...BaseError
    }
  }
}
    ${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${NotificationFragmentDoc}
${BaseErrorFragmentDoc}`;
export const NotificationsDocument = /*#__PURE__*/ gql`
    query Notifications($input: NotificationsInput!) {
  notifications(input: $input) {
    notifications {
      ...Notification
    }
    totalCount
    errors {
      ...BaseError
    }
  }
}
    ${NotificationFragmentDoc}
${BaseErrorFragmentDoc}`;
export const PackDocument = /*#__PURE__*/ gql`
    query Pack($input: PackInput!) {
  pack(input: $input) {
    pack {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const PacksDocument = /*#__PURE__*/ gql`
    query Packs {
  packs {
    packs {
      ...Pack
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${BaseErrorFragmentDoc}`;
export const PlanningPageDocument = /*#__PURE__*/ gql`
    query PlanningPage($input: PlanningInput) {
  planning(input: $input) {
    trips {
      ...Trip
    }
    pack {
      ...Pack
    }
    tripDetails {
      ...TripDetail
    }
    todos {
      ...Todo
    }
    shoppingItems {
      ...ShoppingItem
    }
    friends {
      ...TripFriend
      user {
        ...BaseUser
      }
    }
    poll {
      ...Poll
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFragmentDoc}
${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${TripDetailFragmentDoc}
${TodoFragmentDoc}
${ShoppingItemFragmentDoc}
${TripFriendFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${PollFragmentDoc}
${QuestionFragmentDoc}
${AnswerFragmentDoc}
${UserAnswerFragmentDoc}
${BaseErrorFragmentDoc}`;
export const PublicPackDocument = /*#__PURE__*/ gql`
    query PublicPack($input: PackInput!) {
  publicPack(input: $input) {
    pack {
      ...Pack
      comments {
        ...Comment
        user {
          ...BaseUser
        }
        replies {
          ...Reply
          user {
            ...BaseUser
          }
        }
      }
    }
    user {
      ...BaseUser
    }
    errors {
      ...BaseError
    }
  }
}
    ${PackFragmentDoc}
${CategoryFragmentDoc}
${CategoryItemFragmentDoc}
${ItemFragmentDoc}
${CommentFragmentDoc}
${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${ReplyFragmentDoc}
${BaseErrorFragmentDoc}`;
export const SearchDocument = /*#__PURE__*/ gql`
    query Search($input: SearchInput) {
  search(input: $input) {
    count
    results {
      ...BaseUser
      friend {
        ...Friend
      }
      tripsCount
      packsCount
    }
    errors {
      ...BaseError
    }
  }
}
    ${BaseUserFragmentDoc}
${OnboardingStepFragmentDoc}
${FriendFragmentDoc}
${BaseErrorFragmentDoc}`;
export const SubscriptionDocument = /*#__PURE__*/ gql`
    query Subscription {
  subscription {
    errors {
      ...BaseError
    }
    data {
      subscription {
        ...StripeSubscription
      }
      billingHistory {
        ...StripeInvoice
      }
    }
  }
}
    ${BaseErrorFragmentDoc}
${StripeSubscriptionFragmentDoc}
${StripePaymentMethodDetailsFragmentDoc}
${StripeCardFragmentDoc}
${StripeInvoiceFragmentDoc}
${StripeChargeFragmentDoc}
${StripeInvoiceLineItemDataFragmentDoc}
${StripeInvoiceLineItemFragmentDoc}
${StripePriceFragmentDoc}
${StripeProductFragmentDoc}
${StripeSubscriptionItemsDataFragmentDoc}
${StripeSubscriptionItemFragmentDoc}`;
export const TripsDocument = /*#__PURE__*/ gql`
    query Trips {
  trips {
    data {
      ...Trip
    }
    errors {
      ...BaseError
    }
  }
}
    ${TripFragmentDoc}
${BaseErrorFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk (client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateAnswer (variables: CreateAnswerMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateAnswerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateAnswerMutation>(CreateAnswerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateAnswer', 'mutation');
    },
    CreateCategory (variables: CreateCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCategoryMutation>(CreateCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCategory', 'mutation');
    },
    DeleteCategory (variables: DeleteCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCategoryMutation>(DeleteCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteCategory', 'mutation');
    },
    UpdateCategory (variables: UpdateCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCategoryMutation>(UpdateCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateCategory', 'mutation');
    },
    CreateCategoryItem (variables: CreateCategoryItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCategoryItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCategoryItemMutation>(CreateCategoryItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCategoryItem', 'mutation');
    },
    DeleteCategoryItem (variables: DeleteCategoryItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteCategoryItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCategoryItemMutation>(DeleteCategoryItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteCategoryItem', 'mutation');
    },
    CreateComment (variables: CreateCommentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCommentMutation>(CreateCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateComment', 'mutation');
    },
    DeleteComment (variables: DeleteCommentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCommentMutation>(DeleteCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteComment', 'mutation');
    },
    UpdateComment (variables: UpdateCommentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCommentMutation>(UpdateCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateComment', 'mutation');
    },
    InviteFriend (variables: InviteFriendMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<InviteFriendMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InviteFriendMutation>(InviteFriendDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'InviteFriend', 'mutation');
    },
    RemoveFriend (variables: RemoveFriendMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveFriendMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveFriendMutation>(RemoveFriendDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveFriend', 'mutation');
    },
    RemoveInvitation (variables: RemoveInvitationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveInvitationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveInvitationMutation>(RemoveInvitationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveInvitation', 'mutation');
    },
    CreateItem (variables: CreateItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateItemMutation>(CreateItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateItem', 'mutation');
    },
    CsvImport (variables: CsvImportMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CsvImportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CsvImportMutation>(CsvImportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CsvImport', 'mutation');
    },
    DeleteItem (variables: DeleteItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteItemMutation>(DeleteItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteItem', 'mutation');
    },
    UpdateItem (variables: UpdateItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateItemMutation>(UpdateItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateItem', 'mutation');
    },
    MarkAllAsRead (variables: MarkAllAsReadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MarkAllAsReadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkAllAsReadMutation>(MarkAllAsReadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MarkAllAsRead', 'mutation');
    },
    UpdateNotification (variables: UpdateNotificationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateNotificationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateNotificationMutation>(UpdateNotificationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateNotification', 'mutation');
    },
    CreateOnboardingStep (variables: CreateOnboardingStepMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateOnboardingStepMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateOnboardingStepMutation>(CreateOnboardingStepDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateOnboardingStep', 'mutation');
    },
    CreatePack (variables: CreatePackMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreatePackMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePackMutation>(CreatePackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreatePack', 'mutation');
    },
    UpdatePack (variables: UpdatePackMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdatePackMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePackMutation>(UpdatePackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdatePack', 'mutation');
    },
    CreatePoll (variables: CreatePollMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreatePollMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePollMutation>(CreatePollDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreatePoll', 'mutation');
    },
    RemovePoll (variables: RemovePollMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemovePollMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemovePollMutation>(RemovePollDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemovePoll', 'mutation');
    },
    CreateReply (variables: CreateReplyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateReplyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateReplyMutation>(CreateReplyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateReply', 'mutation');
    },
    DeleteReply (variables: DeleteReplyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteReplyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteReplyMutation>(DeleteReplyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteReply', 'mutation');
    },
    UpdateReply (variables: UpdateReplyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateReplyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateReplyMutation>(UpdateReplyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateReply', 'mutation');
    },
    CreateShoppingItem (variables: CreateShoppingItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateShoppingItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateShoppingItemMutation>(CreateShoppingItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateShoppingItem', 'mutation');
    },
    DeleteShoppingItem (variables: DeleteShoppingItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteShoppingItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteShoppingItemMutation>(DeleteShoppingItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteShoppingItem', 'mutation');
    },
    UpdateShoppingItem (variables: UpdateShoppingItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateShoppingItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateShoppingItemMutation>(UpdateShoppingItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateShoppingItem', 'mutation');
    },
    CreateTodo (variables: CreateTodoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateTodoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTodoMutation>(CreateTodoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateTodo', 'mutation');
    },
    DeleteTodo (variables: DeleteTodoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteTodoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTodoMutation>(DeleteTodoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteTodo', 'mutation');
    },
    UpdateTodo (variables: UpdateTodoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTodoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTodoMutation>(UpdateTodoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTodo', 'mutation');
    },
    CreateTripDetail (variables: CreateTripDetailMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateTripDetailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTripDetailMutation>(CreateTripDetailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateTripDetail', 'mutation');
    },
    DeleteTripDetail (variables: DeleteTripDetailMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteTripDetailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTripDetailMutation>(DeleteTripDetailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteTripDetail', 'mutation');
    },
    UpdateTripDetail (variables: UpdateTripDetailMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTripDetailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTripDetailMutation>(UpdateTripDetailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTripDetail', 'mutation');
    },
    UpdateTripDetails (variables: UpdateTripDetailsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTripDetailsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTripDetailsMutation>(UpdateTripDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTripDetails', 'mutation');
    },
    AddFriend (variables: AddFriendMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddFriendMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddFriendMutation>(AddFriendDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddFriend', 'mutation');
    },
    RemoveFromTrip (variables: RemoveFromTripMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveFromTripMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveFromTripMutation>(RemoveFromTripDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveFromTrip', 'mutation');
    },
    UpdateTripFriend (variables: UpdateTripFriendMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTripFriendMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTripFriendMutation>(UpdateTripFriendDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTripFriend', 'mutation');
    },
    UpdateTripPack (variables: UpdateTripPackMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTripPackMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTripPackMutation>(UpdateTripPackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTripPack', 'mutation');
    },
    CreateTrip (variables: CreateTripMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateTripMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTripMutation>(CreateTripDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateTrip', 'mutation');
    },
    UpdateTrip (variables: UpdateTripMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTripMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTripMutation>(UpdateTripDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTrip', 'mutation');
    },
    CreateUserAnswer (variables: CreateUserAnswerMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateUserAnswerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserAnswerMutation>(CreateUserAnswerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateUserAnswer', 'mutation');
    },
    CreateCheckoutSession (variables: CreateCheckoutSessionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCheckoutSessionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCheckoutSessionMutation>(CreateCheckoutSessionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCheckoutSession', 'mutation');
    },
    CreateFreeSubscription (variables: CreateFreeSubscriptionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateFreeSubscriptionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateFreeSubscriptionMutation>(CreateFreeSubscriptionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateFreeSubscription', 'mutation');
    },
    LoginToForums (variables: LoginToForumsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginToForumsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginToForumsMutation>(LoginToForumsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'LoginToForums', 'mutation');
    },
    ManageSubscription (variables?: ManageSubscriptionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ManageSubscriptionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ManageSubscriptionMutation>(ManageSubscriptionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ManageSubscription', 'mutation');
    },
    SendWelcomeEmail (variables?: SendWelcomeEmailMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SendWelcomeEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendWelcomeEmailMutation>(SendWelcomeEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SendWelcomeEmail', 'mutation');
    },
    SetAuth (variables: SetAuthMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetAuthMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetAuthMutation>(SetAuthDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SetAuth', 'mutation');
    },
    UpdateAvatar (variables: UpdateAvatarMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateAvatarMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateAvatarMutation>(UpdateAvatarDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateAvatar', 'mutation');
    },
    UpdatePassword (variables: UpdatePasswordMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdatePasswordMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePasswordMutation>(UpdatePasswordDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdatePassword', 'mutation');
    },
    UpdateUser (variables: UpdateUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>(UpdateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateUser', 'mutation');
    },
    AllItems (variables?: AllItemsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllItemsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllItemsQuery>(AllItemsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllItems', 'query');
    },
    ClosetPage (variables?: ClosetPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ClosetPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClosetPageQuery>(ClosetPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ClosetPage', 'query');
    },
    FetchDashboard (variables?: FetchDashboardQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FetchDashboardQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchDashboardQuery>(FetchDashboardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FetchDashboard', 'query');
    },
    Friends (variables?: FriendsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FriendsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FriendsQuery>(FriendsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Friends', 'query');
    },
    Me (variables?: MeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeQuery>(MeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Me', 'query');
    },
    Notifications (variables: NotificationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<NotificationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NotificationsQuery>(NotificationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Notifications', 'query');
    },
    Pack (variables: PackQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PackQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PackQuery>(PackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Pack', 'query');
    },
    Packs (variables?: PacksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PacksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PacksQuery>(PacksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Packs', 'query');
    },
    PlanningPage (variables?: PlanningPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PlanningPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlanningPageQuery>(PlanningPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PlanningPage', 'query');
    },
    PublicPack (variables: PublicPackQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PublicPackQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PublicPackQuery>(PublicPackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PublicPack', 'query');
    },
    Search (variables?: SearchQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SearchQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchQuery>(SearchDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Search', 'query');
    },
    Subscription (variables?: SubscriptionQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SubscriptionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubscriptionQuery>(SubscriptionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Subscription', 'query');
    },
    Trips (variables?: TripsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<TripsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TripsQuery>(TripsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Trips', 'query');
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;