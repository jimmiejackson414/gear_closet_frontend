<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { MeasuringSystem, SubscriptionLevel, type Database } from '@/types';
  import { profileTabFromQuery } from '@/utils/profileTabs';
  import type { ProfileApiResponse, SubscriptionApiResponse } from '@/types/profile';
  import type { FilePondFile } from 'filepond';

  dayjs.extend(utc);

  /**
   * Global definitions
   */
  const $appStore = useAppStore();
  const $store = useUserStore();

  /**
   * Defines the new avatar file
   */
  const newAvatarFile = ref<FilePondFile | undefined>(undefined);
  const profileAvatar = computed(() => {
    if ($store.profile?.image) {
      return buildImageSrc($store.profile.image, 'xl', { transform: false });
    }
    return undefined;
  });

  /**
   * Handles the file error
   */
  const handleFileError = () => $appStore.notifyNegative('An error occurred while uploading your avatar.');

  /**
   * Handles the avatar upload
   */
  const handleAvatarUpload = async (file: FilePondFile) => {
    isSubmitting.value = true;
    newAvatarFile.value = file;
    if (newAvatarFile.value && typeof newAvatarFile.value !== 'string') {
      const newAvatar = (newAvatarFile.value as FilePondFile).file as File;
      const { success } = await $store.updateAvatar(newAvatar);
      if (!success) {
        handleFileError();
        isSubmitting.value = false;
        return;
      }
    }
    isSubmitting.value = false;
  };

  /**
   * Form definitions
   */
  const formSchema = toTypedSchema(z.object({
    first_name: z.string()
      .min(2),
    last_name: z.string()
      .min(2),
    measuring_system: z.union([
      z.literal(MeasuringSystem.IMPERIAL),
      z.literal(MeasuringSystem.METRIC),
    ]),
    trail_name: z.string()
      .optional(),
  }));

  const { handleSubmit, isFieldDirty, isSubmitting } = useForm({
    initialValues: {
      first_name: $store.profile?.first_name ?? undefined,
      last_name: $store.profile?.last_name ?? undefined,
      measuring_system: $store.profile?.measuring_system as MeasuringSystem ?? undefined,
      trail_name: $store.profile?.trail_name ?? undefined,
    },
    keepValuesOnUnmount: true,
    validationSchema: formSchema,
  });

  /**
   * Handles the profile form submission
   */
  const onProfileSubmit = handleSubmit(async (values) => {
    try {
      const { success } = await $store.updateProfile(values);
      if (!success) throw Error;
    } catch {
      $appStore.notifyNegative('An error occurred while updating your profile.');
    }
  });

  /**
   * Subscription definitions
   */
  const fetchingSubscription = ref(false);
  const hasStripeBilling = ref(false);
  const subscriptionData = ref<SubscriptionApiResponse>({
    customer: undefined,
    invoices: [],
    nextBillingDate: 0,
    paymentMethods: [],
    subscriptions: [],
  });

  /**
   * Fetches the subscription data
   */
  const $route = useRoute();
  const activeTab = ref(profileTabFromQuery($route.query.tab));

  watch(() => $route.query.tab, (tab) => {
    activeTab.value = profileTabFromQuery(tab);
  });
  const selectedPlan = ref<SubscriptionLevel | undefined>(undefined);
  const isLifetimeMember = computed(() =>
    $store.currentPlanIdentifier === SubscriptionLevel.LIFE);
  const displayedSubscriptionPlan = computed(() => {
    if (isLifetimeMember.value) {
      return subscriptionPlanLabel(SubscriptionLevel.LIFE);
    }
    const stripePlan = subscriptionData.value.subscriptions[0]?.items?.data[0]?.price?.nickname;
    if (stripePlan) return capitalize(stripePlan);
    return subscriptionPlanLabel($store.currentPlanIdentifier);
  });

  const ensureProfileSubscriptions = (profile: ProfileApiResponse) => {
    if (!profile.subscriptions) {
      profile.subscriptions = [];
    }
    return profile.subscriptions;
  };

  const emptyStripeBilling = (): SubscriptionApiResponse => ({
    customer: undefined,
    invoices: [],
    nextBillingDate: null,
    paymentMethods: [],
    subscriptions: [],
  });

  const fetchErrorStatus = (err: unknown): number | undefined => {
    if (!err || typeof err !== 'object') return undefined;
    const error = err as {
      statusCode?: number;
      status?: number;
      response?: { status?: number };
      data?: { statusCode?: number };
    };
    return error.statusCode ?? error.status ?? error.response?.status ?? error.data?.statusCode;
  };

  const applyMissingStripeBilling = () => {
    hasStripeBilling.value = false;
    subscriptionData.value = emptyStripeBilling();
    selectedPlan.value = $store.currentPlanIdentifier;
  };

  const fetchSubscriptionData = async () => {
    fetchingSubscription.value = true;
    hasStripeBilling.value = false;
    try {
      // Lifetime is granted in Postgres with no Stripe customer. Skip the
      // billing API so a 404/500 does not toast or wipe the LIFE row.
      if (isLifetimeMember.value) {
        applyMissingStripeBilling();
        return;
      }

      const response = await $fetch<SubscriptionApiResponse>('/api/stripe/subscription');
      if (!response) {
        $appStore.notifyNegative('An error occurred while fetching your subscription data.');
        return;
      }
      subscriptionData.value = response;
      hasStripeBilling.value = true;

      const profile = $store.profile as ProfileApiResponse | null;
      if (!profile) {
        $appStore.notifyNegative('An error occurred while fetching your subscription data.');
        return;
      }

      const supabase = useSupabaseClient<Database>();
      const result = await supabase
        .from('subscriptions')
        .select('*, prices(*)')
        .eq('profile_id', profile.id)
        .maybeSingle();

      const subscriptions = ensureProfileSubscriptions(profile);
      if (result.data) {
        subscriptions[0] = result.data;
      } else {
        subscriptions.length = 0;
      }

      // set selectedPlan if the user has a subscription
      if (response.subscriptions.length) {
        const subscription = response.subscriptions[0];
        const priceNickname = subscription?.items.data[0]?.price.nickname;
        if (priceNickname) {
          selectedPlan.value = priceNickname.toUpperCase() as SubscriptionLevel;
        }
      } else {
        selectedPlan.value = $store.currentPlanIdentifier;
      }
    } catch (err: unknown) {
      if (fetchErrorStatus(err) === 404) {
        applyMissingStripeBilling();
        return;
      }

      $appStore.notifyNegative('An error occurred while fetching your subscription data.');
    } finally {
      fetchingSubscription.value = false;
    }
  };

  /**
   * Fetches subscription data when activeTab is 'subscription'
   */
  watch(activeTab, (newTab) => {
    if (newTab === 'subscription') {
      fetchSubscriptionData();
    }
  });

  /**
   * Handles the update password
   */
  const newPassword = ref('');
  const confirmPassword = ref('');
  const isSubmittingPassword = ref(false);
  const passwordFieldsKey = ref(0);

  const clearPasswordFields = () => {
    newPassword.value = '';
    confirmPassword.value = '';
    passwordFieldsKey.value += 1;
  };

  const handleUpdatePassword = async () => {
    isSubmittingPassword.value = true;

    if (newPassword.value !== confirmPassword.value) {
      $appStore.notifyNegative('Passwords do not match.');
      isSubmittingPassword.value = false;
      return;
    }

    if (newPassword.value?.length < 8) {
      $appStore.notifyNegative('Password must be at least 8 characters.');
      isSubmittingPassword.value = false;
      return;
    }

    try {
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.auth.updateUser({
        password: newPassword.value,
      });

      if (error) { $appStore.notifyNegative('An error occurred while updating your password.'); }
      else {
        $appStore.notifyPositive('Successfully updated your password!');
        clearPasswordFields();
      }
    } catch {
      $appStore.notifyNegative('An error occurred while updating your password.');
    } finally {
      isSubmittingPassword.value = false;
    }
  };


  /**
   * Dialog states
   */
  const isDeleteAccountDialogOpen = ref(false);
  const isManageSubscriptionOpen = ref(false);
  const isUpdatePaymentDialogOpen = ref(false);

</script>

<template>
  <div class="mx-auto py-8 w-full max-w-full min-w-0 lg:max-w-5xl">
    <div class="gap-6 lg:gap-14 grid grid-cols-1 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
      <client-only>
        <lazy-gc-avatar-upload
          :file="profileAvatar"
          @handle-add-file="handleAvatarUpload($event)"
          @handle-error="handleFileError"
          @handle-remove-file="newAvatarFile = undefined" />
      </client-only>
      <div class="min-w-0">
        <div class="mb-6">
          <typography
            v-if="$store.profile?.trail_name"
            variant="h2">
            {{ $store.profile.trail_name }}
          </typography>
          <typography
            class="mb-2"
            variant="large">
            {{ friendlyUsername($store.profile, { includeTrailName: false }) }}
          </typography>
          <gc-pill
            :copy="`${subscriptionPlanLabel($store.currentPlanIdentifier)} Subscription`"
            size="sm"
            :variant="{
              [SubscriptionLevel.FREE]: 'warning' as const,
              [SubscriptionLevel.LIFE]: 'positive' as const,
              [SubscriptionLevel.ANNUAL]: 'positive' as const,
              [SubscriptionLevel.MONTHLY]: 'primary' as const,
            }[$store.currentPlanIdentifier] || 'warning'" />
        </div>
        <tabs
          v-model="activeTab"
          class="w-full min-w-0"
          default-value="profile">
          <tabs-list class="grid grid-cols-3 w-full min-w-0">
            <tabs-trigger
              class="min-w-0 px-1.5 sm:px-3"
              value="profile">
              Profile
            </tabs-trigger>
            <tabs-trigger
              class="min-w-0 px-1.5 sm:px-3"
              value="subscription">
              Subscription
            </tabs-trigger>
            <tabs-trigger
              class="min-w-0 px-1.5 sm:px-3"
              value="settings">
              Settings
            </tabs-trigger>
          </tabs-list>

          <!-- Profile Tab Content -->
          <tabs-content value="profile">
            <card class="bg-card p-4 rounded-lg">
              <form
                class="gap-6 grid grid-cols-1 auto-rows-auto"
                @submit.prevent="onProfileSubmit">
                <form-field
                  v-slot="{ componentField }"
                  name="first_name"
                  :validate-on-blur="!isFieldDirty">
                  <form-item>
                    <form-label>First Name</form-label>
                    <form-control>
                      <input-root
                        autocomplete="given-name"
                        :disabled="isSubmitting"
                        v-bind="componentField" />
                    </form-control>
                  </form-item>
                </form-field>

                <form-field
                  v-slot="{ componentField }"
                  autocomplete="family-name"
                  name="last_name"
                  :validate-on-blur="!isFieldDirty">
                  <form-item>
                    <form-label>Last Name</form-label>
                    <form-control>
                      <input-root
                        :disabled="isSubmitting"
                        v-bind="componentField" />
                    </form-control>
                  </form-item>
                </form-field>

                <form-field
                  v-slot="{ componentField }"
                  name="trail_name">
                  <form-item>
                    <form-label>Trail Name</form-label>
                    <form-control>
                      <input-root
                        :disabled="isSubmitting"
                        v-bind="componentField" />
                    </form-control>
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

                <button-root
                  :disabled="isSubmitting"
                  :loading="isSubmitting"
                  type="submit">
                  Save Changes
                </button-root>
              </form>
            </card>
          </tabs-content>

          <!-- Subscription Tab Content -->
          <tabs-content value="subscription">
            <card class="bg-card p-4 rounded-lg">
              <div
                v-if="fetchingSubscription"
                class="flex justify-center">
                <gc-spinner variant="primary" />
              </div>
              <div
                v-else
                class="gap-12 grid grid-cols-1 auto-rows-auto">
                <div class="flex flex-col items-start gap-2">
                  <typography variant="small">
                    Current Subscription: <span class="font-bold">{{ displayedSubscriptionPlan }}</span>
                  </typography>
                  <typography
                    v-if="isLifetimeMember"
                    class="text-muted-foreground"
                    variant="small">
                    You have a complimentary lifetime membership. Packs, trips, and forums stay unlocked, and there is no card on file.
                  </typography>
                  <typography
                    v-else-if="!hasStripeBilling"
                    class="text-muted-foreground"
                    variant="small">
                    Billing details appear here after you subscribe to a paid plan.
                  </typography>
                  <button-root
                    data-testid="manage-subscription"
                    size="sm"
                    variant="outline"
                    @click="isManageSubscriptionOpen = true">
                    {{ isLifetimeMember ? 'View Membership' : 'Manage Subscription' }}
                  </button-root>
                </div>
                <template v-if="!isLifetimeMember">
                  <div class="flex flex-col items-start gap-2">
                    <typography
                      class="font-bold!"
                      variant="small">
                      Payment Methods
                    </typography>
                    <ul v-if="subscriptionData?.paymentMethods?.length">
                      <li
                        v-for="method in subscriptionData?.paymentMethods"
                        :key="method.id">
                        {{ capitalize(method.card?.brand ) || 'N/A' }} ending in {{ method.card?.last4 || 'N/A' }}
                        <badge
                          v-if="method.id === subscriptionData?.customer?.invoice_settings.default_payment_method"
                          class="ml-4"
                          variant="secondary">
                          default
                        </badge>
                      </li>
                    </ul>
                    <typography
                      v-else
                      variant="small">
                      No payment methods on file.
                    </typography>
                    <button-root
                      class="mt-2"
                      data-testid="update-payment-method"
                      :disabled="!hasStripeBilling"
                      size="sm"
                      variant="outline"
                      @click="isUpdatePaymentDialogOpen = true">
                      Update Billing Method
                    </button-root>
                  </div>
                  <div>
                    <typography
                      class="font-bold!"
                      variant="small">
                      Next Billing Date
                    </typography>
                    <typography>
                      {{ subscriptionData?.nextBillingDate ? dayjs.utc(subscriptionData.nextBillingDate * 1000).format('MMM DD, YYYY') : 'N/A' }}
                    </typography>
                  </div>
                  <div>
                    <accordion
                      collapsible
                      type="single">
                      <accordion-item value="billing-history">
                        <accordion-trigger>
                          <typography
                            class="font-bold!"
                            variant="small">
                            Billing History
                          </typography>
                        </accordion-trigger>
                        <accordion-content>
                          <ul>
                            <li
                              v-for="invoice in subscriptionData.invoices"
                              :key="invoice.id"
                              class="flex justify-start items-center gap-8 mb-3">
                              {{ dayjs.utc(invoice.created * 1000).format('MMM DD, YYYY') }} - ${{ (invoice.amount_paid / 100).toFixed(2) }} ({{ invoice.lines.data[0]?.description || 'N/A' }})
                              <a
                                v-tippy="'Download Invoice'"
                                class="text-gray-400 hover:text-primary transition-colors duration-200 ease-in-out"
                                :href="(invoice.invoice_pdf as string)"
                                rel="noopener noreferrer"
                                target="_blank">
                                <icon-download class="w-4 h-4" />
                              </a>
                            </li>
                          </ul>
                        </accordion-content>
                      </accordion-item>
                    </accordion>
                  </div>
                </template>
              </div>
            </card>
          </tabs-content>

          <!-- Settings Tab Content -->
          <tabs-content value="settings">
            <card class="bg-card p-4 rounded-lg">
              <div class="gap-6 grid grid-cols-1 auto-rows-auto">
                <form-field name="new_password">
                  <form-item>
                    <form-label>New Password</form-label>
                    <form-control>
                      <input-root
                        :key="`new-password-${passwordFieldsKey}`"
                        v-model="newPassword"
                        data-testid="profile-new-password"
                        :disabled="isSubmittingPassword"
                        password-toggle
                        type="password" />
                    </form-control>
                  </form-item>
                </form-field>
                <form-field name="confirm_password">
                  <form-item>
                    <form-label>Confirm Password</form-label>
                    <form-control>
                      <input-root
                        :key="`confirm-password-${passwordFieldsKey}`"
                        v-model="confirmPassword"
                        data-testid="profile-confirm-password"
                        :disabled="isSubmittingPassword"
                        password-toggle
                        type="password" />
                    </form-control>
                  </form-item>
                </form-field>
                <div class="flex justify-end items-center">
                  <button-root
                    data-testid="profile-update-password"
                    :disabled="isSubmittingPassword"
                    :loading="isSubmittingPassword"
                    @click="handleUpdatePassword">
                    Update Password
                  </button-root>
                </div>
                <separator />
                <div class="flex flex-col items-start">
                  <typography class="mb-2 font-bold! text-destructive">
                    Danger Zone
                  </typography>
                  <button-root
                    variant="destructive"
                    @click="isDeleteAccountDialogOpen = true">
                    Deactivate Account
                  </button-root>
                </div>
              </div>
            </card>
          </tabs-content>
        </tabs>
      </div>
    </div>

    <!--    Dialogs-->
    <lazy-manage-subscription-dialog
      :is-open="isManageSubscriptionOpen"
      :selected-plan="selectedPlan"
      :subscription-data="( subscriptionData as SubscriptionApiResponse )"
      @on-close="isManageSubscriptionOpen = false"
      @on-success="fetchSubscriptionData" />

    <lazy-update-payment-method-dialog
      :is-open="isUpdatePaymentDialogOpen"
      @on-close="isUpdatePaymentDialogOpen = false"
      @on-success="fetchSubscriptionData" />

    <lazy-delete-account-dialog
      :is-open="isDeleteAccountDialogOpen"
      @on-close="isDeleteAccountDialogOpen = false" />
  </div>
</template>
