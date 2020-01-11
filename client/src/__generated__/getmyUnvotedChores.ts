/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getmyUnvotedChores
// ====================================================

export interface getmyUnvotedChores_myUnvotedChores {
  __typename: "Chore";
  name: string;
  id: string;
}

export interface getmyUnvotedChores {
  myUnvotedChores: (getmyUnvotedChores_myUnvotedChores | null)[];
}
