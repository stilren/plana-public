/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TodoState } from "./globalTypes";

// ====================================================
// GraphQL query operation: getMyHouseholdsAndChores
// ====================================================

export interface getMyHouseholdsAndChores_me_selectedHousehold {
  __typename: "Household";
  id: string;
}

export interface getMyHouseholdsAndChores_me_chores {
  __typename: "Chore";
  id: string;
  todoState: TodoState;
}

export interface getMyHouseholdsAndChores_me {
  __typename: "User";
  selectedHousehold: getMyHouseholdsAndChores_me_selectedHousehold | null;
  chores: getMyHouseholdsAndChores_me_chores[];
}

export interface getMyHouseholdsAndChores {
  me: getMyHouseholdsAndChores_me;
}
