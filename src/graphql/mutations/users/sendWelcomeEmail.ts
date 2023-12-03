import { graphql } from '@/generated';

export const sendWelcomeEmailDocument = graphql(`
  mutation SendWelcomeEmail {
    sendWelcomeEmail {
      success
      errors {
        ...BaseError
      }
    }
  }
`);