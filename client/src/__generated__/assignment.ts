/* tslint:disable */
// This file was automatically generated and should not be edited.

import { RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: assignment
// ====================================================

export interface assignment_assignChores_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface assignment_assignChores_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface assignment_assignChores_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface assignment_assignChores {
  __typename: "Chore";
  name: string;
  assignee: assignment_assignChores_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: assignment_assignChores_effortRatings[];
  todoState: TodoState;
  lockedToUser: assignment_assignChores_lockedToUser | null;
}

export interface assignment {
  assignChores: assignment_assignChores[];
}

export interface assignmentVariables {
  choreIds: string[];
}
