import { graphql } from '@/generated';

export const friendsDocument = graphql(`
  query Friends($input: FriendsQueryInput) {
    friends(input: $input) {
      friends {
        ...Friend
      }
      count
      errors {
        ...BaseError
      }
    }
  }
`);