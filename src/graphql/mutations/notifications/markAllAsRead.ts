import { graphql } from '@/generated';

export const markAllAsReadDocument = graphql(`
  mutation MarkAllAsRead($user_id: ID!) {
    markAllAsRead(user_id: $user_id) {
      notifications {
        ...Notification
      }
      errors {
        ...BaseError
      }
    }
  }
`);