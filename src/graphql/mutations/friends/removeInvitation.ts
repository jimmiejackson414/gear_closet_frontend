import { graphql } from '@/generated';

export const removeInvitationDocument = graphql(`
  mutation RemoveInvitation ($input: RemoveInvitationInput!) {
    removeInvitation (input: $input) {
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