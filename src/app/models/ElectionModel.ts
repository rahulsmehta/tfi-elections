import { IconName } from "@blueprintjs/core";

export interface Election {
  id: string;
  position: string;
  icon: IconName;
  state: Election.ElectionState;
  startingCandidates: Candidate[];
  currentCandidates: Candidate[];
}

export interface Candidate {
    id: string;
    name: string;
}

export namespace Election {
  export enum ElectionState {
    ACTIVE = 'active',
    CLOSED = 'closed',
    COMPLETED = 'completed'
  }
}
