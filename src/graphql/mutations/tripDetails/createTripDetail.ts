import { graphql } from '@/generated';

export const createTripDetailDocument = graphql(`
  mutation CreateTripDetail($input: CreateTripDetailInput!) {
    createTripDetail(input:$input) {
      tripDetail {
        ...TripDetail
      }
      errors {
        ...BaseError
      }
    }
  }
`);