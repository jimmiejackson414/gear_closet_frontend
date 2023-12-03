import { graphql } from '@/generated';

export const removePollDocument = graphql(`
  mutation RemovePoll($input: RemovePollInput!) {
    removePoll(input: $input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);