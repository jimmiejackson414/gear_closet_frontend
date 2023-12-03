import { graphql } from '@/generated';

export const updateTodoDocument = graphql(`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      todo {
        ...Todo
      }
      errors {
        ...BaseError
      }
    }
  }
`);