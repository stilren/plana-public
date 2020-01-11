/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ChoreStatus, RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL query operation: getChores
// ====================================================

export interface getChores_chores_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface getChores_chores_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface getChores_chores_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface getChores_chores {
  __typename: "Chore";
  name: string;
  assignee: getChores_chores_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: getChores_chores_effortRatings[];
  todoState: TodoState;
  lockedToUser: getChores_chores_lockedToUser | null;
}

export interface getChores {
  chores: getChores_chores[];
}

export interface getChoresVariables {
  choreStatus?: (ChoreStatus | null)[] | null;
}
