import { graphql } from '@/generated';

export const setSessionDocument = graphql(`
  mutation SetSession($input: SetSessionInput!) {
    setSession(input: $input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);
