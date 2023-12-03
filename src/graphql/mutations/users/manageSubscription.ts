import { graphql } from '@/generated';

export const manageSubscriptionDocument = graphql(`
  mutation ManageSubscription {
    manageSubscription {
      session {
        ...StripeSession
      }
      errors {
        ...BaseError
      }
    }
  }
`);