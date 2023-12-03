import { graphql } from '@/generated';

export const deleteReplyDocument = graphql(`
  mutation DeleteReply ($id: Int!) {
    deleteReply(id: $id) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);