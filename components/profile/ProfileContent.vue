<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import type { FilePondFile } from 'filepond';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import DeleteAccountDialog from '@/components/profile/dialogs/DeleteAccountDialog.vue';
  import ManageSubscriptionDialog from '@/components/profile/dialogs/ManageSubscriptionDialog.vue';
  import UpdatePaymentMethodDialog from '@/components/profile/dialogs/UpdatePaymentMethodDialog.vue';
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, FormControl, FormField, FormInput, FormItem, FormLabel, SelectContent, SelectGroup, SelectRoot, SelectTrigger, SelectValue, Separator, Tabs, TabsList, Typography, UiButton } from '@/components/ui';
  import { type Database, MeasuringSystem, SubscriptionLevel } from '@/types';
  import type { SubscriptionApiResponse, SubscriptionType } from '@/types/helpers';

  dayjs.extend(utc);

  /**
   * Global definitions
   */
  const $appStore = useAppStore();
  const $store = useUserStore();
  const { profile } = storeToRefs($store);

  /**
   * Defines the new avatar file
   */
  const newAvatarFile = ref<FilePondFile | undefined>(undefined);
  const profileAvatar = computed(() => {
    if (profile.value?.image) {
      return buildImageSrc(profile.value.image);
    }
    return undefined;
  });

  /**
   * Handles the file error
   */
  const handleFileError = () => $appStore.notifyNegative('An error occurred while uploading your avatar.');

  /**
   * Form definitions
   */
  const formSchema = toTypedSchema(z.object({
    first_name: z.string()
      .min(2),
    last_name: z.string()
      .min(2),
    trail_name: z.string()
      .optional(),
    measuring_system: z.union([
      z.literal(MeasuringSystem.IMPERIAL),
      z.literal(MeasuringSystem.METRIC),
    ]),
  }));

  const { isFieldDirty, handleSubmit, isSubmitting } = useForm({
    keepValuesOnUnmount: true,
    validationSchema: formSchema,
    initialValues: {
      first_name: profile.value?.first_name ?? undefined,
      last_name: profile.value?.last_name ?? undefined,
      trail_name: profile.value?.trail_name ?? undefined,
      measuring_system: profile.value?.measuring_system as MeasuringSystem ?? undefined,
    },
  });

  /**
   * Handles the profile form submission
   */
  const onProfileSubmit = handleSubmit(async (values) => {
    try {
      const { success } = await $store.updateProfile(values);
      if (!success) throw Error;
    } catch (err) {
      $appStore.notifyNegative('An error occurred while updating your profile.');
    }
  });

  /**
   * Subscription definitions
   */
  const fetchingSubscription = ref(false);
  const subscriptionData = ref<SubscriptionApiResponse>({
    customer: undefined,
    paymentMethods: [],
    nextBillingDate: 0,
    invoices: [],
    subscriptions: [],
  });

  /**
   * Fetches the subscription data
   */
  const activeTab = ref<'profile' | 'settings' | 'subscription'>('profile');
  const selectedPlan = ref<SubscriptionLevel | undefined>(undefined);
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
        newPassword.value = '';
        confirmPassword.value = '';
      }
    } catch (err) {
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
  <div class="max-w-full lg:max-w-5xl mx-auto py-8 w-full">
    <div class="grid lg:grid-cols-[400px,1fr] grid-cols-1 gap-6 lg:gap-14">
      <client-only>
        <gc-avatar-upload
          :file="profileAvatar"
          @handle-add-file="newAvatarFile = $event"
          @handle-error="handleFileError"
          @handle-remove-file="newAvatarFile = undefined" />
      </client-only>
      <div>
        <div class="mb-6">
          <typography
            v-if="profile?.trail_name"
            variant="h2">
            {{ profile.trail_name }}
          </typography>
          <typography
            class="mb-2"
            variant="large">
            {{ friendlyUsername((profile as any), { includeTrailName: false }) }}
          </typography>
          <gc-pill
            :copy="capitalize(profile!.subscriptions[0]?.prices.identifier) + ' Subscription'"
            size="sm"
            :variant="{
              [SubscriptionLevel.FREE]: 'warning' as const,
              [SubscriptionLevel.LIFE]: 'positive' as const,
              [SubscriptionLevel.ANNUAL]: 'positive' as const,
              [SubscriptionLevel.MONTHLY]: 'primary' as const,
            }[profile!.subscriptions[0].prices.identifier as keyof typeof SubscriptionLevel] || 'primary'" />
        </div>
        <tabs
          v-model="activeTab"
          class="w-[400px]"
          default-value="profile">
          <tabs-list class="grid grid-cols-3 w-full">
            <tabs-trigger value="profile">
              Profile
            </tabs-trigger>
            <tabs-trigger value="subscription">
              Subscription
            </tabs-trigger>
            <tabs-trigger value="settings">
              Settings
            </tabs-trigger>
          </tabs-list>

          <!-- Profile Tab Content -->
          <tabs-content value="profile">
            <card class="bg-card p-4 rounded-lg">
              <form
                class="auto-rows-auto grid grid-cols-1 gap-6"
                @submit.prevent="onProfileSubmit">
                <form-field
                  v-slot="{ componentField }"
                  name="first_name"
                  :validate-on-blur="!isFieldDirty">
                  <form-item>
                    <form-label>First Name</form-label>
                    <form-control>
                      <form-input
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
                      <form-input
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
                      <form-input
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
                      :default-value="formattedMeasuringSystem[0].value">
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

                <ui-button
                  :disabled="isSubmitting"
                  :loading="isSubmitting"
                  type="submit">
                  Save Changes
                </ui-button>
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
                class="auto-rows-auto grid grid-cols-1 gap-12">
                <div class="flex items-start flex-col gap-2">
                  <typography variant="small">
                    Current Subscription: <span class="font-bold">{{ capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname) }}</span>
                  </typography>
                  <ui-button
                    size="sm"
                    variant="outline"
                    @click="isManageSubscriptionOpen = true">
                    Manage Subscription
                  </ui-button>
                </div>
                <div class="flex items-start flex-col gap-2">
                  <typography
                    class="!font-bold"
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
                  <ui-button
                    class="mt-2"
                    size="sm"
                    variant="outline"
                    @click="isUpdatePaymentDialogOpen = true">
                    Update Billing Method
                  </ui-button>
                </div>
                <div>
                  <typography
                    class="!font-bold"
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
                          class="!font-bold"
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
                            {{ dayjs.utc(invoice.created * 1000).format('MMM DD, YYYY') }} - ${{ (invoice.amount_paid / 100).toFixed(2) }} ({{ invoice.lines.data[0].plan?.nickname || 'N/A' }})
                            <a
                              v-tippy="'Download Invoice'"
                              class="duration-200 ease-in-out text-gray-400 hover:text-primary transition-colors"
                              :href="(invoice.invoice_pdf as string)"
                              rel="noopener noreferrer"
                              target="_blank">
                              <icon-download class="h-4 w-4" />
                            </a>
                          </li>
                        </ul>
                      </accordion-content>
                    </accordion-item>
                  </accordion>
                </div>
              </div>
            </card>
          </tabs-content>

          <!-- Settings Tab Content -->
          <tabs-content value="settings">
            <card class="bg-card p-4 rounded-lg">
              <div class="auto-rows-auto grid grid-cols-1 gap-6">
                <form-field
                  v-slot="{ componentField }"
                  name="new_password">
                  <form-item>
                    <form-label>New Password</form-label>
                    <form-control>
                      <form-input
                        v-model="newPassword"
                        :disabled="isSubmittingPassword"
                        password-toggle
                        type="password"
                        v-bind="componentField" />
                    </form-control>
                  </form-item>
                </form-field>
                <form-field
                  v-slot="{ componentField }"
                  name="confirm_password">
                  <form-item>
                    <form-label>Confirm Password</form-label>
                    <form-control>
                      <form-input
                        v-model="confirmPassword"
                        :disabled="isSubmittingPassword"
                        password-toggle
                        type="password"
                        v-bind="componentField" />
                    </form-control>
                  </form-item>
                </form-field>
                <div class="flex justify-end items-center">
                  <ui-button
                    :disabled="isSubmittingPassword"
                    :loading="isSubmittingPassword"
                    @click="handleUpdatePassword">
                    Update Password
                  </ui-button>
                </div>
                <separator />
                <div class="flex items-start flex-col">
                  <typography class="font-bold mb-2 text-destructive">
                    Danger Zone
                  </typography>
                  <ui-button
                    variant="destructive"
                    @click="isDeleteAccountDialogOpen = true">
                    Delete Account
                  </ui-button>
                </div>
              </div>
            </card>
          </tabs-content>
        </tabs>
      </div>
    </div>

    <!--    Dialogs-->
    <manage-subscription-dialog
      :is-open="isManageSubscriptionOpen"
      :selected-plan="selectedPlan"
      :subscription-data="( subscriptionData as SubscriptionApiResponse )"
      @on-close="isManageSubscriptionOpen = false" />

    <update-payment-method-dialog
      :is-open="isUpdatePaymentDialogOpen"
      @on-close="isUpdatePaymentDialogOpen = false" />

    <delete-account-dialog
      :is-open="isDeleteAccountDialogOpen"
      @on-close="isDeleteAccountDialogOpen = false" />
  </div>
</template>
