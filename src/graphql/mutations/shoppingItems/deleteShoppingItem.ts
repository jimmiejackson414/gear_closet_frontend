import { graphql } from '@/generated';

export const deleteShoppingItemDocument = graphql(`
  mutation DeleteShoppingItem($input: DeleteShoppingItemInput!) {
    deleteShoppingItem(input:$input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);