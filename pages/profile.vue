<script lang='ts' setup>
  import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import { Tabs } from 'flowbite';
  import { ChevronDownIcon, DownloadIcon, CheckCircleIcon, HeartIcon } from 'lucide-vue-next';
  import { SubscriptionLevel, MeasuringSystem, type Database } from '@/types';
  import type { InstanceOptions, TabsOptions, TabItem } from 'flowbite';
  import type { SelectOption, SubscriptionApiResponse, SubscriptionType } from '@/types/helpers';

  dayjs.extend(utc);

  definePageMeta({ layout: 'page-layout' });

  const $store = useUserStore();
  const $appStore = useAppStore();

  const { loading } = storeToRefs($appStore);
  const { profile } = storeToRefs($store);
  const submitting = ref(false);
  const activeTab = ref('profile'); // profile, settings, subscription

  /**
   * Handles adding a file from the avatar upload component.
   * @param file The file to remove.
   */
  const newAvatarFile = ref<any>(undefined);
  const handleAddFile = (file: File) => {
    newAvatarFile.value = file;
  };

  /**
   * Handles removing a file from the avatar upload component.
   */
  const handleRemoveFile = () => {
    newAvatarFile.value = undefined;
  };

  /**
   * Handles an error from the avatar upload component.
   */
  const handleError = () => {
    $appStore.notifyNegative('An error occurred while uploading your avatar.');
  };

  /**
   * Updates a user's profile.
   */
  const profileForm = reactive({
    firstName: profile.value?.first_name,
    lastName: profile.value?.last_name,
    trailName: profile.value?.trail_name,
    measuringSystem: profile.value?.measuring_system,
  });
  const isProfileDisabled = computed(() => {
    return submitting.value || !profile.value?.email || !profile.value?.first_name || !profile.value?.last_name;
  });
  const updateProfile = async () => {
    try {
      submitting.value = true;

      // upload the new avatar
      if (newAvatarFile.value) {
        const { success } = await $store.updateAvatar(newAvatarFile.value.file);
        if (!success) $appStore.notifyNegative('An error occurred while updating your avatar.');
      } else {
        // delete the user's avatar
        const { success } = await $store.deleteAvatar();
        if (!success) $appStore.notifyNegative('An error occurred while deleting your avatar.');
      }

      $store.updateProfile(profile.value!.id, {
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        trail_name: profileForm.trailName,
        measuring_system: profileForm.measuringSystem,
      });
    } catch (err) {
      $appStore.notifyNegative('An error occurred while updating your profile.');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Updates a user's password
   */
  const newPassword = ref<string | undefined>(undefined);
  const newPasswordConfirm = ref<string | undefined>(undefined);
  const isSettingsDisabled = computed(() => {
    return submitting.value || !newPassword.value || !newPasswordConfirm.value || newPassword.value !== newPasswordConfirm.value;
  });
  const updatePassword = async () => {
    if (newPassword.value !== newPasswordConfirm.value) {
      $appStore.notifyNegative('Passwords do not match.');
      return;
    }

    if (newPassword.value?.length && newPassword.value.length < 8) {
      $appStore.notifyNegative('Password must be at least 8 characters.');
      return;
    }

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.auth.updateUser({
        password: newPassword.value,
      });

      if (error) { $appStore.notifyNegative('An error occurred while updating your password.'); }
      else {
        $appStore.notifyPositive('Successfully updated your password!');
        newPassword.value = '';
        newPasswordConfirm.value = '';
      }
    } catch (err) {
      $appStore.notifyNegative('An error occurred while updating your password.');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Fetch subscription information
   */
  const fetchingSubscription = ref(false);
  const subscriptionData = ref<SubscriptionApiResponse>({
    customer: undefined,
    paymentMethods: [],
    nextBillingDate: 0,
    invoices: [],
    subscriptions: [],
  });
  const fetchSubscriptionData = async () => {
    fetchingSubscription.value = true;
    try {
      const response = await $fetch('/api/stripe/subscription');
      if (!response) {
        $appStore.notifyNegative('An error occurred while fetching your subscription data.');
        return;
      }
      subscriptionData.value = response;

      const supabase = useSupabaseClient<Database>();
      const { data: subscription } = await supabase.from('subscriptions')
        .select('*, prices(*)')
        .eq('profile_id', profile.value!.id)
        .returns<SubscriptionType>()
        .single();

      if (subscription) profile.value!.subscriptions[0] = subscription;

      // set selectedPlan if the user has a subscription
      if (response.subscriptions.length) {
        const subscription = response.subscriptions[0];
        if (subscription.items.data.length) {
          selectedPlan.value = subscription.items.data[0].price.nickname?.toUpperCase() as SubscriptionLevel;
        }
      }
    } catch (err) {
      $appStore.notifyNegative('An error occurred while fetching your subscription data.');
    } finally {
      fetchingSubscription.value = false;
    }
  };

  watch(activeTab, (newTab) => {
    if (newTab === 'subscription') {
      fetchSubscriptionData();
    }
  });

  /**
   * Updates a user's billing method.
   */
  const { createClient: createStripeClient } = useStripe();
  const isUpdatePaymentModalOpen = ref(false);
  const acceptsUpdatePayment = ref(false);
  const cardElementRef = ref<HTMLElement | null>(null);
  const cardValid = ref(false);
  const submittingPaymentMethod = ref(false);
  let stripe: Stripe | null = null;
  let elements: StripeElements | null = null;
  let cardElement: StripeCardElement | null = null;

  const updatePaymentMethod = async () => {
    if (!cardValid.value) {
      $appStore.notifyNegative('Please enter a valid card.');
      return;
    }

    if (stripe && cardElement) {
      try {
        submittingPaymentMethod.value = true;
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error || !paymentMethod) {
          $appStore.notifyNegative('An error occurred while updating your payment method.');
        } else {
          const response = await $fetch('/api/stripe/payment-method', {
            method: 'PUT',
            body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
          });

          if (!response.paymentMethods) {
            $appStore.notifyNegative('An error occurred while updating your payment method.');
          } else {
            subscriptionData.value.paymentMethods = response.paymentMethods;
            $appStore.notifyPositive('Successfully updated your payment method!');
            isUpdatePaymentModalOpen.value = false;
          }
        }
      } catch (err) {
        $appStore.notifyNegative('An error occurred while updating your payment method.');
      } finally {
        submittingPaymentMethod.value = false;
      }
    }
  };

  const setupCardElement = async () => {
    stripe = await createStripeClient();
    if (stripe) {
      elements = stripe.elements();
      if (elements && cardElementRef.value) {
        cardElement = elements.create('card', {
          classes: {
            base: 'h-12 py-3.5 px-4 rounded-lg w-full border border-gray-300 focus:border-primary',
            invalid: 'border-red-500',
          },
          style: {
            base: {
              color: '#32325d',
              fontFamily: '"Lato", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
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

  /**
   * Manages a user's subscription.
   */
  const isManageSubscriptionOpen = ref(false);
  const step = ref(1);
  const selectedPlan = ref<SubscriptionLevel | undefined>(undefined);
  const acceptsManageSubscription = ref(false);
  const submittingNewSubscription = ref(false);
  const updateSubscription = async () => {
    try {
      submittingNewSubscription.value = true;
      const response = await $fetch('/api/stripe/subscription', {
        method: 'PUT',
        body: JSON.stringify({ newPlan: selectedPlan.value }),
      });

      if (!response.ok) {
        $appStore.notifyNegative('An error occurred while updating your subscription.');
        return;
      }

      await fetchSubscriptionData();
      isManageSubscriptionOpen.value = false;
      acceptsManageSubscription.value = false;
      step.value = 1;
      $appStore.notifyPositive('Successfully updated your subscription!');
    } catch (err) {
      $appStore.notifyNegative('An error occurred while updating your subscription.');
    } finally {
      submittingNewSubscription.value = false;
    }
  };

  const isContinueDisabled = computed(() => {
    return !selectedPlan.value || selectedPlan.value === subscriptionData.value.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase();
  });

  const stepTwoCopy = computed(() => {
    const planLevels = { [SubscriptionLevel.FREE]: 1, [SubscriptionLevel.MONTHLY]: 2, [SubscriptionLevel.ANNUAL]: 3, [SubscriptionLevel.LIFE]: 4 };
    const isUpgrading = planLevels[selectedPlan.value as SubscriptionLevel] > planLevels[subscriptionData.value.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() as SubscriptionLevel];
    const isSwitchingPlans = (selectedPlan.value === SubscriptionLevel.MONTHLY && subscriptionData.value.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() === SubscriptionLevel.ANNUAL) ||
      (selectedPlan.value === SubscriptionLevel.ANNUAL && subscriptionData.value.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() === SubscriptionLevel.MONTHLY);

    if (isSwitchingPlans) {
      return `You're about to switch to the ${capitalize(selectedPlan.value)} Plan. Your card on file will be charged immediately, and your next billing date will be updated to today. Note that the features remain the same, but the Annual plan offers about a 20% discount compared to the Monthly plan.`;
    } else if (isUpgrading) {
      return `By upgrading to the ${capitalize(selectedPlan.value)} Plan, you will gain access to additional features. Your card on file will be charged immediately, and your next billing date will be updated to today.`;
    } else {
      return `You're about to downgrade to the ${capitalize(selectedPlan.value)} Plan. Please note that you will lose access to some features, including the Gear Closet Forums. Your card on file will no longer be charged.`;
    }
  });

  /*
  * Instantiates the tabs component.
  */
  const instantiateTabs = () => {
    const tabsElement = document?.getElementById('tabs-group') as HTMLElement;
    if (tabsElement) {
      const tabElements: TabItem[] = [
        {
          id: 'profile',
          triggerEl: document?.querySelector('#profile-tab') as HTMLElement,
          targetEl: document?.querySelector('#profile') as HTMLElement,
        },
        {
          id: 'settings',
          triggerEl: document?.querySelector('#settings-tab') as HTMLElement,
          targetEl: document?.querySelector('#settings') as HTMLElement,
        },
        {
          id: 'subscription',
          triggerEl: document?.querySelector('#subscription-tab') as HTMLElement,
          targetEl: document?.querySelector('#subscription') as HTMLElement,
        },
      ];
      const options: TabsOptions = {
        defaultTabId: 'profile',
        activeClasses: 'text-primary font-bold hover:text-primary !border-primary border-primary border-b-2',
        inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
        onShow: (_tabs, tab) => {
          activeTab.value = tab.id;
        },
      };
      const instanceOptions: InstanceOptions = {
        id: 'tabs-group',
        override: true,
      };
      return new Tabs(tabsElement, tabElements, options, instanceOptions);
    }
  };
  onMounted(() => instantiateTabs());

  const profileAvatar = computed(() => {
    if (profile.value?.image) {
      return buildImageSrc(profile.value.image);
    }
    return undefined;
  });

  /**
   * Deletes a user's account.
   */
  const deleteAccountModalOpen = ref(false);
  const acceptsDeleteAccount = ref(false);
  const deleteAccount = () => {
    console.log(`TODO: delete account`);
    deleteAccountModalOpen.value = false;
  };

  useHead({
    title: 'Profile | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet profile page!',
      },
    ],
  });
</script>

<template>
  <div class="max-w-full lg:max-w-5xl mx-auto py-8 w-full">
    <div class="grid lg:grid-cols-[400px,1fr] grid-cols-1 gap-6 lg:gap-14">
      <gc-avatar-upload
        :file="profileAvatar"
        @handle-add-file="handleAddFile"
        @handle-error="handleError"
        @handle-remove-file="handleRemoveFile" />
      <div>
        <div class="mb-4">
          <h2
            v-if="profile?.trail_name"
            class="text-4xl">
            {{ profile.trail_name }}
          </h2>
          <p class="mb-4 text-lg">
            {{ friendlyUsername((profile as any), { includeTrailName: false }) }}
          </p>
          <gc-pill
            :copy="capitalize(profile!.subscriptions[0].prices.identifier) + ' Subscription'"
            size="lg"
            :variant="{
              [SubscriptionLevel.FREE]: 'warning' as const,
              [SubscriptionLevel.LIFE]: 'positive' as const,
              [SubscriptionLevel.ANNUAL]: 'positive' as const,
              [SubscriptionLevel.MONTHLY]: 'primary' as const,
            }[profile!.subscriptions[0].prices.identifier as keyof typeof SubscriptionLevel] || 'primary'" />
        </div>
        <div class="border-b border-gray-200">
          <ul
            id="tabs-group"
            class="-mb-px flex flex-wrap font-medium text-center text-gray-500 text-sm"
            role="tablist">
            <li
              class="me-2"
              role="presentation">
              <button
                id="profile-tab"
                aria-controls="you"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Profile
              </button>
            </li>
            <li
              class="me-2"
              role="presentation">
              <button
                id="subscription-tab"
                aria-controls="group"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Subscription
              </button>
            </li>
            <li
              class="me-2"
              role="presentation">
              <button
                id="settings-tab"
                aria-controls="group"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Settings
              </button>
            </li>
          </ul>
        </div>
        <div id="default-tab-content">
          <!-- Profile Tab Content -->
          <div
            id="profile"
            aria-labelledby="profile-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <div class="auto-rows-auto grid grid-cols-1 gap-6">
              <gc-input
                v-model="profileForm.firstName"
                autocomplete="given-name"
                class="w-full"
                :disabled="submitting || loading"
                label="First Name"
                name="firstName"
                placeholder="Tom"
                required />
              <gc-input
                v-model="profileForm.lastName"
                autocomplete="family-name"
                class="w-full"
                :disabled="submitting || loading"
                label="Last Name"
                name="lastName"
                placeholder="Jones"
                required />
              <gc-input
                v-model="profileForm.trailName"
                class="w-full"
                :disabled="submitting || loading"
                label="Trail Name"
                name="trailName"
                required />
              <gc-select
                :disabled="submitting || loading"
                label="Preferred measurement system"
                :model-value="profileForm.measuringSystem"
                :options="[
                  { label: 'Imperial (lbs, oz)', value: MeasuringSystem.IMPERIAL },
                  { label: 'Metric (kgs, g)', value: MeasuringSystem.METRIC }
                ]"
                @update:model-value="(val: SelectOption) => profileForm.measuringSystem = ( val.value as MeasuringSystem )" />
              <gc-button
                class="justify-self-end"
                :disabled="isProfileDisabled"
                label="Update"
                @click="updateProfile" />
            </div>
          </div>

          <!-- Subscription Tab Content -->
          <div
            id="subscription"
            aria-labelledby="subscription-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <div
              v-if="fetchingSubscription"
              class="flex justify-center">
              <gc-spinner variant="primary" />
            </div>
            <div
              v-else
              class="auto-rows-auto grid grid-cols-1 gap-6">
              <div>
                <p class="font-bold text-sm">
                  Current Subscription: {{ capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname) }}
                </p>
                <gc-button
                  class="mt-4"
                  label="Manage Subscription"
                  outlined
                  size="sm"
                  variant="positive"
                  @click="isManageSubscriptionOpen = true" />
              </div>
              <div>
                <p class="font-bold text-sm">
                  Payment Methods
                </p>
                <ul>
                  <li
                    v-for="method in subscriptionData?.paymentMethods"
                    :key="method.id">
                    {{ capitalize(method.card?.brand) || 'N/A' }} ending in {{ method.card?.last4 || 'N/A' }}
                    <gc-pill
                      v-if="method.id === subscriptionData?.customer?.invoice_settings.default_payment_method"
                      class="ml-4"
                      copy="default"
                      size="sm"
                      variant="secondary" />
                  </li>
                </ul>
                <gc-button
                  class="mt-4"
                  label="Update billing method"
                  outlined
                  size="sm"
                  @click="isUpdatePaymentModalOpen = true" />
              </div>
              <div>
                <p class="font-bold text-sm">
                  Next Billing Date
                </p>
                <p class="text-base">
                  {{ subscriptionData?.nextBillingDate ? dayjs.utc(subscriptionData.nextBillingDate * 1000).format('MMM DD, YYYY') : 'N/A' }}
                </p>
              </div>
              <div>
                <headless-disclosure v-slot="{ open }">
                  <headless-disclosure-button class="flex justify-start focus-visible:outline-none gap-4 py-2 text-left w-full">
                    <p class="font-bold text-sm">
                      Billing History
                    </p>
                    <chevron-down-icon
                      class="h-5 text-primary w-5"
                      :class="open ? 'rotate-180 transform transition-all' : ''" />
                  </headless-disclosure-button>
                  <fade-transition>
                    <headless-disclosure-panel>
                      <ul>
                        <li
                          v-for="invoice in subscriptionData.invoices"
                          :key="invoice.id"
                          class="flex justify-start items-center gap-8 mb-3">
                          {{ dayjs.utc(invoice.created * 1000).format('MMM DD, YYYY') }} - ${{ (invoice.amount_paid / 100).toFixed(2) }} ({{ invoice.lines.data[0].plan?.nickname || 'N/A' }})
                          <a
                            v-tippy="'Download Invoice'"
                            class="duration-200 ease-in-out text-gray-400 hover:text-primary transition-colors"
                            :href="(invoice.invoice_pdf as string)"
                            rel="noopener noreferrer"
                            target="_blank">
                            <download-icon class="h-4 w-4" />
                          </a>
                        </li>
                      </ul>
                    </headless-disclosure-panel>
                  </fade-transition>
                </headless-disclosure>
              </div>
            </div>
          </div>

          <!-- Settings Tab Content -->
          <div
            id="settings"
            aria-labelledby="settings-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <div class="auto-rows-auto grid grid-cols-1 gap-6">
              <gc-input
                v-model="newPassword"
                autocomplete="current-password"
                class="w-full"
                :disabled="submitting"
                label="New Password"
                name="password"
                password-toggle
                placeholder="Password"
                required
                type="password" />
              <gc-input
                v-model="newPasswordConfirm"
                autocomplete="confirm-password"
                class="w-full"
                :disabled="submitting"
                label="Confirm New Password"
                name="passwordConfirm"
                password-toggle
                placeholder="Confirm password"
                required
                type="password" />
              <div class="flex justify-between items-center">
                <gc-button
                  label="Delete Account"
                  variant="danger"
                  @click="deleteAccountModalOpen = true" />
                <gc-button
                  :disabled="isSettingsDisabled"
                  label="Update"
                  @click="updatePassword" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Subscription Modal -->
    <gc-modal
      id="manage-subscription-modal"
      :is-open="isManageSubscriptionOpen"
      size="xl"
      title="Manage Your Subscription"
      @handle-cancel="[isManageSubscriptionOpen = false, selectedPlan = undefined, step = 1]">
      <template #content>
        <!-- stepper nav -->
        <ol class="flex justify-center items-center font-medium max-w-lg mx-auto text-center sm:text-base text-gray-500 text-sm w-full">
          <li
            class="duration-100 ease-in-out flex sm:after:content-[''] items-center text-primary transition-all after:border-4 after:border-b after:h-1 after:hidden after:mx-6 after:rounded-xl after:w-full sm:after:inline-block md:w-full xl:after:mx-10"
            :class="[
              step >= 2 ? 'after:border-primary-light' : 'after:border-gray-300'
            ]">
            <span class="flex after:content-['/'] items-center after:mx-2 after:text-gray-300 sm:after:hidden">
              <span
                class="me-2.5 p-2 rounded-full w-auto"
                :class="step === 1 ? 'bg-primary-light' : 'bg-white'">
                <check-circle-icon
                  class="h-4 sm:h-5 w-4 sm:w-5"
                  :color="tailwind.theme.colors['text-primary']"
                  :stroke-width="3" />
              </span>
              Subscription
            </span>
          </li>
          <li
            class="duration-100 ease-in-out flex items-center transition-all"
            :class="step === 2 ? 'text-primary' : 'text-dark-grey'">
            <span
              class="me-2 p-2 rounded-full w-auto"
              :class="step === 2 ? 'bg-primary-light' : 'bg-white'">
              <check-circle-icon
                v-if="step === 2"
                class="h-4 sm:h-5 w-4 sm:w-5"
                :color="tailwind.theme.colors['primary']"
                :stroke-width="3" />
              <heart-icon
                v-else
                class="h-4 sm:h-5 w-4 sm:w-5"
                :color="tailwind.theme.colors['grey']"
                :stroke-width="3" />
            </span>
            Confirm
          </li>
        </ol>

        <!-- stepper content -->
        <div
          v-if="step === 1"
          class="!mt-0 flex justify-center flex-col max-w-4xl mx-auto px-8">
          <div
            v-if="subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname?.toUpperCase() === 'LIFE'"
            class="my-8 text-center">
            <p class="!font-bold text-base-lg">
              Good news!
            </p>
            <p>
              You currently have a <span class="font-bold">free lifetime subscription</span> to Gear Closet.
            </p>
            <p>
              This includes everything in the Annual subscription at no cost. You're all set!
            </p>
          </div>
          <div
            v-else
            class="my-8 text-center">
            <p class="!font-bold text-base-lg">
              Here's what you've got.
            </p>
            <p>
              You're currently subscribed to the <span class="font-bold">{{ capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname) }} Plan</span>.
            </p>
          </div>
          <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <subscription-item
              v-for="tier in tiers"
              :key="tier.title"
              :plan="tier"
              :selected-plan="selectedPlan"
              @handle-select="selectedPlan = $event" />
          </div>
          <div class="pt-8">
            <div class="flex justify-between items-center mt-4">
              <gc-button
                ghost
                label="Cancel"
                variant="secondary"
                @click="[ isManageSubscriptionOpen = false, selectedPlan = undefined, step = 1 ]" />

              <gc-button
                :disabled="isContinueDisabled"
                label="Continue"
                @click="step === 1 ? step = 2 : updateSubscription" />
            </div>
          </div>
        </div>

        <div
          v-if="step === 2"
          class="!mt-0 flex justify-center flex-col max-w-4xl mx-auto px-8">
          <p class="mb-3 mt-6 text-base">
            You've selected the <span class="font-bold">{{ capitalize(selectedPlan) }} Plan</span>.
          </p>
          <p class="mb-3 text-base">
            {{ stepTwoCopy }}
          </p>
          <gc-checkbox
            id="accepts-manage-subscription"
            v-model="acceptsManageSubscription"
            class="mt-4"
            :label="selectedPlan !== 'FREE' ? `I acknowledge the card I have on file will be used when updating my subscription.` : `I acknowledge that I will be downgrading to the Free Plan and will lose access to some features, including the Gear Closet Forums.`"
            required />
          <div class="flex justify-between items-center mt-4">
            <gc-button
              ghost
              label="Cancel"
              variant="secondary"
              @click="[ isManageSubscriptionOpen = false, selectedPlan = undefined, step = 1 ]" />
            <gc-button
              :disabled="!acceptsManageSubscription || submittingNewSubscription"
              label="Update Subscription"
              :loading="submittingNewSubscription"
              @click="updateSubscription" />
          </div>
        </div>
      </template>
    </gc-modal>

    <!-- Update Payment Method Modal -->
    <gc-modal
      :is-open="isUpdatePaymentModalOpen"
      title="Update Payment Method"
      @handle-cancel="isUpdatePaymentModalOpen = false"
      @open="setupCardElement">
      <template #content>
        <div ref="cardElementRef" />
        <p>By updating your payment method, all future subscription invoices will be paid using this card.</p>
        <gc-checkbox
          id="accepts-update-payment"
          v-model="acceptsUpdatePayment"
          label="I acknowledge this card will be used for future invoices."
          required />
        <div class="flex justify-between pt-8">
          <gc-button
            ghost
            label="Cancel"
            variant="secondary"
            @click="isUpdatePaymentModalOpen = false" />
          <gc-button
            :disabled="!acceptsUpdatePayment || submittingPaymentMethod"
            label="Update Payment Method"
            :loading="submittingPaymentMethod"
            @click="updatePaymentMethod" />
        </div>
      </template>
    </gc-modal>

    <!-- Delete Account modal -->
    <gc-modal
      :is-open="deleteAccountModalOpen"
      size="sm"
      title="Delete Account"
      @handle-cancel="deleteAccountModalOpen = false">
      <template #content>
        <p class="font-bold text-danger">
          Are you sure you want to delete your account?
        </p>
        <p class="text-base">
          This action cannot be undone, and you will no longer have access to your account, data, or the Gear Closet Forums.
        </p>
        <gc-checkbox
          id="accepts-delete-account"
          v-model="acceptsDeleteAccount"
          class="mt-4"
          label="I understand the consequences of deleting my account."
          required
          variant="danger" />
        <div class="flex justify-between pt-8">
          <gc-button
            ghost
            label="Cancel"
            variant="secondary"
            @click="deleteAccountModalOpen = false" />
          <gc-button
            :disabled="!acceptsDeleteAccount"
            label="Delete Account"
            variant="danger"
            @click="deleteAccount" />
        </div>
      </template>
    </gc-modal>
  </div>
</template>
