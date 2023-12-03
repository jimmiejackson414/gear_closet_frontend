import { graphql } from '@/generated';

export const updateNotificationDocument = graphql(`
  mutation UpdateNotification($input: UpdateNotificationInput!) {
    updateNotification(input: $input) {
      notification {
        ...Notification
      }
      errors {
        ...BaseError
      }
    }
  }
`);