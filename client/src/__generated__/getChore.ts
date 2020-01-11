/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TodoState, RecurrenceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getChore
// ====================================================

export interface getChore_chore_effortRatings_user {
  __typename: "User";
  id: string;
  givenName: string | null;
  name: string;
}

export interface getChore_chore_effortRatings {
  __typename: "EffortRating";
  id: string;
  user: getChore_chore_effortRatings_user;
  effort: number;
}

export interface getChore_chore_household_members {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface getChore_chore_household {
  __typename: "Household";
  id: string;
  members: getChore_chore_household_members[];
  name: string;
}

export interface getChore_chore_assignee {
  __typename: "User";
  id: string;
}

export interface getChore_chore_lockedToUser {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface getChore_chore {
  __typename: "Chore";
  name: string;
  id: string;
  description: string | null;
  effortRatings: getChore_chore_effortRatings[];
  household: getChore_chore_household;
  assignee: getChore_chore_assignee | null;
  todoState: TodoState;
  isUpnext: boolean;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  recurringLastOccurence: any | null;
  lockedToUser: getChore_chore_lockedToUser | null;
}

export interface getChore {
  chore: getChore_chore | null;
}

export interface getChoreVariables {
  choreId: string;
}
