<script lang="ts" setup="">
  import type { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';

  interface Props {
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const acceptsConditions = ref(false);
  const isSubmitting = ref(false);
  // TODO: Finish the implementation of the UpdatePaymentMethodDialog component
  const handleUpdate = () => {
    console.log('handleUpdate');
  };

  const stripe = useStripe();
  const elements = useStripeElements();
  const cardElementRef = ref<HTMLDivElement | null>(null);
  const cardValid = ref(false);
  let cardElement: StripeCardElement | null = null;
  const setupCardElement = async () => {
    if (!stripe.value || !elements.value) return;

    if (stripe) {
      if (elements && cardElementRef.value) {
        cardElement  = elements.value.create('card', {
          classes: {
            base: 'h-12 py-3.5 px-4 rounded-lg w-full border border-gray-300 focus:border-primary',
            invalid: 'border-red-500',
          },
          style: {
            base: {
              color: tailwind.theme.colors.primary.DEFAULT,
              fontFamily: '"Lato", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: tailwind.theme.colors.destructive.DEFAULT,
              iconColor: tailwind.theme.colors.destructive.DEFAULT,
            },
          },
        });
        cardElement.on('change', (event) => {
          cardValid.value = !event.error;
        });
        cardElement.mount(cardElementRef.value);
      }
    }
  };

  watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
      setupCardElement();
    }
  }, { immediate: true });
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-[450px] lg:max-w-[650px] max-h-[90dvh]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>Update Payment Method</dialog-title>
        <dialog-description>
          Update the payment method associated with your subscription.
        </dialog-description>
      </dialog-header>
      <div class="mt-6 w-full">
        <div ref="cardElementRef" />
        <div class="flex items-top gap-x-2 mt-6">
          <checkbox
            id="accept-checkbox"
            :checked="acceptsConditions"
            @update:checked="acceptsConditions = $event" />
          <div class="gap-1.5 grid leading-none">
            <label
              class="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
              for="accept-checkbox">
              I accept
            </label>
            <p class="text-muted-foreground text-sm">
              By updating your payment method, all future subscription invoices will be paid using this card.
            </p>
          </div>
        </div>
      </div>
      <dialog-footer>
        <dialog-close @click="emits('onClose')">
          Cancel
        </dialog-close>
        <button-root
          :disabled="!acceptsConditions || isSubmitting"
          :loading="isSubmitting"
          @click="handleUpdate">
          Update Payment Method
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>