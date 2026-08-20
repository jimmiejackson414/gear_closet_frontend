import { loadStripe } from '@stripe/stripe-js/pure';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

/**
 * Shared client Stripe.js instance (publishable key from runtimeConfig).
 */
export function useStripe () {
  const { public: { stripePublishableKey } } = useRuntimeConfig();
  const stripe = useState<Stripe | null>('gc-stripe-js', () => null);

  if (import.meta.client && stripePublishableKey && !stripe.value) {
    loadStripe(stripePublishableKey)
      .then((instance) => {
        stripe.value = instance;
      })
      .catch(() => {});
  }

  return stripe;
}

/**
 * Stripe Elements group for Card Element APIs (`elements.create('card')`).
 */
export function useStripeElements () {
  const stripe = useStripe();
  const elements = shallowRef<StripeElements | null>(null);

  watch(stripe, (instance) => {
    if (instance && !elements.value) {
      elements.value = instance.elements();
    }
  }, { immediate: true });

  return elements;
}
