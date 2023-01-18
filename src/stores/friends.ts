import { defineStore } from 'pinia';
import { useClient } from '@/lib/graphqlRequest';
import { Friend, FriendsQueryInput, getSdk } from '@/generated/types';

type State = {
  friends: Friend[] | null;
  friendCount: number;
  pageLoading: boolean;
};

type Getters = {
  // getters
};

type Actions = {
  fetchFriends: (input?: FriendsQueryInput) => Promise<void>;
  removeFriend: (id: number) => Promise<void>;
};

export const useFriendsStore = defineStore<'friends', State, Getters, Actions>(
  'friends',
  {
    state () {
      return {
        friends: null,
        friendCount: 0,
        pageLoading: false,
      };
    },

    getters: {},

    actions: {
      async fetchFriends (input) {
        this.pageLoading = true;
        const client = useClient();
        const sdk = getSdk(client);

        const { friends } = await sdk.Friends({ input });

        if (friends?.friends && !friends?.errors) {
          this.friends = friends.friends as Friend[];
          this.friendCount = friends.count as number;
        }
        this.pageLoading = false;
      },

      async removeFriend (id) {
        const client = useClient();
        const sdk = getSdk(client);

        const { removeFriend } = await sdk.RemoveFriend({ input: { id } });
        console.log({ removeFriend });

        if (!removeFriend?.errors) {
          const index = this.friends?.findIndex(friend => friend.id === id) as number;
          this.friends?.splice(index, 1);
        }
      },
    },
  },
);
