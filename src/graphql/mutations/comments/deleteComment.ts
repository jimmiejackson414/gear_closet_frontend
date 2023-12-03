import { graphql } from '@/generated';

export const deleteCommentDocument = graphql(`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      success 
      errors {
        ...BaseError
      }
    }
  }
`);