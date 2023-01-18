<template>
  <MainLayout
    minimal-layout
    align-logo="center">
    <div class="row justify-center q-mb-lg">
      <div
        :class="[contentStyles, 'logo', `step-${step}`]">
        <h6 class="text-h6 q-ma-none text-center">
          Onboarding
        </h6>
      </div>
    </div>
    <div class="row">
      <div :class="contentStyles">
        <q-stepper
          ref="stepper"
          v-model="step"
          color="primary"
          class="stepper bg-transparent"
          transition-prev="fade"
          transition-next="fade"
          done-icon="bi-check"
          flat
          contracted
          animated>
          <q-step
            :name="1"
            title="Profile picture"
            icon="bi-person-circle"
            active-icon="bi-person-circle"
            :done="step > 1">
            <StepOne @handle-next-step="stepper?.next()" />
          </q-step>
          <q-step
            :name="2"
            title="Details"
            active-icon="bi-info"
            icon="bi-info"
            :done="step > 2">
            <StepTwo
              @handle-next-step="stepper?.next()"
              @handle-prev-step="stepper?.previous()" />
          </q-step>
          <q-step
            :name="3"
            title="Plans"
            active-icon="bi-award"
            icon="bi-balloon"
            :done="step > 3">
            <StepThree
              :is-submitting="isSubmitting"
              @handle-next-step="handleFinishOnboarding"
              @handle-prev-step="stepper?.previous()" />
          </q-step>
        </q-stepper>
        <div class="row justify-end">
          <p
            v-if="submitError"
            class="text-negative text-body1">
            An error occurred. Please refresh, or contact <a href="mailto:support@gearcloset.io">support.</a>
          </p>
        </div>
      </div>
    </div>
    <AlertDialog
      :is-open="isAlertDialogOpen"
      title="Promotional Period"
      btn-text="Continue"
      :is-submitting="isSubmitting"
      @handle-continue="() => handleFinishOnboarding(SubscriptionLevel.Life)">
      <template #content>
        <p class="text-body1">
          For a limited time, enjoy a free <b>LIFETIME</b> membership on us as a thank you for being one of our first members!
        </p>
        <p class="text-body1">
          Click the Continue button to get started.
        </p>
      </template>
    </AlertDialog>
  </MainLayout>
</template>

<script lang='ts' setup>
  import {
    ref, computed, watch, defineAsyncComponent, watchEffect,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import { QStepper, useMeta } from 'quasar';
  import { useRoute, useRouter } from 'vue-router';
  import MainLayout from '@/layouts/MainLayout.vue';
  import StepOne from '@/components/onboarding/StepOne.vue';
  import StepTwo from '@/components/onboarding/StepTwo.vue';
  import StepThree from '@/components/onboarding/StepThree.vue';
  import { SubscriptionLevel } from '@/generated/types';
  import { useUserStore } from '@/stores/user';
  import { getStripe } from '@/lib/stripe';
  import { useSubscriptionStore } from '@/stores/subscription';

  const AlertDialog = defineAsyncComponent(() => import('@/components/common/dialogs/AlertDialog.vue'));

  // instantiate stores and libs
  const user = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const $store = useSubscriptionStore();
  const $userStore = useUserStore();

  user.fetchCurrentUser();

  // metadata
  const metaData = {
    title: 'Onboarding | Gear Closet',
  };
  useMeta(metaData);

  // stepper functionality
  const step = ref(1);
  const stepper = ref<QStepper | null>(null);

  // alert dialog functionality
  const isAlertDialogOpen = ref(false);
  const isSubmitting = ref(false);
  const submitError = ref(false);

  const { currentUser } = storeToRefs($userStore);

  // finish onboarding and send to dashboard
  const handleFinishOnboarding = async (subscriptionLevel: SubscriptionLevel): Promise<void> => {
    isSubmitting.value = true;

    try {
      // if free plan, manually create customer and subscription in stripe and push to dashboard
      if (subscriptionLevel === SubscriptionLevel.Free || subscriptionLevel === SubscriptionLevel.Life) {
        const res = await $store.createFreeSubscription(subscriptionLevel, currentUser.value?.email as string);

        if (res.subscription && !res.errors) {
          router.push({ name: 'dashboard' });
        } else {
          submitError.value = true;
        }
      } else {
        // if upgrading, create checkout session and redirect to stripe checkout
        const { session } = await $store.createCheckoutSession(subscriptionLevel);
        const stripe = await getStripe();
        stripe?.redirectToCheckout({
          sessionId: session?.id as string,
        });
      }
      $userStore.sendWelcomeEmail();
      isSubmitting.value = false;
    } catch (error) {
      console.error({ error });
      isSubmitting.value = false;
    }
  };

  watch(step, () => {
    if (step.value === 3) {
      isAlertDialogOpen.value = true;
    }
  });

  watchEffect(() => {
    if (route.query?.subscription_managed === 'canceled') {
      stepper.value?.goTo(3);
    }
  });

  const contentStyles = computed(() => ({
    'col-xs-12': true,
    'col-sm-8': step.value !== 3,
    'col-sm-12': step.value === 3,
    'col-md-6': step.value !== 3,
    'col-md-10': step.value === 3,
    'offset-sm-2': step.value !== 3,
    'offset-sm-1': step.value === 3,
    'offset-md-3': step.value !== 3,
    'offset-md-1': step.value === 3,
  }));
</script>

<style lang="scss" scoped>
  .logo {
    @media (min-width: $breakpoint-md-min) {
      margin-right: 25%;
    }

    &.step-3 {
      margin-right: 8.3333%;
    }
  }

  .stepper {
    width: 100%;
  }
</style>
