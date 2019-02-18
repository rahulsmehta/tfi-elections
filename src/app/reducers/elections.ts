import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { Election, Candidate } from "../models";
// import { TodoActions } from 'app/actions/todos';
// import { TodoModel } from 'app/models';

const candidates: Candidate[] = [
  {
    id: "000",
    name: "Rahul Mehta"
  },
  {
    id: "001",
    name: "Dan Sullivan"
  },
  {
    id: "002",
    name: "Dirty Martini"
  },
]

const initialState: RootState.ElectionState = [
  {
    id: "000-000-000",
    state: Election.ElectionState.COMPLETED,
    position: "President",
    icon: "globe",
    startingCandidates: candidates,
    currentCandidates: candidates 
  },
  {
    id: "000-000-001",
    state: Election.ElectionState.ACTIVE,
    position: "Vice President",
    icon: "globe-network",
    startingCandidates: candidates,
    currentCandidates: candidates 
  },
  {
    id: "000-000-002",
    state: Election.ElectionState.CLOSED,
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
