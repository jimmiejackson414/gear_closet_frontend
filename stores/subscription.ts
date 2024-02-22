import { defineStore } from 'pinia';
import { getStripe } from '@/lib/stripe';
import { SubscriptionLevel, type Database } from '@/types';

type State = {
  subscription: any | null;
  subscriptionError: any | null;
  loading: boolean;
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
      loading: false,
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
      const $appStore = useAppStore();

      try {
        this.loading = true;
        const supabase = useSupabaseClient<Database>();
        const user = useSupabaseUser();

      // fetch customer data from supabase
        const { data, error } = await supabase.from('profiles')
          .select('*, customers!inner(*), subscriptions!inner(*)')
          .eq('id', user.value!.id)
          .maybeSingle();
          console.log({ data, error });

        if (error || !data) throw error;

        // fetch subscriptions from stripe
        // const stripe = getStripe();
        // const subId = data.subscriptions?.[0]?.stripe_subscription_id;
        // const sub = await stripe.subscriptions.retrieve(subId, {
        //   expand: ['latest_invoice.charge', 'latest_invoice.lines.data.price', 'default_payment_method', 'items.data.price.product'],
        // });

        // if (!sub) throw error;

        // fetch invoices from Stripe
        // const invoices = await stripe.invoices.list({
        //   customer: data.customers?.[0]?.stripe_customer_id,
        //   limit: 20,
        //   expand: ['data.charge.payment_method_details.card'],
        // });

        this.subscription = {
          ...data,
          // subscriptions: data.subscriptions,
          // invoices: invoices.data,
          // stripeSubscription: sub,
        };
      } catch (err) {
        console.log({ err });
        $appStore.notifyNegative('Error fetching subscription data');
      } finally {
        this.loading = false;
      }
    },

    async manageSubscription () {
      // const client = useClient();
      // const sdk = getSdk(client);

      // const { manageSubscription } = await sdk.ManageSubscription();

      // return manageSubscription as ManageSubscriptionResponse;
    },
  },
});
