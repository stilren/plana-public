/* tslint:disable */
// This file was automatically generated and should not be edited.

import { RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL query operation: getTodos
// ====================================================

export interface getTodos_chores_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface getTodos_chores_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface getTodos_chores_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface getTodos_chores {
  __typename: "Chore";
  name: string;
  assignee: getTodos_chores_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: getTodos_chores_effortRatings[];
  todoState: TodoState;
  lockedToUser: getTodos_chores_lockedToUser | null;
}

export interface getTodos {
  chores: getTodos_chores[];
}
