import { graphql } from '@/generated';

export const packDocument = graphql(`
  query Pack($input: PackInput!) {
    pack(input: $input) {
      pack {
        ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);