<script lang="ts" setup="">
  import { IconCheckCircle, IconHeart, IconLock } from '#components';
  import { SubscriptionLevel, type Tables } from "@/types";
  import type { SubscriptionApiResponse } from "@/types/helpers";
  import {
    FREE_PACK_LIMIT,
    FREE_TRIP_LIMIT,
    needsFreeResourcePick,
  } from '@/utils/planLimits';

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

  const downgradeNeedsPick = computed(() =>
    activePlan.value === SubscriptionLevel.FREE
    && needsFreeResourcePick(packs.value, trips.value));

  const steps = computed(() => {
    const base = [
      { step: 1, title: 'Subscription', icon: IconCheckCircle },
    ];
    if (downgradeNeedsPick.value) {
      base.push({ step: 2, title: 'Keep access', icon: IconLock });
      base.push({ step: 3, title: 'Confirm', icon: IconHeart });
    } else {
      base.push({ step: 2, title: 'Confirm', icon: IconHeart });
    }
    return base;
  });

  const confirmStep = computed(() => (downgradeNeedsPick.value ? 3 : 2));
  const pickStep = computed(() => (downgradeNeedsPick.value ? 2 : null));

  const stepTwoCopy = computed(() => {
    const currentPlan = props.subscriptionData.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() as SubscriptionLevel;
    const planLevels = { [SubscriptionLevel.FREE]: 1, [SubscriptionLevel.MONTHLY]: 2, [SubscriptionLevel.ANNUAL]: 3, [SubscriptionLevel.LIFE]: 4 };
    const currentLevel = planLevels[currentPlan];
    const newLevel = planLevels[activePlan.value as SubscriptionLevel];

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
    if (open) await loadResources();
  });

  const handleContinue = async () => {
    if (activeStep.value === 1) {
      if (activePlan.value === SubscriptionLevel.FREE) {
        await loadResources();
      }
      activeStep.value = 2;
      return;
    }
    if (pickStep.value != null && activeStep.value === pickStep.value) {
      activeStep.value = confirmStep.value;
      return;
    }
    await handleConfirm();
  };

  const handleConfirm = async () => {
    if (!activePlan.value || isSubmitting.value || !canConfirm.value) return;

    try {
      isSubmitting.value = true;
      const response = await $fetch<{ ok: boolean }>('/api/stripe/subscription', {
        method: 'PUT',
        body: { newPlan: activePlan.value },
      });

      if (!response?.ok) throw new Error('Subscription update failed');

      if (activePlan.value === SubscriptionLevel.FREE) {
        await $fetch('/api/plan/free-selection', {
          method: 'POST',
          body: {
            packId: packs.value.length ? selectedPackId.value ?? null : null,
            tripId: trips.value.length ? selectedTripId.value ?? null : null,
          },
        });
      } else if (
        activePlan.value === SubscriptionLevel.MONTHLY
        || activePlan.value === SubscriptionLevel.ANNUAL
        || activePlan.value === SubscriptionLevel.LIFE
      ) {
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
                v-if="subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() === SubscriptionLevel.LIFE"
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
                  You're currently subscribed to the <span class="font-bold">{{ capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname) }} Plan.</span>
                </typography>
              </div>
              <div class="gap-4 grid grid-cols-1 lg:grid-cols-3">
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
          Cancel
        </dialog-close>
        <button-root
          :disabled="isSubmitting || (activeStep === confirmStep && !canConfirm)"
          :loading="isSubmitting"
          @click="handleContinue">
          {{ activeStep === confirmStep ? 'Confirm' : 'Continue' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
