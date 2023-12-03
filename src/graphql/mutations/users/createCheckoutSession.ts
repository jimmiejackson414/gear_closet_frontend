import { graphql } from '@/generated';

export const createCheckoutSessionDocument = graphql(`
  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input) {
      session {
        ...StripeSession
      }
      errors {
        ...BaseError
      }
    }
  }
`);