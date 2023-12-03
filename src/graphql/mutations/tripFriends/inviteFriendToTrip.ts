import { graphql } from '@/generated';

export const inviteFriendToTripDocument = graphql(`
  mutation AddFriend($input: InviteFriendsToTripInput!) {
    inviteFriendsToTrip(input:$input) {
      friends {
        ...TripFriend
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