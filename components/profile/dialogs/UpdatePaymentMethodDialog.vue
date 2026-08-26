<script lang="ts" setup="">
  import tailwind from '@/utils/tailwind';
  import type { StripeCardElement } from '@stripe/stripe-js';

  interface Props {
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose', 'onSuccess']);

  const $appStore = useAppStore();
  const acceptsConditions = ref(false);
  const isSubmitting = ref(false);

  const stripe = useStripe();
  const elements = useStripeElements();
  const cardElementRef = ref<HTMLDivElement | null>(null);
  const cardValid = ref(false);
  let cardElement: StripeCardElement | null = null;

  const teardownCardElement = () => {
    if (cardElement) {
      cardElement.destroy();
      cardElement = null;
    }
    cardValid.value = false;
  };

  const setupCardElement = async () => {
    if (!stripe.value || !elements.value || !cardElementRef.value) return;

    teardownCardElement();

    const created = elements.value.create('card', {
      classes: {
        base: 'h-12 py-3.5 px-4 rounded-lg w-full border border-gray-300 focus:border-primary',
        invalid: 'border-red-500',
      },
      style: {
        base: {
          '::placeholder': {
            color: '#aab7c4',
          },
          color: tailwind.theme.colors.primary.DEFAULT,
          fontFamily: '"Lato", Helvetica, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
        },
        invalid: {
          color: tailwind.theme.colors.destructive.DEFAULT,
          iconColor: tailwind.theme.colors.destructive.DEFAULT,
        },
      },
    });
    cardElement = created;
    created.on('change', (event) => {
      cardValid.value = event.complete && !event.error;
    });
    created.mount(cardElementRef.value);
  };

  const handleClose = () => {
    acceptsConditions.value = false;
    teardownCardElement();
    emits('onClose');
  };

  const handleUpdate = async () => {
    if (!acceptsConditions.value || isSubmitting.value || !stripe.value || !cardElement) return;

    try {
      isSubmitting.value = true;

      const { error: createError, paymentMethod } = await stripe.value.createPaymentMethod({
        card: cardElement,
        type: 'card',
      });

      if (createError || !paymentMethod) {
        $appStore.notifyNegative(createError?.message || 'Failed to create payment method.');
        return;
      }

      await $fetch('/api/stripe/payment-method', {
        body: { paymentMethodId: paymentMethod.id },
        method: 'PUT',
      });

      $appStore.notifyPositive('Payment method updated successfully!');
      emits('onSuccess');
      handleClose();
    } catch {
      $appStore.notifyNegative('Failed to update payment method. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };

  watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        setupCardElement();
      });
    } else {
      acceptsConditions.value = false;
      teardownCardElement();
    }
  }, { immediate: true });
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
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
            <typography variant="muted">
              By updating your payment method, all future subscription invoices will be paid using this card.
            </typography>
          </div>
        </div>
      </div>
      <dialog-footer>
        <dialog-close @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="!acceptsConditions || !cardValid || isSubmitting"
          :loading="isSubmitting"
          @click="handleUpdate">
          Update Payment Method
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
