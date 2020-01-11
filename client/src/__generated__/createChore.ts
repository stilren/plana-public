/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ChoreInput, RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createChore
// ====================================================

export interface createChore_createChore_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface createChore_createChore_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface createChore_createChore_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface createChore_createChore {
  __typename: "Chore";
  name: string;
  assignee: createChore_createChore_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: createChore_createChore_effortRatings[];
  todoState: TodoState;
  lockedToUser: createChore_createChore_lockedToUser | null;
}

export interface createChore {
  createChore: createChore_createChore;
}

export interface createChoreVariables {
  choreInput: ChoreInput;
}
