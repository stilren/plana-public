/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addEffortCollected
// ====================================================

export interface addEffortCollected_createEffortRating {
  __typename: "Chore";
  name: string;
  id: string;
}

export interface addEffortCollected {
  createEffortRating: addEffortCollected_createEffortRating;
}

export interface addEffortCollectedVariables {
  userId?: string | null;
  choreId: string;
  effortRating: number;
}
