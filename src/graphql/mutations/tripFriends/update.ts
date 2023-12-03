import { graphql } from '@/generated';

export const updateTripFriendDocument = graphql(`
  mutation UpdateTripFriend($input: UpdateTripFriendInput!) {
    updateTripFriend(input: $input) {
      tripFriend {
        ...TripFriend

        trip {
          ...Trip

          user {
            ...BaseUser
          }
        }
        user {
          ...BaseUser
        }
      }
      errors {
        ...BaseError
      }
    }
  }
`);