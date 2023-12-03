import { graphql } from '@/generated';

export const updateReplyDocument = graphql(`
  mutation UpdateReply ($id: Int!, $input: UpdateReplyInput!) {
    updateReply(id: $id, input: $input) {
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