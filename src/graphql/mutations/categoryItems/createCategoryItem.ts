import { graphql } from '@/generated';

export const createCategoryItemDocument = graphql(`
  mutation CreateCategoryItem($input: CreateCategoryItemInput!) {
    createCategoryItem(input: $input) {
      category_item {
        ...CategoryItem
      }
      errors {
        ...BaseError
      }
    }
  }
`);