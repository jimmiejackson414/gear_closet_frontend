import { graphql } from '@/generated';

export const updatePasswordDocument = graphql(`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);