import { graphql } from '@/generated';

export const packsDocument = graphql(`
  query Packs {
    packs {
      packs {
        ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);