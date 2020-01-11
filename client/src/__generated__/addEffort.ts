/* tslint:disable */
// This file was automatically generated and should not be edited.

import { RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addEffort
// ====================================================

export interface addEffort_createEffortRating_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface addEffort_createEffortRating_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface addEffort_createEffortRating_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface addEffort_createEffortRating {
  __typename: "Chore";
  name: string;
  assignee: addEffort_createEffortRating_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: addEffort_createEffortRating_effortRatings[];
  todoState: TodoState;
  lockedToUser: addEffort_createEffortRating_lockedToUser | null;
}

export interface addEffort {
  createEffortRating: addEffort_createEffortRating;
}

export interface addEffortVariables {
  userId?: string | null;
  choreId: string;
  effortRating: number;
}
