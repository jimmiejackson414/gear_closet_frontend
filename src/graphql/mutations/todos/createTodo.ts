import { graphql } from '@/generated';

export const createTodoDocument = graphql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      todo {
        ...Todo
      }
      errors {
        ...BaseError
      }
    }
  }
`);