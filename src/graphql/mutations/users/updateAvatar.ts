import { graphql } from '@/generated';

export const updateAvatarDocument = graphql(`
  mutation UpdateAvatar($input: UpdateAvatarInput!) {
    updateAvatar(input: $input) {
      user {
        ...BaseUser
      }
      errors {
        ...BaseError
      }
    }
  }
`);