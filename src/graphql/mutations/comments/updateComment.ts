import { graphql } from '@/generated';

export const updateCommentDocument = graphql(`
  mutation UpdateComment ($id: Int!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      comment {
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
      errors {
        ...BaseError
      }
    }
  }
`);