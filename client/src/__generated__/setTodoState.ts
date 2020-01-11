/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TodoState, RecurrenceType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: setTodoState
// ====================================================

export interface setTodoState_setTodoState_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface setTodoState_setTodoState_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface setTodoState_setTodoState_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface setTodoState_setTodoState {
  __typename: "Chore";
  name: string;
  assignee: setTodoState_setTodoState_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: setTodoState_setTodoState_effortRatings[];
  todoState: TodoState;
  lockedToUser: setTodoState_setTodoState_lockedToUser | null;
}

export interface setTodoState {
  setTodoState: setTodoState_setTodoState;
}

export interface setTodoStateVariables {
  choreId: string;
  todoState: TodoState;
}
