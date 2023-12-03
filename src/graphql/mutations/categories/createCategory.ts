import { graphql } from '@/generated';

export const createCategoryDocument = graphql(`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      category {
        ...Category
      }
      errors {
        ...BaseError
      }
    }
  }
`);