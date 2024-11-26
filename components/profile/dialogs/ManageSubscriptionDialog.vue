<script lang="ts" setup="">
  import { IconCheckCircle, IconHeart } from '#components';
  import { Button as DialogButton, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, Dialog as DialogRoot, DialogTitle, Stepper, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui';
  import { SubscriptionLevel } from "@/types";
  import type { SubscriptionApiResponse } from "@/types/helpers";

  interface Props {
    isOpen: boolean;
    subscriptionData: SubscriptionApiResponse;
  }

  defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const selectedPlan = ref<SubscriptionLevel | undefined>(undefined);
  const activeStep = ref(1);
  const steps = [
    { step: 1, title: 'Subscription', icon: IconCheckCircle },
    { step: 2, title: 'Confirm', icon: IconHeart },
  ];

  const handleConfirm = async () => {
    console.log('handleConfirm') ;
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>Manage Subscription</dialog-title>
        <dialog-description>
          <p class="text-gray-500 text-sm">
            Manage your subscription plan
          </p>
        </dialog-description>
      </dialog-header>
      <div class="mt-6 overflow-y-auto w-full">
        <stepper
          v-model="activeStep"
          class="block w-full">
          <div class="flex flex-start gap-2 w-full">
            <stepper-item
              v-for="step in steps"
              :key="step.step"
              v-slot="{ state }"
              class="flex justify-center items-center flex-col relative w-full"
              :step="step.step">
              <stepper-separator
                v-if="step.step !== steps[steps.length - 1].step"
                class="absolute top-5 right-[calc(-50%+10px)] left-[calc(50%+20px)] bg-muted block group-data-[state=completed]:bg-primary h-0.5 rounded-full shrink-0" />
              <stepper-trigger as-child>
                <dialog-button
                  class="rounded-full shrink-0 z-10"
                  :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                  :disabled="state !== 'active'"
                  size="sm"
                  variant="secondary">
                  <component
                    :is="step.icon"
                    class="h-2 w-2" />
                </dialog-button>
              </stepper-trigger>

              <div class="flex items-center flex-col mt-2 text-center">
                <stepper-title
                  class="font-regular text-sm transition"
                  :class="[state === 'active' && 'text-primary']">
                  {{ step.title }}
                </stepper-title>
              </div>
            </stepper-item>
          </div>

          <div class="flex flex-col gap-4 mt-2 mx-auto w-full">
            <template v-if="activeStep === 1">
              <div
                v-if="subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() === SubscriptionLevel.LIFE"
                class="my-8 text-center">
                <typography class="font-bold text-lg">
                  Good news!
                </typography>
                <typography>
                  You currently have a <span class="font-bold">free lifetime subscription</span> to Gear Closet. This includes everything in the Annual subscription at no cost. You're all set!
                </typography>
              </div>
              <div
                v-else
                class="my-8 text-center">
                <typography class="font-bold text-base-lg">
                  Here's what you've got.
                </typography>
                <typography variant="small">
                  You're currently subscribed to the <span class="font-bold">{{ capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname) }} Plan.</span>
                </typography>
              </div>
              <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
                <subscription-item
                  v-for="tier in tiers"
                  :key="tier.title"
                  :plan="tier"
                  :selected-plan="selectedPlan"
                  @handle-select="selectedPlan = $event" />
              </div>
            </template>

            <template v-if="activeStep === 2">
              Step 2
            </template>
          </div>
        </stepper>
      </div>
      <dialog-footer>
        <dialog-close @click="emits('onClose')">
          Cancel
        </dialog-close>
        <dialog-button @click="activeStep === 1 ? activeStep = 2 : handleConfirm">
          Confirm
        </dialog-button>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>