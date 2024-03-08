<script lang='ts' setup>
  import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import { Tabs } from 'flowbite';
  import { ChevronDownIcon, DownloadIcon } from 'lucide-vue-next';
  import { SubscriptionLevel, type Database, MeasuringSystem } from '@/types';
  import type { InstanceOptions, TabsOptions, TabItem } from 'flowbite';
  import type { SelectOption, SubscriptionApiResponse } from '@/types/helpers';

  dayjs.extend(utc);

  definePageMeta({ layout: 'page-layout' });

  const $store = useUserStore();
  const $appStore = useAppStore();

  const { loading } = storeToRefs($appStore);
  const { profile } = storeToRefs($store);
  const submitting = ref(false);

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
   * Updates a user's billing method.
   */
  const { createClient: createStripeClient } = useStripe();
  const isUpdatePaymentModalOpen = ref(false);
  const acceptsUpdatePayment = ref(false);
  const cardElementRef = ref<HTMLElement | null>(null);
  const cardValid = ref(false);
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
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          $appStore.notifyNegative('An error occurred while updating your payment method.');
        } else {
          console.log(`paymentMethod`, paymentMethod);
        }
      } catch (err) {
        $appStore.notifyNegative('An error occurred while updating your payment method.');
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
              color: '#32325d', // Text color
              fontFamily: '"Lato", Helvetica, sans-serif', // Font family
              fontSmoothing: 'antialiased', // Font smoothing
              fontSize: '16px', // Font size
              '::placeholder': {
                color: '#aab7c4', // Placeholder text color
              },
            },
            invalid: {
              color: '#fa755a', // Text color when the element's input is invalid
              iconColor: '#fa755a', // Icon color when the element's input is invalid
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
  const manageSubscription = () => {
    console.log('Manage subscription');
  };

  /*
  * Instantiates the tabs component.
  */
  const activeTab = ref('profile'); // profile, settings, subscription
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
   * Fetch subscription information
   */
  const fetchingSubscription = ref(false);
  const subscriptionData = ref<SubscriptionApiResponse>({
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
          <gc-subscription-pill :subscription="(profile!.subscriptions[0].prices.identifier as SubscriptionLevel)" />
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
                  Payment Methods
                </p>
                <ul>
                  <li
                    v-for="method in subscriptionData?.paymentMethods"
                    :key="method.id">
                    {{ capitalize(method.card?.brand) || 'N/A' }} ending in {{ method.card?.last4 || 'N/A' }}
                  </li>
                </ul>
                <gc-button
                  class="mt-2"
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
                        <!-- <li>
                          11/01/2024 - $9.99 (Life Membership)
                        </li> -->
                      </ul>
                    </headless-disclosure-panel>
                  </fade-transition>
                </headless-disclosure>
              </div>
              <div>
                <p class="font-bold text-sm">
                  Current Subscription: LIFE
                </p>
                <gc-button
                  class="mt-2"
                  label="Manage Subscription"
                  outlined
                  size="sm"
                  variant="positive"
                  @click="manageSubscription" />
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
            :disabled="!acceptsUpdatePayment"
            label="Update Payment Method"
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
