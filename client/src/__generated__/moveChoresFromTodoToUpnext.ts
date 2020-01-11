/* tslint:disable */
// This file was automatically generated and should not be edited.

import { RecurrenceType, TodoState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: moveChoresFromTodoToUpnext
// ====================================================

export interface moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext {
  __typename: "Chore";
  name: string;
  assignee: moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext_effortRatings[];
  todoState: TodoState;
  lockedToUser: moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext_lockedToUser | null;
}

export interface moveChoresFromTodoToUpnext {
  moveChoresFromTodoToUpnext: moveChoresFromTodoToUpnext_moveChoresFromTodoToUpnext[];
}
