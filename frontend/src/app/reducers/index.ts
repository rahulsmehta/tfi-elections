import { combineReducers } from 'redux';
import { RootState } from './state';
import { todoReducer } from './todos';
import { electionReducer } from "./elections";
import { userReducer } from "./user";

export { RootState };

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<Partial<RootState>>({
  todos: todoReducer as any,
  elections: electionReducer as any,
  user: userReducer as any,
});
