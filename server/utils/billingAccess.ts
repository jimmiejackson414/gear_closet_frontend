export type BillingCustomerRow = {
  stripe_customer_id: string | null;
} | null;

export type SubscriptionBillingRow = {
  stripe_subscription_id: string | null;
} | null;

type AccessFailure = {
  ok: false;
  statusCode: 404 | 500;
  statusMessage: string;
};

type CustomerAccessSuccess = {
  ok: true;
  stripeCustomerId: string;
};

type SubscriptionAccessSuccess = {
  ok: true;
  stripeSubscriptionId: string;
};

export function resolveBillingCustomerAccess (
  customer: BillingCustomerRow,
  hasQueryError: boolean,
): CustomerAccessSuccess | AccessFailure {
  if (hasQueryError) {
    return {
      ok: false,
      statusCode: 500,
      statusMessage: 'Error fetching customer',
    };
  }

  if (!customer?.stripe_customer_id) {
    return {
      ok: false,
      statusCode: 404,
      statusMessage: 'No billing customer on file',
    };
  }

  return {
    ok: true,
    stripeCustomerId: customer.stripe_customer_id,
  };
}

export function resolveSubscriptionBillingAccess (
  subscription: SubscriptionBillingRow,
  hasQueryError: boolean,
): SubscriptionAccessSuccess | AccessFailure {
  if (hasQueryError) {
    return {
      ok: false,
      statusCode: 500,
      statusMessage: 'Error fetching subscription',
    };
  }

  if (!subscription?.stripe_subscription_id) {
    return {
      ok: false,
      statusCode: 404,
      statusMessage: 'No subscription on file',
    };
  }

  return {
    ok: true,
    stripeSubscriptionId: subscription.stripe_subscription_id,
  };
}
