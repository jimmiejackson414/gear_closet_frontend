import { graphql } from '@/generated';

export const createTripDocument = graphql(`
  mutation CreateTrip($input: CreateTripInput!) {
    createTrip(input:$input) {
      data {
        ...Trip
      }
      errors {
        ...BaseError
      }
    }
  }
`);