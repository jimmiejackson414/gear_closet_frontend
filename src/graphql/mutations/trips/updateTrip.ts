import { graphql } from '@/generated';

export const updateTripDocument = graphql(`
  mutation UpdateTrip($input: UpdateTripInput!) {
    updateTrip(input: $input) {
      data {
        ...Trip
      }
      errors {
        ...BaseError
      }
    }
  }
`);