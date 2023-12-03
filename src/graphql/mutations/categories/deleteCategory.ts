import { graphql } from '@/generated';

export const deleteCategoryDocument = graphql(`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id) {
      category {
        id
      }
      errors {
        ...BaseError
      }
    }
  }
`);