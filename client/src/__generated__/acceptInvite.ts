/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: acceptInvite
// ====================================================

export interface acceptInvite_addUserToHousehold_households_members {
  __typename: "User";
  name: string;
  id: string;
}

export interface acceptInvite_addUserToHousehold_households_invites {
  __typename: "User";
  name: string;
  id: string;
  email: string | null;
}

export interface acceptInvite_addUserToHousehold_households {
  __typename: "Household";
  members: acceptInvite_addUserToHousehold_households_members[];
  id: string;
  name: string;
  invites: (acceptInvite_addUserToHousehold_households_invites | null)[] | null;
}

export interface acceptInvite_addUserToHousehold_selectedHousehold {
  __typename: "Household";
  id: string;
  name: string;
}

export interface acceptInvite_addUserToHousehold_invites {
  __typename: "Household";
  name: string;
  id: string;
}

export interface acceptInvite_addUserToHousehold {
  __typename: "User";
  households: acceptInvite_addUserToHousehold_households[];
  selectedHousehold: acceptInvite_addUserToHousehold_selectedHousehold | null;
  invites: (acceptInvite_addUserToHousehold_invites | null)[] | null;
}

export interface acceptInvite {
  addUserToHousehold: acceptInvite_addUserToHousehold;
}

export interface acceptInviteVariables {
  householdId: string;
}
