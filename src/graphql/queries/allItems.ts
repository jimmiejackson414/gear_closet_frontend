import { graphql } from '@/generated';

export const allItemsDocument = graphql(`
  query AllItems {
    allItems {
      items {
        ...Item
      }
      errors {
        ...BaseError
      }
    }
  }
`);