/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteInvite
// ====================================================

export interface deleteInvite_deleteInvite_households_members {
  __typename: "User";
  name: string;
  id: string;
}

export interface deleteInvite_deleteInvite_households_invites {
  __typename: "User";
  name: string;
  id: string;
  email: string | null;
}

export interface deleteInvite_deleteInvite_households {
  __typename: "Household";
  members: deleteInvite_deleteInvite_households_members[];
  id: string;
  name: string;
  invites: (deleteInvite_deleteInvite_households_invites | null)[] | null;
}

export interface deleteInvite_deleteInvite_selectedHousehold {
  __typename: "Household";
  id: string;
  name: string;
}

export interface deleteInvite_deleteInvite_invites {
  __typename: "Household";
  name: string;
  id: string;
}

export interface deleteInvite_deleteInvite {
  __typename: "User";
  households: deleteInvite_deleteInvite_households[];
  selectedHousehold: deleteInvite_deleteInvite_selectedHousehold | null;
  invites: (deleteInvite_deleteInvite_invites | null)[] | null;
}

export interface deleteInvite {
  deleteInvite: deleteInvite_deleteInvite | null;
}

export interface deleteInviteVariables {
  email: string;
}
