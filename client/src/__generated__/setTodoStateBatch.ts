/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TodoState, RecurrenceType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: setTodoStateBatch
// ====================================================

export interface setTodoStateBatch_setTodoStateBatch_assignee {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface setTodoStateBatch_setTodoStateBatch_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface setTodoStateBatch_setTodoStateBatch_lockedToUser {
  __typename: "User";
  givenName: string | null;
  name: string;
}

export interface setTodoStateBatch_setTodoStateBatch {
  __typename: "Chore";
  name: string;
  assignee: setTodoStateBatch_setTodoStateBatch_assignee | null;
  id: string;
  recurrenceType: RecurrenceType;
  recurringWeekCadence: number | null;
  recurringNextOccurence: any | null;
  isUpnext: boolean;
  effortRatings: setTodoStateBatch_setTodoStateBatch_effortRatings[];
  todoState: TodoState;
  lockedToUser: setTodoStateBatch_setTodoStateBatch_lockedToUser | null;
}

export interface setTodoStateBatch {
  setTodoStateBatch: setTodoStateBatch_setTodoStateBatch[];
}

export interface setTodoStateBatchVariables {
  choreIds: string[];
  state: TodoState;
}
