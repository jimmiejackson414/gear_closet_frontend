import { graphql } from '@/generated';

export const updateTripDetailsDocument = graphql(`
  mutation UpdateTripDetails($input: UpdateTripDetailsInput!) {
    updateTripDetails(input: $input) {
      tripDetails {
        ...TripDetail
      }
      errors {
        ...BaseError
      }
    }
  }
`);