/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ChoreInput, TodoState, RecurrenceType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateChore
// ====================================================

export interface updateChore_updateChore_effortRatings_user {
  __typename: "User";
  id: string;
  givenName: string | null;
  name: string;
}

export interface updateChore_updateChore_effortRatings {
  __typename: "EffortRating";
  id: string;
  user: updateChore_updateChore_effortRatings_user;
  effort: number;
}

export interface updateChore_updateChore_household_members {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface updateChore_updateChore_household {
  __typename: "Household";
  id: string;
  members: updateChore_updateChore_household_members[];
  name: string;
}

export interface updateChore_updateChore_assignee {
  __typename: "User";
  id: string;
}

export interface updateChore_updateChore_lockedToUser {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface updateChore_updateChore {
  __typename: "Chore";
  name: string;
  id: string;
  description: string | null;
  effortRatings: updateChore_updateChore_effortRatings[];
  household: updateChore_updateChore_household;
  assignee: updateChore_updateChore_assignee | null;
  todoState: TodoState;
  isUpnext: boolean;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  recurringLastOccurence: any | null;
  lockedToUser: updateChore_updateChore_lockedToUser | null;
}

export interface updateChore {
  updateChore: updateChore_updateChore;
}

export interface updateChoreVariables {
  choreId: string;
  choreInput: ChoreInput;
}
