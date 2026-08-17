<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import type { FilePondFile } from 'filepond';
  import { useForm } from 'vee-validate';
  import type { FunctionalComponent } from 'vue';
  import * as z from 'zod';
  import { IconAperture, IconCheck, IconCircleUser, IconHeart } from '#components';
  import { useToast } from '@/components/ui/toast/use-toast';
  import { MeasuringSystem, SubscriptionLevel } from '@/types';
  import { pathAfterOnboarding } from '@/utils/authRedirect';
  import { completeOnboardingPlan } from '@/utils/onboarding';
  import tiers, { type Tier } from '@/utils/tiers';

  type StepperState = 'completed' | 'active' | 'inactive';

  /**
   * Global definitions
   */
  const isSubmitting = ref(false);

  /**
   * Stepper Definitions
   */
  const stepIndex = ref(1);
  const steps = [
    {
      step: 1,
      title: 'Upload Avatar',
      description: 'Upload a photo of yourself (optional)',
    },
    {
      step: 2,
      title: 'Account Info',
      description: 'Tell us a little about yourself',
    },
    {
      step: 3,
      title: 'Plan Options',
      description: 'Choose your plan',
    },
  ];

  const icons: Record<number, Record<StepperState, FunctionalComponent>> = {
    1: {
      completed: IconCheck,
      active: IconAperture,
      inactive: IconAperture,
    },
    2: {
      completed: IconCheck,
      active: IconCircleUser,
      inactive: IconCircleUser,
    },
    3: {
      completed: IconCheck,
      active: IconHeart,
      inactive: IconHeart,
    },
  };
  const stepperIcon = (step: keyof typeof icons, state: StepperState) => {
    const stepIcons = icons[step];
    return stepIcons?.[state] ?? IconCheck;
  };

  /**
   * Define the form schema for each step of the onboarding process
   */
  const formSchema = toTypedSchema(z.object({
    first_name: z.string()
      .min(1),
    last_name: z.string()
      .min(1),
    trail_name: z.string()
      .optional(),
    measuring_system: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
  }));

  const $store = useUserStore();
  const $config = useRuntimeConfig();
  const showLifetimePromo = computed(() => $config.public.lifetimePromo === true);
  const { meta, values, errorBag } = useForm({
    initialValues: {
      first_name: $store.profile?.first_name ?? '',
      last_name: $store.profile?.last_name ?? '',
      trail_name: $store.profile?.trail_name ?? '',
      measuring_system: ($store.profile?.measuring_system as MeasuringSystem) ?? MeasuringSystem.IMPERIAL,
    },
    keepValuesOnUnmount: true,
    validationSchema: formSchema,
  });

  /**
   * Handle the avatar upload process
   */
  const { toast } = useToast();
  const avatarFile = ref<FilePondFile | string | null>(null);
  const handleAvatarError = () => {
    return toast({
      title: 'Error',
      description: 'There was an error uploading your avatar. Please try again.',
      variant: 'destructive',
    });
  };

  const handleAvatarUpload = async () => {
    isSubmitting.value = true;
    if (avatarFile.value && typeof avatarFile.value !== 'string') {
      const newAvatar = (avatarFile.value as FilePondFile).file as File;
      const { success } = await $store.updateAvatar(newAvatar);
      if (!success) {
        handleAvatarError();
        isSubmitting.value = false;
        return;
      }
    }
    isSubmitting.value = false;
  };

  /**
   * Handle the profile update process
   */
  const handleUpdateProfile = async () => {
    isSubmitting.value = true;
    const { success } = await $store.updateProfile({ ...values });
    isSubmitting.value = false;
    return { success };
  };

  /**
   * Handle the completion of the onboarding process
   */
  const selectedPlan = ref<Tier | null>(
    tiers.find((tier) => tier.value === SubscriptionLevel.FREE) ?? null,
  );
  const handleCompleteOnboarding = async (plan: SubscriptionLevel | null) => {
    if (!plan) {
      toast({
        title: 'Select a plan',
        description: 'Choose Free, Monthly, or Annual to continue.',
        variant: 'destructive',
      });
      return;
    }

    isSubmitting.value = true;
    try {
      await completeOnboardingPlan({
        plan,
        createPaidSubscription: (paidPlan) => $fetch('/api/stripe/subscription', {
          method: 'POST',
          body: { subscription: paidPlan },
        }),
        markOnboarded: () => $store.updateProfile({
          onboard_date: new Date()
            .toISOString(),
        }),
      });

      const redirectInfo = useSupabaseCookieRedirect();
      await navigateTo(pathAfterOnboarding(redirectInfo.pluck()));
    } catch {
      toast({
        title: 'Error',
        description: 'There was an error completing the onboarding process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleNextStep = async () => {
    if (stepIndex.value === 1) {
      if (avatarFile.value) await handleAvatarUpload();
      stepIndex.value = 2;
    } else if (stepIndex.value === 2) {
      const { success } = await handleUpdateProfile();
      if (success) stepIndex.value = 3;
    }
  };

  const isNextDisabled = ref(false);
  watch(errorBag, () => {
    isNextDisabled.value = (stepIndex.value === 2 && Object.keys(errorBag.value).length > 0);
  });
</script>

<template>
  <stepper
    v-model="stepIndex"
    class="block mx-auto mt-8 w-full max-w-4xl">
    <div class="flex flex-start gap-2 w-full">
      <!-- Stepper Navigation -->
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
            :ref="`step${step.step}Ref`"
            class="z-10 rounded-full shrink-0"
            :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
            :disabled="( state !== 'completed' && !meta.valid ) || isNextDisabled || ( step.step === 3 )"
            size="icon"
            :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
            @click="stepIndex = step.step">
            <component :is="stepperIcon(step.step, state)" />
          </button-root>
        </stepper-trigger>

        <div class="flex flex-col items-center mt-5 text-center">
          <stepper-title
            class="font-semibold text-sm lg:text-base transition"
            :class="[state === 'active' && 'text-primary']">
            {{ step.title }}
          </stepper-title>
          <stepper-description
            class="sr-only md:not-sr-only text-muted-foreground text-xs lg:text-sm transition"
            :class="[state === 'active' && 'text-primary']">
            {{ step.description }}
          </stepper-description>
        </div>
      </stepper-item>
    </div>

    <!-- Stepper Content -->
    <div class="flex flex-col gap-4 mx-auto mt-16 w-full">
      <!-- Step 1: Upload Avatar -->
      <template v-if="stepIndex === 1">
        <client-only>
          <gc-avatar-upload
            classes="max-w-xs mx-auto"
            @handle-add-file="avatarFile = $event"
            @handle-error="handleAvatarError"
            @handle-remove-file="avatarFile = null" />
        </client-only>
      </template>

      <!-- Step 2: Account Info -->
      <template v-if="stepIndex === 2">
        <div class="flex flex-col gap-4 mx-auto w-full max-w-xl">
          <form-field
            v-slot="{ componentField }"
            name="first_name">
            <form-item>
              <form-label>First Name</form-label>
              <form-control>
                <input-root
                  v-bind="componentField"
                  :default-value="values.first_name" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <form-field
            v-slot="{ componentField }"
            name="last_name">
            <form-item>
              <form-label>Last Name</form-label>
              <form-control>
                <input-root
                  :default-value="values.last_name"
                  v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <form-field
            v-slot="{ componentField }"
            name="trail_name">
            <form-item>
              <form-label>Trail Name (optional)</form-label>
              <form-control>
                <input-root
                  :default-value="values.trail_name"
                  v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <form-field
            v-slot="{ componentField }"
            name="measuring_system">
            <form-item>
              <form-label>Preferred Measuring System</form-label>
              <select-root
                v-bind="componentField"
                :default-value="formattedMeasuringSystem[0]?.value">
                <form-control>
                  <select-trigger>
                    <select-value placeholder="Select a measuring system" />
                  </select-trigger>
                </form-control>
                <select-content>
                  <select-group>
                    <select-item
                      v-for="system in formattedMeasuringSystem"
                      :key="system.value"
                      :value="system.value">
                      {{ system.label }}
                    </select-item>
                  </select-group>
                </select-content>
              </select-root>
              <form-message />
            </form-item>
          </form-field>
        </div>
      </template>

      <!-- Step 3: Plan Options -->
      <template v-if="stepIndex === 3">
        <div class="gap-4 grid grid-cols-1 lg:grid-cols-3">
          <upgrade-card
            v-for="tier in tiers"
            :key="tier.title"
            :is-selected="selectedPlan?.value === tier.value"
            :submitting="isSubmitting"
            :tier="tier"
            @handle-action="selectedPlan = $event" />
        </div>
      </template>
    </div>

    <!-- Stepper Button Actions -->
    <div class="flex justify-between items-center mt-16">
      <button-root
        :disabled="stepIndex === 1"
        variant="outline"
        @click="stepIndex > 1 ? stepIndex-- : undefined">
        Back
      </button-root>
      <div class="flex items-center gap-3">
        <button-root
          v-if="stepIndex !== 3"
          :disabled="isSubmitting || isNextDisabled"
          :loading="isSubmitting"
          @click="handleNextStep">
          {{ stepIndex === 1 && !avatarFile ? 'Skip' : 'Next' }}
        </button-root>
        <button-root
          v-if="stepIndex === 3"
          :disabled="isSubmitting || !selectedPlan"
          :loading="isSubmitting"
          @click="handleCompleteOnboarding(selectedPlan?.value ?? null)">
          Submit
        </button-root>
      </div>
    </div>
  </stepper>

  <alert-dialog :open="showLifetimePromo && stepIndex === 3">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title class="flex items-center gap-2">
          <icon-heart class="w-8 h-8 text-primary" />
          Promotional Period
        </alert-dialog-title>
      </alert-dialog-header>
      <div class="flex items-center space-x-2">
        <div class="flex flex-col">
          <typography class="font-semibold">
            Lifetime Membership
          </typography>
          <typography>
            For a limited time, enjoy a free <b>LIFETIME</b> membership on us as a thank you for being one of our first members!
          </typography>
        </div>
      </div>
      <alert-dialog-footer>
        <button-root
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="handleCompleteOnboarding(SubscriptionLevel.LIFE)">
          Continue
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>