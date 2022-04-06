import { gql } from '@apollo/client';
export const GET_TODOS = gql`
query getTodos {
  todos {
    done
    id
    text
  }
}
`
export const TOGGLE_TODO = gql`
mutation toggleTodo($id: uuid!, $done: Boolean!) {
  update_todos(where: {id: { _eq: $id }}, _set: { done: $done }) {
    returning {
      done
      id
      text
    }
  }
}
`
export const ADD_TODO = gql`
mutation addTodo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`
export const DELETE_TODO = gql`
mutation deleteTodo($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`
export const DELETE_COMPLETED_TODO = gql`
 mutation deleteCompletedTodo {
  delete_todos(where: {done : {_eq : true}}){
    returning {
      done
      id
      text
    }
  }
 }
`;

