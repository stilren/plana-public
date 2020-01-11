/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TodoState } from "./globalTypes";

// ====================================================
// GraphQL fragment: TodoInList
// ====================================================

export interface TodoInList_household {
  __typename: "Household";
  name: string;
}

export interface TodoInList_assignee {
  __typename: "User";
  name: string;
  givenName: string | null;
}

export interface TodoInList_effortRatings {
  __typename: "EffortRating";
  effort: number;
}

export interface TodoInList {
  __typename: "Chore";
  id: string;
  household: TodoInList_household;
  name: string;
  assignee: TodoInList_assignee | null;
  effortRatings: TodoInList_effortRatings[];
  todoState: TodoState;
}
