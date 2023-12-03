import { graphql } from '@/generated';

export const updateShoppingItemDocument = graphql(`
  mutation UpdateShoppingItem($input: UpdateShoppingItemInput!) {
    updateShoppingItem(input: $input) {
      item {
        ...ShoppingItem
      }
      errors {
        ...BaseError
      }
    }
  }
`);