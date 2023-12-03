import { graphql } from '@/generated';

export const createShoppingItemDocument = graphql(`
  mutation CreateShoppingItem($input: CreateShoppingItemInput!) {
    createShoppingItem(input: $input) {
      item {
        ...ShoppingItem
      }
      errors {
        ...BaseError
      }
    }
  }
`);