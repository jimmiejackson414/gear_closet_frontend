import { graphql } from '@/generated';

export const deleteTodoDocument = graphql(`
  mutation DeleteTodo($input: DeleteTodoInput!) {
    deleteTodo(input:$input) {
      success
      errors {
        ...BaseError
      }
    }
  }
`);