/* tslint:disable */
// This file was automatically generated and should not be edited.

import { LockedToUserInput, TodoState, RecurrenceType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: LockChoreToUser
// ====================================================

export interface LockChoreToUser_lockChoreToUser_effortRatings_user {
  __typename: "User";
  id: string;
  givenName: string | null;
  name: string;
}

export interface LockChoreToUser_lockChoreToUser_effortRatings {
  __typename: "EffortRating";
  id: string;
  user: LockChoreToUser_lockChoreToUser_effortRatings_user;
  effort: number;
}

export interface LockChoreToUser_lockChoreToUser_household_members {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface LockChoreToUser_lockChoreToUser_household {
  __typename: "Household";
  id: string;
  members: LockChoreToUser_lockChoreToUser_household_members[];
  name: string;
}

export interface LockChoreToUser_lockChoreToUser_assignee {
  __typename: "User";
  id: string;
}

export interface LockChoreToUser_lockChoreToUser_lockedToUser {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface LockChoreToUser_lockChoreToUser {
  __typename: "Chore";
  name: string;
  id: string;
  description: string | null;
  effortRatings: LockChoreToUser_lockChoreToUser_effortRatings[];
  household: LockChoreToUser_lockChoreToUser_household;
  assignee: LockChoreToUser_lockChoreToUser_assignee | null;
  todoState: TodoState;
  isUpnext: boolean;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  recurringLastOccurence: any | null;
  lockedToUser: LockChoreToUser_lockChoreToUser_lockedToUser | null;
}

export interface LockChoreToUser {
  lockChoreToUser: LockChoreToUser_lockChoreToUser;
}

export interface LockChoreToUserVariables {
  input: LockedToUserInput;
}
