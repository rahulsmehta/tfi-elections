import { TodoModel, Election } from 'app/models';

export interface RootState {
  user: RootState.UserState;
  todos: RootState.TodoState;
  elections: RootState.ElectionState;
  router?: any;
}

export namespace RootState {
  export type TodoState = TodoModel[];
  export type ElectionState = Election[];
  export type UserState = string | undefined;
}
