import { graphql } from '@/generated';

export const createCommentDocument = graphql(`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        ...Comment

        user {
          ...BaseUser
        }

        replies {
          ...Reply
        }
      }
      errors {
        ...BaseError
      }
    }
  }
`);