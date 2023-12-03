import { graphql } from '@/generated';

export const inviteFriendDocument = graphql(`
  mutation InviteFriend($input: InviteFriendInput!) {
    inviteFriend(input:$input) {
      result {
        ...BaseUser

        friend {
          ...Friend
        }

        tripsCount
        packsCount
      }

      errors {
        ...BaseError
      }
    }
  }
`);