import { graphql } from '@/generated';

export const deleteItemDocument = graphql(`
  mutation DeleteItem($input: DeleteItemInput!) {
      deleteItem(input: $input) {
        item {
          ...Item
        }
        errors {
          ...BaseError
        }
      }
  }
`);