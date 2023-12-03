import { graphql } from '@/generated';

export const removeFromTripDocument = graphql(`
  mutation RemoveFromTrip($input: RemoveFromTripInput!) {
    removeFromTrip(input: $input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);