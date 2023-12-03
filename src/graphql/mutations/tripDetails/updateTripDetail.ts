import { graphql } from '@/generated';

export const updateTripDetailDocument = graphql(`
  mutation UpdateTripDetail($input: UpdateTripDetailInput!) {
    updateTripDetail(input: $input) {
      tripDetail {
        ...TripDetail
      }
      errors {
        ...BaseError
      }
    }
  }
`);