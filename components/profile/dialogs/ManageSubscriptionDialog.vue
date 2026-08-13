<script lang="ts" setup="">
  import { IconCheckCircle, IconHeart } from '#components';
  import { SubscriptionLevel } from "@/types";
  import type { SubscriptionApiResponse } from "@/types/helpers";

  interface Props {
    isOpen: boolean;
    selectedPlan?: SubscriptionLevel;
    subscriptionData: SubscriptionApiResponse;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const activePlan = ref<SubscriptionLevel | undefined>(props.selectedPlan);
  watch(() => props.selectedPlan, (selectedPlan) => {
    activePlan.value = selectedPlan;
  });

  const activeStep = ref(1);
  const steps = [
    { step: 1, title: 'Subscription', icon: IconCheckCircle },
    { step: 2, title: 'Confirm', icon: IconHeart },
  ];

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
    } else {
      return `You're about to downgrade to the ${capitalize(activePlan.value)} Plan. Please note that you will lose access to some features, including the Gear Closet Forums. Your card on file will no longer be charged.`;
    }
  });

  // TODO: Finish the implementation of the ManageSubscriptionDialog component
  const handleConfirm = async () => {
    console.log('handleConfirm') ;
  };

  const handleClose = () => {
    activeStep.value = 1;
    emits('onClose');
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="flex flex-col sm:max-w-[450px] lg:max-w-[650px] max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>Manage Subscription</dialog-title>
      </dialog-header>
      <div class="grow mt-2 w-full overflow-y-auto">
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

            <template v-if="activeStep === 2">
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
        <button-root @click="activeStep === 1 ? activeStep = 2 : handleConfirm()">
          {{ activeStep === 1 ? 'Continue' : 'Confirm' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>