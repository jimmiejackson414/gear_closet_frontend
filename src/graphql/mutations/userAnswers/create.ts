import { graphql } from '@/generated';

export const createUserAnswerDocument = graphql(`
  mutation CreateUserAnswer($input: CreateUserAnswerInput!) {
    createUserAnswer(input:$input) {
      userAnswer {
        ...UserAnswer
      }
      errors {
        ...BaseError
      }
    }
  }
`);