import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import {
  Answer,
  CreateAnswerInput,
  CreatePollInput,
  CreateShoppingItemInput,
  CreateTodoInput,
  CreateTripDetailInput,
  CreateTripInput,
  CreateUserAnswerInput,
  DetailType,
  FriendsResponse,
  getSdk,
  InviteFriendsToTripInput,
  Maybe,
  Pack,
  PacksResponse,
  PlanningPageResponse,
  Poll,
  RemoveFromTripResponse,
  ShoppingItem,
  Todo,
  Trip,
  TripDetail,
  TripFriend,
  TripsResponse,
  UpdatePackInput,
  UpdateShoppingItemInput,
  UpdateTodoInput,
  UpdateTripDetailInput,
  UpdateTripInput,
} from '@/generated/types';
import { useClient } from '@/lib/graphqlRequest';
import { decrypt, encrypt } from '@/helpers/encryption';

type State = {
  data: PlanningPageResponse | null,
  loading: boolean,
  loadingError: boolean;
  selectedTrip: Trip | null,
};

type Getters = {
  answers(state: State): Maybe<Answer>[],
  hikeDetails(state: State): TripDetail[],
  tripDetails(state: State): TripDetail[],
  friends(state: State): TripFriend[],
  pack(state: State): Pack | null,
  poll(state: State): Poll | null,
  todos(state: State): Todo[],
  shoppingItems(state: State): ShoppingItem[],
  trips(state: State): Trip[],
};

type Actions = {
  addFriends(input: InviteFriendsToTripInput): Promise<void>;
  changePack(pack: Pack): void;
  createAnswer(payload: CreateAnswerInput): Promise<void>;
  createPoll(payload: CreatePollInput): Promise<void>;
  createShoppingItem(newItem: CreateShoppingItemInput): Promise<void>;
  createTrip(newTrip: CreateTripInput): Promise<void>;
  createTripDetail(newDetail: any): Promise<TripDetail | null>;
  createTodo(newTodo: CreateTodoInput): Promise<void>;
  createUserAnswer(payload: CreateUserAnswerInput): Promise<void>;
  deleteShoppingItem(id: number): Promise<void>;
  deleteTripDetail(id: number): Promise<void>;
  deleteTodo(id: number): Promise<void>;
  fetchFriends(): Promise<FriendsResponse>;
  fetchPacks(): Promise<PacksResponse>;
  fetchPageData(tripId?: number): void;
  fetchTrips(): Promise<TripsResponse>;
  removePoll(id: number): Promise<void>;
  toggleLoading(): void;
  removeFromTrip(id: number): Promise<RemoveFromTripResponse>;
  updatePack(input: UpdatePackInput): Promise<void>;
  updateShoppingItem(input: UpdateShoppingItemInput): Promise<void>;
  updateTrip(input: UpdateTripInput): Promise<void>;
  updateTripDetail(input: UpdateTripDetailInput): Promise<void>;
  updateTodo(input: UpdateTodoInput): Promise<void>;
};

export const usePlanningStore = defineStore<'planning', State, Getters, Actions>(
  'planning',
  {
    state () {
      return {
        data: null,
        loading: true,
        loadingError: false,
        selectedTrip: null,
      };
    },

    getters: {
      answers: state => state.data?.poll?.question?.answers ?? [],
      hikeDetails: state => {
        if (!state.data) return [];
        return state.data.tripDetails.filter(d => d!.type === DetailType.Hike) as TripDetail[];
      },
      pack: state => (state.data ? state.data.pack as Pack : null),
      poll: state => (state.data ? state.data.poll as Poll : null),
      tripDetails: state => {
        if (!state.data) return [];
        return state.data.tripDetails.filter(d => d!.type === DetailType.Trip) as TripDetail[];
      },
      friends: state => (state.data ? state.data.friends as TripFriend[] : []),
      todos: state => (state.data ? state.data.todos as Todo[] : []),
      shoppingItems: state => (state.data ? state.data.shoppingItems as ShoppingItem[] : []),
      trips: state => (state.data ? state.data.trips as Trip[] : []),
    },

    actions: {
      async addFriends (input) {
        const client = useClient();
        const sdk = getSdk(client);

        const { inviteFriendsToTrip } = await sdk.AddFriend({ input });

        if (!inviteFriendsToTrip.errors && inviteFriendsToTrip.friends) {
          inviteFriendsToTrip.friends.forEach(friend => this.data?.friends.push(friend));
        }
      },

      async changePack (pack) {
        const client = useClient();
        const sdk = getSdk(client);

        const payload = { input: { trip_id: this.selectedTrip!.id, pack_id: pack.id as number } };
        const { updateTripPack } = await sdk.UpdateTripPack(payload);

        if (!updateTripPack?.errors) {
          this.data!.pack = updateTripPack.pack as Pack;
        }
      },

      async createAnswer (input) {
        const client = useClient();
        const sdk = getSdk(client);

        const { createAnswer } = await sdk.CreateAnswer({ input });

        if (!createAnswer.errors && createAnswer.answer) {
          this.data!.poll!.question!.answers?.push(createAnswer.answer);
        }
      },

      async createPoll (input) {
        const client = useClient();
        const sdk = getSdk(client);

        const { createPoll } = await sdk.CreatePoll({ input });

        if (!createPoll?.errors && createPoll.poll) {
          this.data!.poll = createPoll.poll as Poll;
        }
      },

      async createShoppingItem (newItem: CreateShoppingItemInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const payload = { input: { ...newItem } };

        const { createShoppingItem } = await sdk.CreateShoppingItem(payload);

        if (!createShoppingItem?.errors && createShoppingItem?.item) {
          this.data!.shoppingItems.push(createShoppingItem.item);
        }
      },

      async createTrip (newTrip: CreateTripInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { createTrip } = await sdk.CreateTrip({ input: { ...newTrip } });

        if (!createTrip?.errors && createTrip?.data) {
          this.data!.trips.push(createTrip.data);
          const cookie = encrypt(createTrip.data.id);
          Cookies.set('gc.selected_trip', cookie);
          this.selectedTrip = createTrip.data;
          this.fetchPageData(createTrip.data.id);
        }
      },

      async createTripDetail (newDetail: CreateTripDetailInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { createTripDetail } = await sdk.CreateTripDetail({ input: { ...newDetail } });

        if (!createTripDetail?.errors && createTripDetail?.tripDetail) {
          this.data!.tripDetails.push(createTripDetail.tripDetail);
          return createTripDetail.tripDetail;
        }
        return null;
      },

      async createTodo (newTodo: CreateTodoInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const payload = { input: { ...newTodo } };

        const { createTodo } = await sdk.CreateTodo(payload);

        if (!createTodo?.errors && createTodo?.todo) {
          this.data!.todos.push(createTodo.todo);
        }
      },

      async createUserAnswer (input) {
        const client = useClient();
        const sdk = getSdk(client);

        const { createUserAnswer } = await sdk.CreateUserAnswer({ input });

        if (!createUserAnswer?.errors && createUserAnswer.userAnswer) {
          this.data!.poll?.user_answers?.push(createUserAnswer.userAnswer);
        }
      },

      async deleteShoppingItem (id: number) {
        const client = useClient();
        const sdk = getSdk(client);

        const { deleteShoppingItem } = await sdk.DeleteShoppingItem({ input: { id } });

        if (!deleteShoppingItem?.errors && deleteShoppingItem?.success) {
          const index = this.data!.shoppingItems.findIndex(t => (t as ShoppingItem).id === id);
          this.data!.shoppingItems.splice(index, 1);
        }
      },

      async deleteTripDetail (id: number) {
        const client = useClient();
        const sdk = getSdk(client);

        const { deleteTripDetail } = await sdk.DeleteTripDetail({ input: { id } });

        if (!deleteTripDetail?.errors && deleteTripDetail?.success) {
          const index = this.data!.tripDetails.findIndex(t => (t as TripDetail).id === id);
          this.data!.tripDetails.splice(index, 1);
        }
      },

      async deleteTodo (id: number) {
        const client = useClient();
        const sdk = getSdk(client);

        const { deleteTodo } = await sdk.DeleteTodo({ input: { id } });

        if (!deleteTodo?.errors && deleteTodo?.success) {
          const index = this.data!.todos.findIndex(t => (t as Todo).id === id);
          this.data!.todos.splice(index, 1);
        }
      },

      async fetchFriends () {
        const client = useClient();
        const sdk = getSdk(client);

        const { friends } = await sdk.Friends();

        return friends as FriendsResponse;
      },

      async fetchPacks () {
        const client = useClient();
        const sdk = getSdk(client);

        const { packs: res } = await sdk.Packs();

        return res as PacksResponse;
      },

      async fetchPageData (tripId?: number) {
        const client = useClient();
        const sdk = getSdk(client);

        const payload = { input: { trip_id: tripId } };
        const { planning } = await sdk.PlanningPage(payload);

        if (planning && !planning.errors) {
          this.data = planning;

          const selectedTripCookie = Cookies.get('gc.selected_trip');

          // set initial selectedTrip
          if (selectedTripCookie && !!planning.trips.length) {
            const decrypted = decrypt(selectedTripCookie);
            const foundTrip = planning.trips.find(trip => trip!.id === Number(decrypted));
            if (foundTrip) this.selectedTrip = foundTrip;
          } else if (planning.trips.length) {
            const firstTrip = planning.trips[0] as Trip;
            this.selectedTrip = firstTrip;
            const cookie = encrypt(firstTrip.id);
            Cookies.set('gc.selected_trip', cookie);
          }

          this.loading = false;
        } else {
          this.loadingError = true;
          this.loading = false;
        }
      },

      async fetchTrips () {
        const client = useClient();
        const sdk = getSdk(client);

        const { trips } = await sdk.Trips();

        return trips;
      },

      toggleLoading () {
        this.loading = !this.loading;
      },

      async removeFromTrip (tripId: number) {
        const client = useClient();
        const sdk = getSdk(client);

        const { removeFromTrip } = await sdk.RemoveFromTrip({ input: { tripId } });

        if (!removeFromTrip?.errors && removeFromTrip?.success) {
          const index = this.data!.trips.findIndex(t => (t as Trip).id === tripId);
          this.data!.trips.splice(index, 1);
          this.selectedTrip = this.data?.trips.length ? this.data!.trips[0] as Trip : null;
        }
        return removeFromTrip as RemoveFromTripResponse;
      },

      async removePoll (id) {
        const client = useClient();
        const sdk = getSdk(client);

        const input = { id };
        const { removePoll } = await sdk.RemovePoll({ input });

        if (!removePoll?.errors && removePoll?.success) {
          this.data!.poll = null;
        }
      },

      async updatePack (input: UpdatePackInput) {
        const client = useClient();
        const sdk = getSdk(client);

        try {
          const payload = { id: this.pack?.id as number, input };
          const { updatePack: res } = await sdk.UpdatePack(payload);

          if (!res.errors && res.pack) {
            this.data!.pack = res.pack;
          }
        } catch (err) {
          console.log({ err });
        }
      },

      async updateShoppingItem (input: UpdateShoppingItemInput) {
        const client = useClient();
        const sdk = getSdk(client);

        try {
          const payload = { input };

          // dont want these values updated programmatically
          const { updateShoppingItem } = await sdk.UpdateShoppingItem(payload);

          if (!updateShoppingItem?.errors && updateShoppingItem?.item) {
            // eslint-disable-next-line arrow-body-style
            const index = this.data!.shoppingItems.findIndex(t => {
              return (t as ShoppingItem).id === (updateShoppingItem.item as ShoppingItem).id;
            });
            this.data!.shoppingItems[index] = updateShoppingItem.item;
          }
        } catch (err) {
          console.log({ err });
        }
      },

      async updateTrip (input: UpdateTripInput) {
        const client = useClient();
        const sdk = getSdk(client);

        try {
          const payload = { input };
          const { updateTrip } = await sdk.UpdateTrip(payload);

          if (!updateTrip?.errors && updateTrip?.data) {
            const otherTrips = this.data!.trips.filter(t => (t as Trip).id === input.id);
            this.data!.trips = [...otherTrips, updateTrip.data];
            this.selectedTrip = { ...updateTrip.data };
          }
        } catch (err) {
          console.log({ err });
        }
      },

      async updateTripDetail (input: UpdateTripDetailInput) {
        const client = useClient();
        const sdk = getSdk(client);

        try {
          const payload = { input };

          const { updateTripDetail } = await sdk.UpdateTripDetail(payload);

          if (!updateTripDetail?.errors && updateTripDetail?.tripDetail) {
            const index = this.data!.tripDetails.findIndex(t => (t as TripDetail).id === (updateTripDetail.tripDetail as TripDetail).id);
            this.data!.tripDetails[index] = updateTripDetail.tripDetail;
          }
        } catch (err) {
          console.log({ err });
        }
      },

      async updateTodo (input: UpdateTodoInput) {
        const client = useClient();
        const sdk = getSdk(client);

        try {
          const payload = { input };

          // dont want these values updated programmatically
          const { updateTodo } = await sdk.UpdateTodo(payload);

          if (!updateTodo?.errors && updateTodo?.todo) {
            const index = this.data!.todos.findIndex(t => (t as Todo).id === (updateTodo.todo as Todo).id);
            this.data!.todos[index] = updateTodo.todo;
          }
        } catch (err) {
          console.log({ err });
        }
      },
    },
  },
);
