import { graphql } from '@/generated';

export const createPollDocument = graphql(`
  mutation CreatePoll($input: CreatePollInput!) {
    createPoll(input: $input) {
      poll {
        ...Poll 
      }
      errors {
        ...BaseError
      }
    }
  }
`);