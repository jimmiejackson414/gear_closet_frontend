import { graphql } from '@/generated';

export const createReplyDocument = graphql(`
  mutation CreateReply ($input: CreateReplyInput!) {
    createReply(input: $input) {
      reply {
        ...Reply

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