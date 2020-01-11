/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authenticate
// ====================================================

export interface authenticate_authenticate_selectedHousehold {
  __typename: "Household";
  id: string;
}

export interface authenticate_authenticate_chores {
  __typename: "Chore";
  id: string;
}

export interface authenticate_authenticate {
  __typename: "User";
  id: string;
  name: string;
  email: string | null;
  selectedHousehold: authenticate_authenticate_selectedHousehold | null;
  chores: authenticate_authenticate_chores[];
}

export interface authenticate {
  authenticate: authenticate_authenticate;
}

export interface authenticateVariables {
  idToken: string;
}
