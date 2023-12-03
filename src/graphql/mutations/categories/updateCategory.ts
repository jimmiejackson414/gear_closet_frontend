import { graphql } from '@/generated';

export const updateCategoryDocument = graphql(`
  mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      category {
        ...Category
      }
      errors {
        ...BaseError
      }
    }
  }
`);