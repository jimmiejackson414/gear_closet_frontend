<template>
  <div class="subscription-wrapper">
    <q-list v-if="!loading && !error">
      <q-expansion-item
        group="subscription_group"
        icon="bi-person-circle"
        class="subscription-details"
        :label="planLevel"
        default-opened>
        <q-card>
          <q-card-section>
            <p class="text-body2 text-weight-bold q-ma-none title">
              Subscription Details
            </p>
            <q-list>
              <q-item class="q-pl-none">
                <q-item-section>
                  <q-item-label>Payment Method</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="card-details">
                    <img
                      :src="paymentMethodIcon"
                      class="card-icon"
                      alt="MasterCard">
                    {{ formatCard }}
                  </div>
                </q-item-section>
              </q-item>
              <q-item class="q-pl-none">
                <q-item-section>
                  <q-item-label>Next Billing Date</q-item-label>
                </q-item-section>
                <q-item-section side>
                  {{ formatNextBillingDate }}
                </q-item-section>
              </q-item>
              <q-item class="q-pl-none">
                <q-item-section>
                  <q-item-label>Last Payment</q-item-label>
                </q-item-section>
                <q-item-section side>
                  {{ formatLastPayment }}
                </q-item-section>
              </q-item>
            </q-list>
            <div class="row justify-end q-mt-md">
              <q-btn
                color="secondary"
                outline
                :loading="loadingStripeSession"
                @click="handleManageSubscription">
                Manage Subscription
              </q-btn>
              <p
                v-if="stripeSessionError"
                class="text-body2 text-negative text-right q-mt-md">
                An error occurred loading the Stripe session. Please either try again, or contact support at&nbsp;
                <a href="mailto:support@gearcloset.io">support@gearcloset.io</a>
              </p>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item
        group="subscription_group"
        icon="bi-receipt"
        class="billing-history"
        label="Billing History">
        <q-card>
          <q-card-section>
            <q-table
              :rows="rows"
              :columns="columns"
              row-key="name"
              hide-bottom
              virtual-scroll
              style="height: 400px;"
              flat>
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="date">
                    <a
                      :href="props.row.url"
                      target="_blank"
                      noopener
                      noreferrer>
                      {{ props.row.date }}
                    </a>
                  </q-td>

                  <q-td key="description">
                    {{ props.row.description }}
                  </q-td>

                  <q-td
                    key="amount"
                    class="text-right">
                    {{ props.row.amount }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div
      v-else-if="loading"
      class="row justify-center">
      <q-spinner
        size="3em"
        color="primary" />
    </div>
    <div
      v-else-if="error"
      class="row justify-center">
      <div class="col col-10 text-center">
        <h6 class="text-h6 text-negative q-mb-none">
          An error occurred.
        </h6>
        <p class="text-body1">
          An error occurred fetching your subscription details. If the error persists, please email support at <a
            class="text-primary"
            href="mailto:support@gearcloset.io">support@gearcloset.io</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { computed, onMounted, ref } from 'vue';
  import { QTableProps } from 'quasar';
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';
  import { User } from '@/generated/types';
  import { capitalize } from '@/helpers/functions';
  import { fetchCardType } from '@/helpers';
  import { useSubscriptionStore } from '@/stores/subscription';

  interface Props {
    currentUser?: User | null;
  }

  const columns = [
    {
      name: 'Date', field: 'date', label: 'Date', align: 'left',
    },
    {
      name: 'Description', field: 'description', label: 'Description', align: 'left',
    },
    {
      name: 'Total', field: 'amount', label: 'Amount', align: 'right',
    },
  ] as QTableProps['columns'];

  const rows = ref<QTableProps['rows']>([]);

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { currentUser } = defineProps<Props>();
  const loading = ref(true);
  const loadingStripeSession = ref(false);
  const error = ref(false);
  const stripeSessionError = ref(false);
  const $store = useSubscriptionStore();
  const { subscription, subscriptionError } = storeToRefs($store);

  const planLevel = computed(() => `Subscription (${capitalize(currentUser?.subscription_level as string)})`);

  const formatNextBillingDate = computed(() => {
    const nextBillingDate = dayjs.unix(subscription.value?.subscription?.current_period_end)
      .add(1, 'day');
    return nextBillingDate.format('MMMM D, YYYY');
  });

  const formatLastPayment = computed(() => {
    const lastPaymentDate = dayjs.unix(subscription.value?.subscription?.latest_invoice?.created);
    const lastPaymentAmount = (subscription.value?.subscription?.latest_invoice?.total || 0) / 100;
    return `${lastPaymentDate.format('MMMM D, YYYY')} ($${lastPaymentAmount})`;
  });

  const formatCard = computed(() => {
    const card = subscription.value?.subscription?.latest_invoice?.charge?.payment_method_details?.card;
    return `**${card?.last4} ${capitalize(card?.brand)}`;
  });

  const paymentMethodIcon = computed(() => {
    const card = subscription.value?.subscription?.latest_invoice?.charge?.payment_method_details?.card;
    return fetchCardType(card?.brand);
  });

  const handleManageSubscription = async (): Promise<void> => {
    loadingStripeSession.value = true;

    const { session, errors } = await $store.manageSubscription();

    if (session && !errors) {
      window.location.href = session.url as string;
    } else {
      stripeSessionError.value = true;
    }

    loadingStripeSession.value = false;
  };

  onMounted(async () => {
    await $store.fetchSubscription();
    loading.value = false;

    if (!subscription.value && subscriptionError.value) {
      error.value = true;
    } else {
      error.value = false;
      rows.value = subscription.value?.billingHistory.map(invoice => ({
        date: dayjs.unix(invoice!.created)
          .format('MMMM D, YYYY'),
        description: invoice?.lines?.data?.[0]?.description || '',
        amount: `$${(invoice!.total || 0) / 100}`,
        url: invoice!.hosted_invoice_url,
      }));
    }
  });
</script>

<style lang="scss" scoped>
  .subscription-wrapper {
    .subscription-details,
    .billing-history {
      .q-card {
        padding-left: 56px;
      }

      .card-details {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-gap: 0.5rem;
        align-items: center;

        .card-icon {
          border-radius: 5px;
          max-height: 24px;
          width: 100%;
        }
      }
    }
  }
</style>
