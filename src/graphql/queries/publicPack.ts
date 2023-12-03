import { graphql } from '@/generated';

export const publicPackDocument = graphql(`
  query PublicPack($input:PackInput!) {
    publicPack(input:$input) {
      pack {
        ...Pack

        comments {
          ...Comment

          user {
            ...BaseUser
          }

          replies {
            ...Reply

            user {
              ...BaseUser
            }
          }
        }
      }
      user {
        ...BaseUser
      }
      errors {
        ...BaseError
      }
    }
  }
`);