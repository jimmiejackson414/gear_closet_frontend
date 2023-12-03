import { graphql } from '@/generated';

export const closetDocument = graphql(`
  query ClosetPage($input: ClosetInput) {
    closet(input:$input) {
      packs {
        ...Pack
      }
      selectedPack {
        ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);