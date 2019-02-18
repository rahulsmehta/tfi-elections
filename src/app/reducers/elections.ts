import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { Election } from "../models";
// import { TodoActions } from 'app/actions/todos';
// import { TodoModel } from 'app/models';

const initialState: RootState.ElectionState = [
  {
    id: "000-000-000",
    state: Election.ElectionState.ACTIVE,
    position: "President",
    icon: "globe",
    startingCandidates: [],
    currentCandidates: []
  },
  {
    id: "000-000-001",
    state: Election.ElectionState.CLOSED,
    position: "Vice President",
    icon: "globe-network",
    startingCandidates: [],
    currentCandidates: []
  },
  {
    id: "000-000-002",
    state: Election.ElectionState.COMPLETED,
    position: "Treasurer",
    icon: "dollar",
    startingCandidates: [],
    currentCandidates: []
  },
  {
    id: "000-000-003",
    state: Election.ElectionState.CLOSED,
    position: "Social Chair",
    icon: "people",
    startingCandidates: [],
    currentCandidates: []
  },
  {
    id: "000-000-004",
    state: Election.ElectionState.CLOSED,
    position: "Safety Czar",
    icon: "shield",
    startingCandidates: [],
    currentCandidates: []
  },
  {
    id: "000-000-005",
    state: Election.ElectionState.CLOSED,
    position: "House Manager",
    icon: "home",
    startingCandidates: [],
    currentCandidates: []
  }
];

export const electionReducer = handleActions<RootState.ElectionState, Election>(
  {},
  initialState
);
