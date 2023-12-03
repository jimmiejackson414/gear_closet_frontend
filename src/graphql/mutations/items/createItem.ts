import { graphql } from '@/generated';

export const createItemDocument = graphql(`
  mutation CreateItem($category_id: Int!, $input: CreateItemInput!) {
    createItem(category_id: $category_id, input: $input) {
      category_item {
        ...CategoryItem
      }
      errors {
        ...BaseError
      }
    }
  }
`);