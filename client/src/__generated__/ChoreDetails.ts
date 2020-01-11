/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TodoState, RecurrenceType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ChoreDetails
// ====================================================

export interface ChoreDetails_effortRatings_user {
  __typename: "User";
  id: string;
  givenName: string | null;
  name: string;
}

export interface ChoreDetails_effortRatings {
  __typename: "EffortRating";
  id: string;
  user: ChoreDetails_effortRatings_user;
  effort: number;
}

export interface ChoreDetails_household_members {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface ChoreDetails_household {
  __typename: "Household";
  id: string;
  members: ChoreDetails_household_members[];
  name: string;
}

export interface ChoreDetails_assignee {
  __typename: "User";
  id: string;
}

export interface ChoreDetails_lockedToUser {
  __typename: "User";
  id: string;
  name: string;
  givenName: string | null;
}

export interface ChoreDetails {
  __typename: "Chore";
  name: string;
  id: string;
  description: string | null;
  effortRatings: ChoreDetails_effortRatings[];
  household: ChoreDetails_household;
  assignee: ChoreDetails_assignee | null;
  todoState: TodoState;
  isUpnext: boolean;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  recurringLastOccurence: any | null;
  lockedToUser: ChoreDetails_lockedToUser | null;
}
