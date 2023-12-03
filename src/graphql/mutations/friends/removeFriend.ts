import { graphql } from '@/generated';

export const removeFriendDocument = graphql(`
  mutation RemoveFriend ($input: RemoveFriendInput!) {
    removeFriend(input: $input) {
      friend {
        ...Friend
      }
      errors {
        ...BaseError
      }
    }
  }
`);