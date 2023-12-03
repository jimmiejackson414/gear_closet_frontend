import { graphql } from '@/generated';

export const deleteTripDetailDocument = graphql(`
  mutation DeleteTripDetail($input: DeleteTripDetailInput!) {
    deleteTripDetail(input:$input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);