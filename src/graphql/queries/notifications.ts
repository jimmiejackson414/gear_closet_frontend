import { graphql } from '@/generated';

export const notificationsDocument = graphql(`
  query Notifications($input: NotificationsInput!) {
    notifications(input:$input) {
      notifications {
        ...Notification
      }
      totalCount
      errors {
        ...BaseError
      }
    }
  }
`);