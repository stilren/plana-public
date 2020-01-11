/* tslint:disable */
// This file was automatically generated and should not be edited.

import { RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL fragment: ChoreInList
// ====================================================

export interface ChoreInList_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface ChoreInList_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface ChoreInList_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface ChoreInList {
  __typename: "Chore";
  name: string;
  assignee: ChoreInList_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: ChoreInList_effortRatings[];
  todoState: TodoState;
  lockedToUser: ChoreInList_lockedToUser | null;
}
