<script lang="ts" setup="">
  import { IconCheckCircle, IconHeart, IconLock } from '#components';
  import { SubscriptionLevel, type Tables } from '@/types';
  import {
    FREE_PACK_LIMIT,
    FREE_TRIP_LIMIT,
    isPaidPlanIdentifier,
    needsFreeResourcePick,
  } from '@/utils/planLimits';
  import {
    isFirstPaidUpgrade,
    subscriptionChangeMethod,
  } from '@/utils/subscriptionUpgrade';
  import tailwind from '@/utils/tailwind';
  import type { SubscriptionApiResponse } from '@/types/profile';
  import type { StripeCardElement } from '@stripe/stripe-js';

  interface Props {
    isOpen: boolean;
    selectedPlan?: SubscriptionLevel;
    subscriptionData: SubscriptionApiResponse;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose', 'onSuccess']);

  const $appStore = useAppStore();
  const $userStore = useUserStore();
  const activePlan = ref<SubscriptionLevel | undefined>(props.selectedPlan);
  watch(() => props.selectedPlan, (selectedPlan) => {
    activePlan.value = selectedPlan;
  });

  const activeStep = ref(1);
  const isSubmitting = ref(false);
  const packs = ref<Pick<Tables<'packs'>, 'id' | 'name' | 'locked_at'>[]>([]);
  const trips = ref<Pick<Tables<'trips'>, 'id' | 'name' | 'locked_at'>[]>([]);
  const selectedPackId = ref<number | undefined>(undefined);
  const selectedTripId = ref<number | undefined>(undefined);

  const isLifetimeMember = computed(() =>
    $userStore.currentPlanIdentifier === SubscriptionLevel.LIFE);

  const hasExistingSubscription = computed(() =>
    Boolean(props.subscriptionData.subscriptions?.length));

  const needsPaymentStep = computed(() =>
    isFirstPaidUpgrade(activePlan.value, hasExistingSubscription.value));

  const downgradeNeedsPick = computed(() =>
    activePlan.value === SubscriptionLevel.FREE
    && needsFreeResourcePick(packs.value, trips.value));

  const pickStep = computed(() => (downgradeNeedsPick.value ? 2 : null));

  const paymentStep = computed(() => {
    if (!needsPaymentStep.value) return null;
    return downgradeNeedsPick.value ? 3 : 2;
  });

  const confirmStep = computed(() => {
    let step = 2;
    if (downgradeNeedsPick.value) step++;
    if (needsPaymentStep.value) step++;
    return step;
  });

  const steps = computed(() => {
    if (isLifetimeMember.value) {
      return [{ icon: IconHeart, step: 1, title: 'Subscription' }];
    }
    const base = [
      { icon: IconCheckCircle, step: 1, title: 'Subscription' },
    ];
    let stepNum = 2;
    if (downgradeNeedsPick.value) {
      base.push({ icon: IconLock, step: stepNum++, title: 'Keep access' });
    }
    if (needsPaymentStep.value) {
      base.push({ icon: IconCheckCircle, step: stepNum++, title: 'Payment' });
    }
    base.push({ icon: IconHeart, step: stepNum, title: 'Confirm' });
    return base;
  });

  const stripe = useStripe();
  const elements = useStripeElements();
  const cardElementRef = ref<HTMLDivElement | null>(null);
  const cardValid = ref(false);
  const acceptsPaymentTerms = ref(false);
  let cardElement: StripeCardElement | null = null;

  const teardownCardElement = () => {
    if (cardElement) {
      cardElement.destroy();
      cardElement = null;
    }
    cardValid.value = false;
    acceptsPaymentTerms.value = false;
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

  const stepTwoCopy = computed(() => {
    const stripePlan = props.subscriptionData.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() as SubscriptionLevel | undefined;
    const currentPlan = stripePlan ?? $userStore.currentPlanIdentifier;
    const planLevels = { [SubscriptionLevel.ANNUAL]: 3, [SubscriptionLevel.FREE]: 1, [SubscriptionLevel.LIFE]: 4, [SubscriptionLevel.MONTHLY]: 2 };
    const currentLevel = planLevels[currentPlan];
    const newLevel = planLevels[activePlan.value as SubscriptionLevel];

    if (needsPaymentStep.value) {
      return `You're upgrading to the ${capitalize(activePlan.value)} Plan. Your card will be charged when you confirm, and you'll unlock unlimited packs, trips, and forum access.`;
    }
    if (activePlan.value === SubscriptionLevel.MONTHLY && currentPlan === SubscriptionLevel.ANNUAL ||
      activePlan.value === SubscriptionLevel.ANNUAL && currentPlan === SubscriptionLevel.MONTHLY) {
      return `You're about to switch to the ${capitalize(activePlan.value)} Plan. Your card on file will be charged immediately, and your next billing date will be updated to today. Note that the features remain the same, but the Annual plan offers about a 20% discount compared to the Monthly plan.`;
    } else if (newLevel > currentLevel) {
      return `By upgrading to the ${capitalize(activePlan.value)} Plan, you will gain access to additional features. Your card on file will be charged immediately, and your next billing date will be updated to today.`;
    } else if (activePlan.value === SubscriptionLevel.FREE) {
      return `You're about to downgrade to the Free Plan. You keep one pack and one trip unlocked; any extras stay saved but locked until you upgrade again. Forum access ends, and your card on file will no longer be charged.`;
    }
    return `You're about to downgrade to the ${capitalize(activePlan.value)} Plan. Please note that you will lose access to some features, including the Gear Closet Forums. Your card on file will no longer be charged.`;
  });

  const canConfirm = computed(() => {
    if (!activePlan.value) return false;
    if (downgradeNeedsPick.value) {
      if (packs.value.length > FREE_PACK_LIMIT && selectedPackId.value == null) return false;
      if (trips.value.length > FREE_TRIP_LIMIT && selectedTripId.value == null) return false;
    }
    return true;
  });

  const canContinue = computed(() => {
    if (activeStep.value === 1 && !activePlan.value) return false;
    if (paymentStep.value != null && activeStep.value === paymentStep.value) {
      return cardValid.value && acceptsPaymentTerms.value;
    }
    if (activeStep.value === confirmStep.value) return canConfirm.value;
    return true;
  });

  const loadResources = async () => {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    if (!user.value?.sub) return;

    const [{ data: packRows }, { data: tripRows }] = await Promise.all([
      supabase.from('packs')
        .select('id, name, locked_at')
        .eq('profile_id', user.value.sub)
        .order('created_at', { ascending: true }),
      supabase.from('trips')
        .select('id, name, locked_at')
        .eq('profile_id', user.value.sub)
        .order('created_at', { ascending: true }),
    ]);

    packs.value = packRows ?? [];
    trips.value = tripRows ?? [];

    const packCookie = useCookie('selectedPackId');
    const tripCookie = useCookie('selectedTripId');
    const cookiePackId = packCookie.value ? Number(decrypt(packCookie.value)) : undefined;
    const cookieTripId = tripCookie.value ? Number(decrypt(tripCookie.value)) : undefined;

    selectedPackId.value = packs.value.find((p) => p.id === cookiePackId)?.id
      ?? packs.value.find((p) => !p.locked_at)?.id
      ?? packs.value[0]?.id;
    selectedTripId.value = trips.value.find((t) => t.id === cookieTripId)?.id
      ?? trips.value.find((t) => !t.locked_at)?.id
      ?? trips.value[0]?.id;
  };

  watch(() => props.isOpen, async (open) => {
    if (open) {
      await loadResources();
      return;
    }
    activeStep.value = 1;
    teardownCardElement();
  });

  watch(paymentStep, async (step) => {
    if (step != null && activeStep.value === step && props.isOpen) {
      await nextTick();
      await setupCardElement();
    }
  });

  const attachPaymentMethod = async () => {
    if (!stripe.value || !cardElement) {
      throw new Error('Payment form is not ready');
    }

    const { error: createError, paymentMethod } = await stripe.value.createPaymentMethod({
      card: cardElement,
      type: 'card',
    });

    if (createError || !paymentMethod) {
      throw new Error(createError?.message || 'Failed to create payment method.');
    }

    await $fetch('/api/stripe/payment-method', {
      body: { paymentMethodId: paymentMethod.id },
      method: 'PUT',
    });
  };

  const handleContinue = async () => {
    if (activeStep.value === 1) {
      if (activePlan.value === SubscriptionLevel.FREE) {
        await loadResources();
      }
      if (downgradeNeedsPick.value) {
        activeStep.value = pickStep.value!;
      } else if (needsPaymentStep.value) {
        activeStep.value = paymentStep.value!;
        await nextTick();
        await setupCardElement();
      } else {
        activeStep.value = confirmStep.value;
      }
      return;
    }
    if (pickStep.value != null && activeStep.value === pickStep.value) {
      if (needsPaymentStep.value) {
        activeStep.value = paymentStep.value!;
        await nextTick();
        await setupCardElement();
      } else {
        activeStep.value = confirmStep.value;
      }
      return;
    }
    if (paymentStep.value != null && activeStep.value === paymentStep.value) {
      try {
        isSubmitting.value = true;
        await attachPaymentMethod();
        activeStep.value = confirmStep.value;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save payment method.';
        $appStore.notifyNegative(message);
      } finally {
        isSubmitting.value = false;
      }
      return;
    }
    await handleConfirm();
  };

  const handleConfirm = async () => {
    if (!activePlan.value || isSubmitting.value || !canConfirm.value) return;

    try {
      isSubmitting.value = true;
      const method = subscriptionChangeMethod(activePlan.value, hasExistingSubscription.value);

      if (method === 'POST') {
        await $fetch<{ ok: boolean }>('/api/stripe/subscription', {
          body: { subscription: activePlan.value },
          method: 'POST',
        });
      } else {
        const response = await $fetch<{ ok: boolean }>('/api/stripe/subscription', {
          body: { newPlan: activePlan.value },
          method: 'PUT',
        });
        if (!response?.ok) throw new Error('Subscription update failed');
      }

      if (activePlan.value === SubscriptionLevel.FREE) {
        await $fetch('/api/plan/free-selection', {
          body: {
            packId: packs.value.length ? selectedPackId.value ?? null : null,
            tripId: trips.value.length ? selectedTripId.value ?? null : null,
          },
          method: 'POST',
        });
      } else if (isPaidPlanIdentifier(activePlan.value)) {
        await $fetch('/api/plan/unlock', { method: 'POST' });
      }

      if ($userStore.profile) {
        $userStore.profile.needs_free_resource_selection = false;
      }

      $appStore.notifyPositive('Subscription updated successfully!');
      emits('onSuccess');
      handleClose();
    } catch {
      $appStore.notifyNegative('Failed to update subscription. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleClose = () => {
    activeStep.value = 1;
    teardownCardElement();
    emits('onClose');
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="flex flex-col sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>Manage Subscription</dialog-title>
      </dialog-header>
      <div class="mt-2 w-full overflow-y-auto grow">
        <stepper
          v-model="activeStep"
          class="grid pt-4 w-full">
          <div class="flex flex-start gap-2 w-full">
            <stepper-item
              v-for="step in steps"
              :key="step.step"
              v-slot="{ state }"
              class="relative flex flex-col justify-center items-center w-full"
              :step="step.step">
              <stepper-separator
                v-if="step.step !== steps[steps.length - 1]?.step"
                class="block top-5 right-[calc(-50%+10px)] left-[calc(50%+20px)] absolute bg-muted group-data-[state=completed]:bg-primary rounded-full h-0.5 shrink-0" />
              <stepper-trigger as-child>
                <button-root
                  class="z-10 rounded-full shrink-0"
                  :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                  :disabled="state !== 'active'"
                  size="sm"
                  variant="secondary">
                  <component
                    :is="step.icon"
                    class="w-2 h-2" />
                </button-root>
              </stepper-trigger>

              <div class="flex flex-col items-center mt-2 text-center">
                <stepper-title
                  class="font-regular text-sm transition"
                  :class="[state === 'active' && 'text-primary']">
                  {{ step.title }}
                </stepper-title>
              </div>
            </stepper-item>
          </div>

          <div class="flex flex-col gap-4 mx-auto mt-2 w-full">
            <template v-if="activeStep === 1">
              <div
                v-if="isLifetimeMember"
                class="mt-2 mb-4 text-center">
                <typography class="font-bold text-lg">
                  Good news!
                </typography>
                <typography>
                  You currently have a <span class="font-bold">free lifetime subscription</span> to Gear Closet. This includes everything in the Annual subscription at no cost. You're all set!
                </typography>
              </div>
              <div
                v-else
                class="mt-2 mb-4 text-center">
                <typography class="font-bold text-base-lg">
                  Here's what you've got.
                </typography>
                <typography variant="small">
                  You're currently on the <span class="font-bold">{{ capitalize($userStore.currentPlanIdentifier) }} Plan.</span>
                  <span v-if="subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname">
                    Stripe billing is linked to your {{ capitalize(subscriptionData.subscriptions[0].items.data[0].price.nickname) }} subscription.
                  </span>
                  <span v-else-if="needsPaymentStep || $userStore.currentPlanIdentifier === SubscriptionLevel.FREE">
                    Choose a paid plan below to add billing and unlock unlimited packs, trips, and forums.
                  </span>
                </typography>
              </div>
              <div
                v-if="!isLifetimeMember"
                class="gap-4 grid grid-cols-1 lg:grid-cols-3">
                <subscription-item
                  v-for="tier in tiers"
                  :key="tier.title"
                  :plan="tier"
                  :selected-plan="activePlan"
                  @handle-select="activePlan = $event" />
              </div>
            </template>

            <template v-if="pickStep != null && activeStep === pickStep">
              <div class="mt-2 mb-4 text-center">
                <typography class="font-bold">
                  Choose what stays unlocked
                </typography>
                <typography class="mt-2">
                  Free accounts include {{ FREE_PACK_LIMIT }} pack and {{ FREE_TRIP_LIMIT }} trip. Everything else stays saved and locked until you upgrade again.
                </typography>
              </div>
              <div
                v-if="packs.length > FREE_PACK_LIMIT"
                class="flex flex-col gap-2">
                <typography class="font-bold">
                  Pack to keep
                </typography>
                <select-root
                  :model-value="selectedPackId != null ? String(selectedPackId) : undefined"
                  @update:model-value="selectedPackId = $event ? Number($event) : undefined">
                  <select-trigger>
                    <select-value placeholder="Select a pack" />
                  </select-trigger>
                  <select-content>
                    <select-item
                      v-for="pack in packs"
                      :key="pack.id"
                      :value="String(pack.id)">
                      {{ pack.name }}
                    </select-item>
                  </select-content>
                </select-root>
              </div>
              <div
                v-if="trips.length > FREE_TRIP_LIMIT"
                class="flex flex-col gap-2">
                <typography class="font-bold">
                  Trip to keep
                </typography>
                <select-root
                  :model-value="selectedTripId != null ? String(selectedTripId) : undefined"
                  @update:model-value="selectedTripId = $event ? Number($event) : undefined">
                  <select-trigger>
                    <select-value placeholder="Select a trip" />
                  </select-trigger>
                  <select-content>
                    <select-item
                      v-for="trip in trips"
                      :key="trip.id"
                      :value="String(trip.id)">
                      {{ trip.name }}
                    </select-item>
                  </select-content>
                </select-root>
              </div>
            </template>

            <template v-if="paymentStep != null && activeStep === paymentStep">
              <div class="mt-2 mb-4 text-center">
                <typography class="font-bold">
                  Add a payment method
                </typography>
                <typography class="mt-2">
                  Your card is charged when you confirm the {{ capitalize(activePlan) }} Plan.
                </typography>
              </div>
              <div ref="cardElementRef" />
              <div class="flex items-top gap-x-2">
                <checkbox
                  id="upgrade-payment-checkbox"
                  :checked="acceptsPaymentTerms"
                  @update:checked="acceptsPaymentTerms = $event" />
                <div class="gap-1.5 grid leading-none">
                  <label
                    class="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                    for="upgrade-payment-checkbox">
                    I accept
                  </label>
                  <typography variant="muted">
                    By subscribing, future invoices for this plan will be charged to this card.
                  </typography>
                </div>
              </div>
            </template>

            <template v-if="activeStep === confirmStep">
              <div class="mt-2 mb-8 text-center">
                <typography class="mt-6 mb-3">
                  You've selected the <span class="font-bold">{{ capitalize(activePlan) }}</span> Plan.
                </typography>
                <typography class="mb-3">
                  {{ stepTwoCopy }}
                </typography>
              </div>
            </template>
          </div>
        </stepper>
      </div>
      <dialog-footer>
        <dialog-close
          class=""
          @click="handleClose">
          {{ isLifetimeMember ? 'Close' : 'Cancel' }}
        </dialog-close>
        <button-root
          v-if="!isLifetimeMember"
          :disabled="isSubmitting || !canContinue"
          :loading="isSubmitting"
          @click="handleContinue">
          {{ activeStep === confirmStep ? 'Confirm' : 'Continue' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
