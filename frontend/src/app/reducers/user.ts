import { handleActions } from 'redux-actions';
import { RootState } from './state';
// import { Election } from "../models";
// import { TodoActions } from 'app/actions/todos';
// import { TodoModel } from 'app/models';

const initialState: RootState.UserState = "rahulm";

export const userReducer = handleActions<RootState.UserState>(
  {},
  initialState
);
