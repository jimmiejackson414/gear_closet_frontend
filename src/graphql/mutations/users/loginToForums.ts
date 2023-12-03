import { graphql } from '@/generated';

export const loginToForumsDocument = graphql(`
  mutation LoginToForums($input: DiscourseInput!) {
    loginToForums(input: $input) {
      success
      redirect
      errors {
        ...BaseError
      }
    }
  }
`);