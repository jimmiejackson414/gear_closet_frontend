import { graphql } from '@/generated';

export const updateItemDocument = graphql(`
  mutation UpdateItem($id: Int!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      item {
        ...Item
      }
      errors {
        ...BaseError
      }
    }
  }
`);