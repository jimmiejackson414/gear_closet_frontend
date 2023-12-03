import { graphql } from '@/generated';

export const createFreeSubscriptionDocument = graphql(`
  mutation CreateFreeSubscription($input: CreateFreeSubscriptionInput!) {
    createFreeSubscription (input: $input) {
      subscription {
        ...Subscription
      }
      errors {
        ...BaseError
      }
    }
  }
`);