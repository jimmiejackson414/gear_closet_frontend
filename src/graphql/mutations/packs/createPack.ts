import { graphql } from '@/generated';

export const createPackDocument = graphql(`
  mutation CreatePack($input: CreatePackInput!) {
    createPack(input: $input) {
      pack {
        ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);