import { graphql } from '@/generated';

export const createAnswerDocument = graphql(`
  mutation CreateAnswer ($input: CreateAnswerInput!) {
    createAnswer (input: $input) {
      answer {
        ...Answer
      }
      errors {
        ...BaseError
      }
    }
  }
`);