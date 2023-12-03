import { graphql } from '@/generated';

export const subscriptionDocument = graphql(`
  query Subscription {
    subscription {
      errors {
        ...BaseError
      }
      data {
        subscription {
          ...StripeSubscription
        }
        billingHistory {
          ...StripeInvoice
        }
      }
    }
  }
`);