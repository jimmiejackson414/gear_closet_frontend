import { graphql } from '@/generated';

export const fetchDashboardDocument = graphql(`
  query FetchDashboard {
    fetchDashboard {
      data {
        upcomingTrips {
          ...Trip
        }
        news {
          ...News
        }
        friends {
          ...Friend
        }
        invitations {
          ...TripFriend

          trip {
            ...Trip

            user {
              ...BaseUser
            }
          }
          user {
            ...BaseUser
          }
        }
      }
      errors {
        ...BaseError
      }
    }
  }
`);