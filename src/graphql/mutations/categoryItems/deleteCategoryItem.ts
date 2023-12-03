import { graphql } from '@/generated';

export const deleteCategoryItemDocument = graphql(`
  mutation DeleteCategoryItem($input: DeleteCategoryItemInput!) {
    deleteCategoryItem(input: $input) {
      category_item {
        id
        category_id
        item_id
        position
        created_at
        updated_at
      }
      errors {
        ...BaseError
      }
    }
  }
`);