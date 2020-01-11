/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: inviteToHousehold
// ====================================================

export interface inviteToHousehold_createInvite_households_members {
  __typename: "User";
  name: string;
  id: string;
}

export interface inviteToHousehold_createInvite_households_invites {
  __typename: "User";
  name: string;
  id: string;
  email: string | null;
}

export interface inviteToHousehold_createInvite_households {
  __typename: "Household";
  members: inviteToHousehold_createInvite_households_members[];
  id: string;
  name: string;
  invites: (inviteToHousehold_createInvite_households_invites | null)[] | null;
}

export interface inviteToHousehold_createInvite_selectedHousehold {
  __typename: "Household";
  id: string;
  name: string;
}

export interface inviteToHousehold_createInvite_invites {
  __typename: "Household";
  name: string;
  id: string;
}

export interface inviteToHousehold_createInvite {
  __typename: "User";
  households: inviteToHousehold_createInvite_households[];
  selectedHousehold: inviteToHousehold_createInvite_selectedHousehold | null;
  invites: (inviteToHousehold_createInvite_invites | null)[] | null;
}

export interface inviteToHousehold {
  createInvite: inviteToHousehold_createInvite;
}

export interface inviteToHouseholdVariables {
  email: string;
}
