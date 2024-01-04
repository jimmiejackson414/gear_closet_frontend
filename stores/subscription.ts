import { defineStore } from 'pinia';
import { SubscriptionLevel } from '@/types/better';

type State = {
  subscription: any | null;
  subscriptionError: any | null;
}

type Getters = {
  // getters
}

type Actions = {
  createCheckoutSession: (subscriptionLevel: SubscriptionLevel) => Promise<any>;
  createFreeSubscription: (tier: SubscriptionLevel, email: string) => Promise<any>;
  fetchSubscription: () => void;
  manageSubscription: () => Promise<any>;
}

export const useSubscriptionStore = defineStore<'subscription', State, Getters, Actions>('subscription', {
  state () {
    return {
      subscription: null,
      subscriptionError: null,
    };
  },

  getters: {},

  actions: {
    async createCheckoutSession (subscriptionLevel) {
      // const client = useClient();
      // const sdk = getSdk(client);

      // const payload = { input: { subscriptionLevel } };
      // const { createCheckoutSession } = await sdk.CreateCheckoutSession(payload);
      // return createCheckoutSession as CreateCheckoutSessionResponse;
    },
    async createFreeSubscription (tier, email) {
      // const client = useClient();
      // const sdk = getSdk(client);

      // const payload = { input: { email, subscriptionLevel: tier } };
      // const { createFreeSubscription } = await sdk.CreateFreeSubscription(payload);
      // return createFreeSubscription as CreateFreeSubscriptionResponse;
    },
    async fetchSubscription () {
      // const client = useClient();
      // const sdk = getSdk(client);

      // const { subscription } = await sdk.Subscription();

      // if (subscription && !subscription.errors) {
      //   this.subscription = subscription.data as SubscriptionResponseData;
      //   this.subscriptionError = null;
      // } else {
      //   this.subscription = null;
      //   this.subscriptionError = subscription?.errors as BaseError;
      // }
    },

    async manageSubscription () {
      // const client = useClient();
      // const sdk = getSdk(client);

      // const { manageSubscription } = await sdk.ManageSubscription();

      // return manageSubscription as ManageSubscriptionResponse;
    },
  },
});
