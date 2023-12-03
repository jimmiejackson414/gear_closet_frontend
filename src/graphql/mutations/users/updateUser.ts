import { graphql } from '@/generated';

export const updateUserDocument = graphql(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        ...BaseUser
      }
      errors {
        ...BaseError
      }
    }
  }
`);