import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { Election  } from "../models";

const candidates = ["PJ", "Rahul"];

const initialState: RootState.ElectionState = [
  {
    id: "000-000-000",
    state: Election.ElectionState.COMPLETED,
    position: "President",
    icon: "globe",
    startingCandidates: candidates,
    currentCandidates: candidates,
    round: 0
  },
  {
    id: "000-000-001",
    state: Election.ElectionState.ACTIVE,
    position: "Vice President",
    icon: "globe-network",
    startingCandidates: candidates,
    currentCandidates: candidates,
    round: 0
  },
  {
    id: "000-000-002",
    state: Election.ElectionState.CLOSED,
    position: "Treasurer",
    icon: "dollar",
    startingCandidates: [],
    currentCandidates: [],
    round: 0

  },
  {
    id: "000-000-003",
    state: Election.ElectionState.CLOSED,
    position: "Social Chair",
    icon: "people",
    startingCandidates: [],
    currentCandidates: [],
    round: 0
  },
  {
    id: "000-000-004",
    state: Election.ElectionState.CLOSED,
    position: "Safety Czar",
    icon: "shield",
    startingCandidates: [],
    currentCandidates: [],
    round: 0

  },
  {
    id: "000-000-005",
    state: Election.ElectionState.CLOSED,
    position: "House Manager",
    icon: "home",
    startingCandidates: [],
    currentCandidates: [],
    round: 0

  }
];

export const electionReducer = handleActions<RootState.ElectionState, Election>(
  {},
  initialState
);
