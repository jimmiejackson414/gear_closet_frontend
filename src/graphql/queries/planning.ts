import { graphql } from '@/generated';

export const planningDocument = graphql(`
  query PlanningPage($input: PlanningInput) {
    planning(input:$input) {
      trips {
        ...Trip
      }

      pack {
        ...Pack
      }

      tripDetails {
        ...TripDetail
      }

      todos {
        ...Todo
      }

      shoppingItems {
        ...ShoppingItem
      }

      friends {
        ...TripFriend

        user {
          ...BaseUser
        }
      }

      poll {
        ...Poll
      }

      errors {
        ...BaseError
      }
    }
  }
`);