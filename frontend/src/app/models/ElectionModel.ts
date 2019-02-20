import { IconName } from "@blueprintjs/core";

export interface Election {
  id: string;
  position: string;
  icon: IconName;
  state: Election.ElectionState;
  startingCandidates: string[];
  currentCandidates: string[];
  round: number;
}

export namespace Election {
  export enum ElectionState {
    ACTIVE = 'active',
    CLOSED = 'closed',
    COMPLETED = 'completed'
  }
}
