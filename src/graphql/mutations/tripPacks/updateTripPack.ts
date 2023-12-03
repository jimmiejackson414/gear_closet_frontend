import { graphql } from '@/generated';

export const updateTripPackDocument = graphql(`
  mutation UpdateTripPack($input: UpdateTripPackInput!) {
    updateTripPack(input: $input) {
      pack {
        ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);