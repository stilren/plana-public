/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: choreSub
// ====================================================

export interface choreSub_choreChanges_node {
  __typename: "Chore";
  name: string;
}

export interface choreSub_choreChanges {
  __typename: "ChoreSubscriptionPayload";
  node: choreSub_choreChanges_node | null;
}

export interface choreSub {
  choreChanges: choreSub_choreChanges;
}
