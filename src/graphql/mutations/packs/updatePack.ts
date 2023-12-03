import { graphql } from '@/generated';

export const updatePackDocument = graphql(`
  mutation UpdatePack($id: Int!, $input: UpdatePackInput!) {
    updatePack(id: $id, input: $input) {
      pack {
        ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);