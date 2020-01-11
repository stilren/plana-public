/* tslint:disable */
// This file was automatically generated and should not be edited.

import { RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateChoreUpnextState
// ====================================================

export interface updateChoreUpnextState_updateChoreUpnextState_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface updateChoreUpnextState_updateChoreUpnextState_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface updateChoreUpnextState_updateChoreUpnextState_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface updateChoreUpnextState_updateChoreUpnextState {
  __typename: "Chore";
  name: string;
  assignee: updateChoreUpnextState_updateChoreUpnextState_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: updateChoreUpnextState_updateChoreUpnextState_effortRatings[];
  todoState: TodoState;
  lockedToUser: updateChoreUpnextState_updateChoreUpnextState_lockedToUser | null;
}

export interface updateChoreUpnextState {
  updateChoreUpnextState: updateChoreUpnextState_updateChoreUpnextState;
}

export interface updateChoreUpnextStateVariables {
  isUpnext: boolean;
  choreId: string;
}
