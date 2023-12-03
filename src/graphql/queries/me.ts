import { graphql } from '@/generated';

export const meDocument = graphql(`
  query Me {
    me {
      user {
        ...BaseUser

        notifications {
          ...Notification
        }
      }
      errors {
        ...BaseError
      }
    }
  }
`);