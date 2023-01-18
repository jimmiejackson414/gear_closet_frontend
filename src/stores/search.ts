import { defineStore } from 'pinia';
import { useClient } from '@/lib/graphqlRequest';
import { getSdk, User } from '@/generated/types';

type State = {
  results: User[];
  resultCount: number;
  pageLoading: boolean;
};

type Getters = {
  // getters
};

type Actions = {
  addConnection: (id: string) => Promise<void>;
  fetchSearchResults: (query: string | null) => Promise<void>;
  removeInvitation: (id: string) => Promise<void>;
};

export const useSearchStore = defineStore<'search', State, Getters, Actions>(
  'search',
  {
    state () {
      return {
        results: [],
        resultCount: 0,
        pageLoading: false,
      };
    },

    getters: {},

    actions: {
      async addConnection (id) {
        const client = useClient();
        const sdk = getSdk(client);

        const { inviteFriend } = await sdk.InviteFriend({ input: { friend_id: id } });

        if (inviteFriend?.result && !inviteFriend.errors) {
          const index = this.results.findIndex(user => user.id === id);
          if (index > -1) {
            this.results[index] = inviteFriend.result;
          }
        }
      },

      async fetchSearchResults (query) {
        this.pageLoading = true;
        const client = useClient();
        const sdk = getSdk(client);

        const { search } = await sdk.Search({ input: { query } });

        if (search.results && !search?.errors) {
          this.results = search.results as User[];
          this.resultCount = search.count as number;
        }
        this.pageLoading = false;
      },

      async removeInvitation (id) {
        const client = useClient();
        const sdk = getSdk(client);

        const { removeInvitation } = await sdk.RemoveInvitation({ input: { id } });

        if (removeInvitation?.result && !removeInvitation.errors) {
          const index = this.results.findIndex(user => user.id === id);
          if (index > -1) {
            this.results[index] = removeInvitation.result;
          }
        }
      },
    },
  },
);
